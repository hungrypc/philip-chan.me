if (process.env.NODE_ENV === 'development') {
  require('preact/debug')
}

import { AppProps } from 'next/app'
import Head from 'next/head'

import { WeddingNav } from '@components/wedding'

const Wedding: React.FC<AppProps> = () => (
  <>
    <Head>
      <link rel='preload' href='/fonts/Poppins-Light.ttf' as='font' crossOrigin='' type='font/ttf' />
      <link rel='preload' href='/fonts/GaramondPremrPro.woff' as='font' crossOrigin='' type='font/woff' />
      <link rel='preload' href='/fonts/EBGaramond-Italic.ttf' as='font' crossOrigin='' type='font/ttf' />
    </Head>
    <div id='wedding-root' className='h-full w-full'>
      <WeddingNav />
    </div>
  </>
)

export default Wedding
