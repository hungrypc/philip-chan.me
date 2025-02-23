import React, { useState } from 'react'

import Image from 'next/image'

import { wedding } from '@utils/media'

const images = wedding.landing

type Props = {
  visibleAnchorItem: string
}

export const HomeSection: React.FC<Props> = ({ visibleAnchorItem }) => {
  const [isClicked, setIsClicked] = useState(false)

  return (
    <section id='home' className='w-full overflow-hidden bg-black text-[#f2ebe2] sm:h-screen'>
      <div className='overlapGrid h-full w-full justify-center overflow-hidden align-middle'>
        <Image
          className={`relative z-10 ${
            isClicked || visibleAnchorItem === 'home' ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-1000 ease-linear`}
          src={images.cover_bg1c}
          alt='bg-cover'
          placeholder='blur'
          objectFit='cover'
          priority
          onClick={() => setIsClicked(!isClicked)}
        />
        <Image
          className='relative'
          src={images.cover_bg1}
          alt='bg-cover'
          placeholder='blur'
          objectFit='cover'
          priority
        />
      </div>
    </section>
  )
}
