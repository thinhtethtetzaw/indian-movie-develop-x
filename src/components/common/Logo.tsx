import React from 'react'
import LogoSvg from '@/assets/svgs/logo.svg'

interface LogoProps {
  className?: string
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return <img src={LogoSvg} alt="Logo" className={`${className}`} />
}

export default Logo
