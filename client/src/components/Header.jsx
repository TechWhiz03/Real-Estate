import { FaSearch } from 'react-icons/fa'
import {Link} from 'react-router-dom'

export default function Header() {
  return (
      <header className='bg-sky-200/80 shadow-md'>
          
          <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
              <Link to='/'>
          <h1 className='font-bold text-base sm:text-2xl flex flex-wrap'>
          <span className='text-sky-400'>Real</span>
          <span>Estate</span>
              </h1>
              </Link>

              <form className='bg-sky-50 p-3 rounded-lg flex items-center'>
                  <input type="text"
                      placeholder='Search'
                      className='bg-transparent focus:outline-none w-24 sm:w-64' />
                  <FaSearch />
              </form>

              <ul className='flex gap-6 font-semibold'>
                  <Link to='/'>
                  <li className='hidden sm:inline hover:text-sky-600 active:text-sky-400'>Home</li>
                  </Link>
                  <Link to='/about'>
                  <li className='hidden sm:inline hover:text-sky-600 active:text-sky-400'>About</li>
                  </Link>    
                  <Link to='/sign-up'>
                  <li className='hover:text-sky-600 active:text-sky-400'>Sign In</li>
                  </Link>
              </ul>
          </div>
      </header>
  )
}