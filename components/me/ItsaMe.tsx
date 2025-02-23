import Image from 'next/image'

import { me } from '@utils/media'

export const ItsaMe: React.FC = () => (
  <div key={me.src} className='mx-auto sm:mb-4 sm:max-w-md md:max-w-sm'>
    <Image src={me} alt='picture of me' placeholder='blur' objectFit='contain' priority />
  </div>
)
