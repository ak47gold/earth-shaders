import React from 'react'
import Image from 'next/image'

function Overlay() {
  return (
    <div className="w-full h-full absolute top-0 left-0 pointer-events-none">
        <div className="bg" />
        <Image
            src="/logo-nexus.svg"
            alt="Nexus Logo"
            className="absolute top-16 left-14 m-0 p-0"
            width={200}
            height={24}
            priority
        />
        <a href="http://coopersystem.com.br" className="absolute left-16 top-14" children="Coopersystem" />
        {/* <a href="" className="top-right" children="@react-three/fiber" /> */}
        {/* <a href="" className="bottom-left" children="@react-three/fiber" /> */}
        
        {/* <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            >
            <Image
                src="/logo-nexus.svg"
                alt="Nexus Logo"
                className="dark:invert"
                width={100}
                height={24}
                priority
            />
        </a> */}
        <div className="layer" />
        
    </div>
  )
}

export default Overlay