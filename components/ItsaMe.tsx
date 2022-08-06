import Image from 'next/image'

import { images } from '@utils/media'

const image = images[0]

export const ItsaMe: React.FC = () => {
  return (
    <div key={image.src} className='max-w-xl mx-auto'>
      <Image
        src={image}
        alt='picture of the author'
        placeholder='blur'
        objectFit='contain'
        className='z-10'
        priority
        blurDataURL={image.blurDataURL}
      />
    </div>
  )
}
