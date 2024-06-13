import { FaSearch } from 'react-icons/fa'
import {Link} from 'react-router-dom'

export default function Header() {
  return (
      <header className='bg-sky-200/80 shadow-md'>
          
          <div className='flex justify-between items-center max-w-6xl mx-auto p-4'>
              <Link to='/'>
          <h1 className='font-bold text-base sm:text-4xl flex flex-wrap'>
          <span className='text-sky-400'>Real</span>
          <span>Estate</span>
              </h1>
              </Link>

              <form className='bg-sky-50 p-4 rounded-lg text-base sm:text-xl flex items-center'>
                  <input type="text"
                      placeholder='Search'
                      className='bg-transparent focus:outline-none w- sm:w-80' />
                  <FaSearch />
              </form>

              <ul className='flex gap-6 text-base sm:text-2xl font-semibold'>
                  <Link to='/'>
                  <li className='hidden sm:inline hover:text-sky-400 active:text-sky-600 focus:outline-none focus:underline focus:text-sky-400 '>Home</li>
                  </Link>
                  <Link to='/about'>
                  <li className='hidden sm:inline hover:text-sky-400 active:text-sky-600 focus:text-underline '>About</li>
                  </Link>    
                  <Link to='/sign-in'>
                  <li className='sm:inline hover:text-sky-400 active:text-sky-600 focus:underline '>SignIn</li>
                  </Link>
              </ul>
          </div>
      </header>
  )
}