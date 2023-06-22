import React from 'react'
import logo from "../assest/logo.png"
import { Link } from 'react-router-dom'
import { FaUserAlt } from 'react-icons/fa'
import { BsCartFill } from 'react-icons/bs'

const Header = () => {
  return (
    <header className='fixed shadow-md w-full h-16 px-2 md:px-4'>
         { /* desktop */}

        <div className='flex items-center h-full justify-between'>
            <Link to={""}>
              <div className='h-10'>
                  <img src={logo} className='h-full' alt="" />
              </div>
            </Link>

            <div className='flex items-center gap-4 md:gap-7'>
              <nav className='flex gap-4 md:gap-7 text-base md:text-lg'>
                <Link to={""}>Home</Link>
                <Link to={"menu"}>Menu</Link>
                <Link to={"about"}>About</Link>
                <Link to={"contact"}>Contact</Link>
              </nav>
              <div className='text-2xl text-slate-600'>
                <BsCartFill />
              </div>
              <div className='text-2xl text-slate-600'>
                <FaUserAlt />
              </div>
            </div>
        </div>

         { /* mobile */}
    </header>
  )
}

export default Header