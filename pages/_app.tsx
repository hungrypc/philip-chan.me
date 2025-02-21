if (process.env.NODE_ENV === 'development') {
  require('preact/debug')
}

import '@public/styles/font.css'
import '@public/styles/global.css'

import { AppProps } from 'next/app'
import Head from 'next/head'

import { TagsProvider } from '@components/content'
import { NavBar } from '@components/navigation'
import { SEO } from '@components/SEO'

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => (
  <>
    <Head>
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <link rel='preload' href='/fonts/iAWriterQuattroV.ttf' as='font' crossOrigin='' type='font/ttf' />
    </Head>
    <SEO />
    <div id='root' className='h-full w-full'>
      <TagsProvider>
        <NavBar />
        <main className='h-full w-full'>
          <Component {...pageProps} />
        </main>
      </TagsProvider>
    </div>
  </>
)

export default MyApp
