import Image from 'next/image'

import { images } from '@utils/media'

const image = images.me

export const ItsaMe: React.FC = () => (
  <div key={image.src} className='mx-auto sm:mb-4 sm:max-w-md md:max-w-sm'>
    <Image src={image} alt='picture of me' placeholder='blur' objectFit='contain' priority />
  </div>
)
