if (process.env.NODE_ENV === 'development') {
  require('preact/debug')
}

import '@public/styles/font.css'
import '@public/styles/global.css'

// import { AnimatePresence } from 'framer-motion'
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
    <div id='root' className='w-full h-full'>
      <TagsProvider>
        <NavBar />
        {/* <AnimatePresence exitBeforeEnter initial={false}> */}
        <main className='w-full'>
          <Component {...pageProps} />
        </main>
        {/* </AnimatePresence> */}
      </TagsProvider>
    </div>
  </>
)

export default MyApp
