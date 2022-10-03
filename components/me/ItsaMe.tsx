import Image from 'next/image'

import { images } from '@utils/media'

const image = images[0]

export const ItsaMe: React.FC = () => (
  <div key={image.src} className='mx-auto sm:max-w-md sm:mb-4 md:max-w-sm'>
    <Image src={image} alt='picture of me' placeholder='blur' objectFit='contain' priority />
  </div>
)
