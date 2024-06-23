import { useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { app } from '../firebase'
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Profile() {

  const { currentUser, loading, error } = useSelector(state => state.user)
  const fileRef = useRef(null)
  const dispatch = useDispatch();

  const [ file, setFile ] = useState(undefined)
  const [ filePerc, setFilePerc ] = useState(0);
  const [ fileUploadError, setFileUploadError ] = useState(false);
  const [ formData, setFormData ] = useState({});
  const [ updateSuccess, setUpdateSuccess ] = useState(false);

  useEffect(() => {
    if (file) {
      handleFileUpload(file)
    }
  }, [ file ])

  const handleFileUpload = (file) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      () => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [ e.target.id ]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser.data._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser.data._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/user/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  return (
    <div
      className='p-3 max-w-lg mx-auto'>
      <h1
        className="text-3xl font-semibold text-center my-7">
        Profile
      </h1>

      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-4'>
        <input
          onChange={(e) => setFile(e.target.files[ 0 ])}
          type="file"
          ref={fileRef}
          hidden accept='image/*'
        />

        <img
          onClick={() => fileRef.current.click()}
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
          src={formData.avatar || currentUser.data.avatar} alt="profile" />
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
        <input
          type="text"
          placeholder='username'
          id='username'
          defaultValue={currentUser.data.username}
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder='email'
          id='email'
          defaultValue={currentUser.data.email}
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder='password'
          id='password'
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className='bg-sky-600 text-white p-3 rounded-lg hover:opacity-90 active:bg-sky-500  disabled:opacity-80'>
          {loading ? 'Loading...' : 'UPDATE'}
        </button>

        <Link
          className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'
          to={'/create-listing'} >
          Create Listing
        </Link>
      </form>

      <div
        className='flex justify-between mt-5'>
        <span
          onClick={handleDeleteUser}
          className='text-red-700 cursor-pointer hover:opacity-85'>
          Delete Account
        </span>
        <span
          onClick={handleSignOut}
          className='text-red-700 cursor-pointer hover:opacity-85'>
          Sign Out
        </span>
      </div>

      <p className='text-red-700 mt-5'>
        {error ? error : ''}</p>
      <p className='text-green-700 mt-5'>
        {updateSuccess ? 'User is updated successfully!' : ''}
      </p>
    </div>
  )
}
