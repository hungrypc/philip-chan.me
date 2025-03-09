import React, { useEffect, useState } from 'react'

import Image from 'next/image'

import { useWindowSize } from '@utils/hooks'
import { wedding } from '@utils/media'

const image1 = wedding.gallery.gallery_1
const image2 = wedding.gallery.gallery_2
const image3 = wedding.gallery.gallery_3
const image4 = wedding.gallery.gallery_4
const image5 = wedding.gallery.gallery_5
const image6 = wedding.gallery.gallery_6
const image7 = wedding.gallery.gallery_7
const image8 = wedding.gallery.gallery_8

type Props = {
  id: string
}

export const GallerySection: React.FC<Props> = ({ id }) => {
  const [imgIndex, setImgIndex] = useState(0)
  const { isMobile } = useWindowSize()

  const triggerNextImg = () => {
    setImgIndex(prevIndex => {
      const nextIndex = (prevIndex + 1) % (isMobile ? 8 : 6)
      return nextIndex
    })
  }

  const triggerPrevImg = () => {
    setImgIndex(prevIndex => {
      const prevIndexValue = prevIndex - 1
      const nextIndex = prevIndexValue < 0 ? (isMobile ? 8 : 6) - 1 : prevIndexValue
      console.log(nextIndex)
      return nextIndex
    })
  }

  useEffect(() => {
    const interval = setInterval(() => {
      triggerNextImg()
    }, 5000)

    return () => clearInterval(interval)
  })

  return (
    <section id={id} className='w-full overflow-hidden bg-black text-[#f2ebe2] sm:h-full'>
      <div className='overlapGrid h-full w-full overflow-hidden'>
        <div className='relative z-20 flex h-full w-full flex-row'>
          <div className='h-full w-full cursor-pointer' onClick={() => triggerPrevImg()} />
          <div className='h-full w-full' />
          <div className='h-full w-full cursor-pointer' onClick={() => triggerNextImg()} />
        </div>
        <Image
          className={`relative z-10 h-full w-full pl-52 transition-opacity duration-700 ease-linear sm:pl-0 ${
            imgIndex === 0 ? 'opacity-100' : 'opacity-0'
          }`}
          src={image4}
          alt='bg-cover'
          placeholder='blur'
          objectFit='cover'
          priority
          objectPosition={'top'}
        />
        {isMobile ? (
          <>
            <Image
              className={`relative z-10 transition-opacity duration-700 ease-linear ${
                imgIndex === 1 ? 'opacity-100' : 'opacity-0'
              }`}
              src={image2}
              alt='bg-cover'
              placeholder='blur'
              objectFit='cover'
              priority
            />
            <Image
              className={`relative z-10 transition-opacity duration-700 ease-linear ${
                imgIndex === 2 ? 'opacity-100' : 'opacity-0'
              }`}
              src={image3}
              alt='bg-cover'
              placeholder='blur'
              objectFit='cover'
              priority
            />
          </>
        ) : (
          <div
            className={`z-10 flex w-full flex-row justify-center overflow-hidden align-middle transition-opacity duration-700 ease-linear sm:h-full ${
              imgIndex === 1 ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image src={image2} alt='bg-cover' placeholder='blur' objectFit='cover' priority />
            <Image src={image3} alt='bg-cover' placeholder='blur' objectFit='cover' priority />
          </div>
        )}
        <div
          className={`z-10 w-full transition-opacity duration-700 ease-linear sm:relative sm:h-full ${
            imgIndex === (isMobile ? 3 : 2) ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className='max-h-fit scale-125 sm:absolute sm:top-[-20vw] sm:scale-110 md:top-[-40vw] lg:top-[-60vw]'>
            <Image src={image1} alt='bg-cover' placeholder='blur' objectFit='cover' priority />
          </div>
        </div>
        {isMobile ? (
          <>
            <Image
              className={`relative z-10 transition-opacity duration-700 ease-linear ${
                imgIndex === 4 ? 'opacity-100' : 'opacity-0'
              }`}
              src={image5}
              alt='bg-cover'
              placeholder='blur'
              objectFit='cover'
              priority
            />
            <Image
              className={`relative z-10 transition-opacity duration-700 ease-linear ${
                imgIndex === 5 ? 'opacity-100' : 'opacity-0'
              }`}
              src={image6}
              alt='bg-cover'
              placeholder='blur'
              objectFit='cover'
              priority
            />
          </>
        ) : (
          <div
            className={`z-10 flex w-full flex-row justify-center overflow-hidden align-middle transition-opacity duration-700 ease-linear sm:h-full ${
              imgIndex === 3 ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image src={image5} alt='bg-cover' placeholder='blur' objectFit='cover' priority />
            <Image src={image6} alt='bg-cover' placeholder='blur' objectFit='cover' priority />
          </div>
        )}
        <Image
          className={`relative z-10 h-full w-full pl-52 transition-opacity duration-700 ease-linear sm:pl-0 ${
            imgIndex === (isMobile ? 6 : 4) ? 'opacity-100' : 'opacity-0'
          }`}
          src={image7}
          alt='bg-cover'
          placeholder='blur'
          objectFit='cover'
          priority
          objectPosition={isMobile ? '20% 50%' : 'center'}
        />
        <Image
          className={`relative z-10 h-full w-full pl-52 transition-opacity duration-700 ease-linear sm:pl-0 ${
            imgIndex === (isMobile ? 7 : 5) ? 'opacity-100' : 'opacity-0'
          }`}
          src={image8}
          alt='bg-cover'
          placeholder='blur'
          objectFit='cover'
          priority
          objectPosition={'top'}
        />
      </div>
    </section>
  )
}
