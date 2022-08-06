import Image from 'next/image'

import { images } from '@utils/media'

const image = images[0]

export const ItsaMe: React.FC = () => (
  <div key={image.src} className='max-w-lg mx-auto'>
    <Image
      className='z-10'
      src={image}
      alt='picture of me'
      placeholder='blur'
      objectFit='contain'
      layout='responsive'
      priority
    />
  </div>
)
