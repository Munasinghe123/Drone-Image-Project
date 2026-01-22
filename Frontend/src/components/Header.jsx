import React, { useState } from 'react'
import Logo from '../Images/Leco.png'
import { Link } from 'react-router-dom'

function Header() {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-7xl">
      <div className="h-20 px-8 flex items-center justify-between 
                      bg-purple-800/90 backdrop-blur-xl
                      rounded-full shadow-2xl">

        <Link to="/">
          <div className="flex items-center space-x-3 group cursor-pointer">
            
            <div className="h-12 w-12 rounded-2xl 
                    bg-white flex items-center justify-center
                    shadow-md group-hover:shadow-purple-400/50
                    transition-all duration-300">

              <img
                src={Logo}
                alt="SkyEye Logo"
                className="h-7 w-7"
              />
            </div>

            <div className="flex flex-col leading-none">
              <span className="text-white font-extrabold tracking-widest text-lg">
                SKY<span className="text-purple-300">EYE</span>
              </span>
              <span className="text-purple-200 text-xs tracking-wider">
                Grid Intelligence
              </span>
            </div>

          </div>
        </Link>


        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Link to="/login">
            <button
              className="bg-white text-purple-800 font-semibold
                         px-6 py-2 rounded-full
                         hover:bg-purple-100 transition-all duration-300"
            >
              Login
            </button>
          </Link>
        </div>

      </div>
    </div>
  )
}

export default Header
