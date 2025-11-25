import React from 'react'
import logo_grande from "./assets/MondAIA_logo1.png"

const Hero = () => {
  return (
    <div className='text-center mt-4'>
    <img 
        src={logo_grande} 
        alt="logo_horizontal" 
        className="mx-auto mt-4"
    />
    <div className='mt-4'> tu tiempo, eficiente</div>
    </div>
  )
}

export default Hero