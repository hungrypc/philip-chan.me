import Image from 'next/image'

import { images } from '@utils/media'

const image = images[0]

export const ItsaMe: React.FC = () => (
  <div key={image.src} className='max-w-xl mx-auto'>
    <Image
      className='z-10'
      src={image}
      alt='picture of me'
      placeholder='blur'
      objectFit='contain'
      layout='responsive'
      sizes='375 425 600'
      priority
    />
  </div>
)
