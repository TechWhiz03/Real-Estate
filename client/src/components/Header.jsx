import { FaSearch } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react';

export default function Header() {

    const { currentUser } = useSelector(state => state.user)
    const [ searchTerm, setSearchTerm ] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
    }, [ location.search ]);

    return (
        <header className='bg-sky-200/80 shadow-md'>

            <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
                <Link to='/'>
                    <h1 className='font-bold text-base sm:text-2xl flex flex-wrap'>
                        <span className='text-sky-500'>Real</span>
                        <span>Estate</span>
                    </h1>
                </Link>

                <form
                    onSubmit={handleSubmit}
                    className='bg-sky-50 p-3 rounded-lg flex items-center'>
                    <input type="text"
                        placeholder='Search'
                        className='bg-transparent focus:outline-none w-24 sm:w-64'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button>
                        <FaSearch className='text-sky-600' />
                    </button>
                </form>

                <ul className='flex gap-6 font-semibold'>
                    <Link to='/'>
                        <li className='hidden sm:inline hover:text-sky-600 active:text-sky-400'>Home</li>
                    </Link>
                    <Link to='/about'>
                        <li className='hidden sm:inline hover:text-sky-600 active:text-sky-400'>About</li>
                    </Link>
                    <Link to='/profile'>
                        {currentUser
                            ? (<img
                                className='rounded-full h-7 w-7 object-cover'
                                src={currentUser.data.avatar} alt="profile" />)
                            : (<li className='hover:text-sky-600 active:text-sky-400'>Sign In</li>)
                        }
                    </Link>
                </ul>
            </div>
        </header>
    )
}