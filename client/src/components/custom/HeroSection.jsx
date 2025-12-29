import React from 'react'
import marvelLogo from '../../assets/marvelLogo.svg'

const HeroSection = () => {
  return (
    <div className='bg-[url("@/assets/backgroundImage.png")] bg-cover bg-center h-screen relative'>
      <div className="absolute inset-0 flex items-center justify-start pl-10">
        <div className="text-left text-white">
          <img src={marvelLogo} alt="Marvel Logo" className="w- h-16 mb-4" />
          <h1 className="text-6xl font-bold w-100">Guardians Of The Galaxy</h1>
        </div>
      </div>
    </div>
  )
}

export default HeroSection