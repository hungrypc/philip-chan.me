if (process.env.NODE_ENV === 'development') {
  require('preact/debug')
}

import { useCallback, useMemo, useState } from 'react'

import { AppProps } from 'next/app'
import Head from 'next/head'
import Link from 'next/link'

import { SEO } from '@components/SEO'
import { GallerySection, HomeSection, WeddingNav } from '@components/wedding'
import { useGetOnScreenElement } from '@utils/hooks'
import { safelyGetWindow } from '@utils/safely-get-window'

const routes = [
  {
    id: 'home',
    title: 'Home',
  },
  {
    id: 'details',
    title: 'Details',
  },
  {
    id: 'travel',
    title: 'Travel',
  },
  {
    id: 'registry',
    title: 'Registry',
  },
  {
    id: 'gallery',
    title: 'Gallery',
  },
]

const Wedding: React.FC<AppProps> = () => {
  const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null)

  const registerRef = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      setRootRef(node)
    }
  }, [])

  const elements = useMemo(() => {
    return routes.map(({ id }) => safelyGetWindow()?.document.getElementById(id)) as Element[]
  }, [])

  const onScreenElement = useGetOnScreenElement(elements, {
    root: rootRef,
    rootMargin: '-45% 0% -45% 0%',
    threshold: 0,
  })
  const visibleAnchorItem = onScreenElement?.id

  return (
    <>
      <Head>
        <link rel='icon' href='/favicon-w.ico' />
      </Head>
      <SEO title='Xi & Phil' description="Xi & Phil's Wedding Site" />
      <div id='wedding-root' className='h-full w-full' ref={registerRef}>
        <WeddingNav visibleAnchorItem={visibleAnchorItem} routes={routes} />
        <HomeSection visibleAnchorItem={visibleAnchorItem} />
        <section
          id={routes[1].id}
          className='w-full scroll-mt-24 scroll-pt-24 bg-[#f2ebe2] py-24 px-4 text-black sm:p-12'
        >
          <div className='mx-auto flex h-min flex-col gap-16 text-center sm:h-[535px] sm:max-w-[140ch] md:gap-1'>
            <div className='m-auto flex h-full w-full flex-col items-center justify-center'>
              <h2 className='forum-regular mb-4 uppercase'>~ Arrival ~</h2>
              <div className='poppins-light text-xs uppercase'>
                <div>Saturday July 12 2025</div>
                <div>4:30PM ~ 5PM</div>
                <div>The Vancouver Club</div>
                <div className='font-medium underline'>
                  <Link href='https://g.co/kgs/e79pNRg'>
                    <a target='_blank' rel='noopener noreferrer'>
                      915 W Hastings St, Vancouver, BC V6C 1C6, Canada
                    </a>
                  </Link>
                </div>
              </div>
              <div className='eb-garamond-italic mt-3 text-lg'>black tie attire</div>
            </div>
            <div className='m-auto flex h-full w-full flex-col justify-center gap-20 align-middle sm:flex-row sm:gap-12'>
              <div className='m-auto flex h-full w-full flex-col justify-center align-middle'>
                <h2 className='forum-regular mb-4 uppercase'>~ Ceremony ~</h2>
                <div className='poppins-light text-xs uppercase'>
                  <div>5PM ~ 6PM</div>
                  <div>The Vancouver Club - The Georgian Room</div>
                </div>
              </div>
              <div className='m-auto flex h-full w-full flex-col justify-center align-middle'>
                <h2 className='forum-regular mb-4 uppercase'>~ Reception ~</h2>
                <div className='poppins-light text-xs uppercase'>
                  <div>7PM ~ 11PM</div>
                  <div>The Vancouver Club - The Ballroom</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          id={routes[2].id}
          className='h-min w-full scroll-mt-24 scroll-pt-24 bg-black p-12 px-8 pb-24 text-[#f2ebe2] sm:px-12'
        >
          <div className='mx-auto flex flex-col text-center sm:max-w-[120ch]'>
            <h1 className='forum-regular mb-8 uppercase'>{routes[2].title}</h1>
            <div className='flex flex-col gap-8 lg:flex-row'>
              <div id='my-map-canvas' className='h-[400px] w-full overflow-hidden sm:min-w-[500px] lg:max-w-[500px]'>
                <iframe className='h-full w-full border-0' frameBorder='0' src='https://shorturl.at/T1GlE' />
              </div>
              <div className='forum-regular flex flex-col gap-4 text-start text-xl font-thin tracking-normal'>
                <div>
                  Far be it from us to tell you where to stay, but there are{' '}
                  <span className='underline'>
                    <Link href='https://shorturl.at/h4DxA'>
                      <a target='_blank'>many hotels</a>
                    </Link>
                  </span>{' '}
                  and{' '}
                  <span className='underline'>
                    <Link href='https://shorturl.at/A8RY8'>
                      <a target='_blank'>airbnbs</a>
                    </Link>
                  </span>{' '}
                  within walking distance from the Vancouver Club.
                </div>
                <div>
                  The venue is also only a block or two away from{' '}
                  <span className='underline'>
                    <Link href='https://shorturl.at/RVJfr'>
                      <a target='_blank'>Waterfront Station</a>
                    </Link>
                  </span>
                  , making it easily accessible by train for any who may want to come by public transport.
                </div>
                <div>
                  For those driving, metered parking is available behind the Club along West Cordova Street.
                  Additionally, underground parking can be found in the EasyPark Parkade at 900 West Cordova Street.
                </div>
                <div>Otherwise, Ubers and Lyfts are readily accessible throughout the city.</div>
              </div>
            </div>
          </div>
        </section>
        <section
          id={routes[3].id}
          className='min-h-[400px] w-full scroll-mt-24 scroll-pt-24 bg-[#f2ebe2] p-12 px-8 pb-24 text-black sm:h-min sm:px-12'
        >
          <div className='mx-auto text-center sm:max-w-[120ch]'>
            <h1 className='forum-regular mb-8 uppercase'>{routes[3].title}</h1>
            <div className='forum-regular text-start text-xl font-thin tracking-normal'>
              <div>
                Your presence at our wedding is all we could ever ask for, and we&apos;re so grateful to have you
                celebrate with us~! 🥰
              </div>
              <div>
                While we don&apos;t have a traditional registry, we would be grateful for any contributions toward our
                future together. Your generosity will help us as we begin this exciting new chapter. Interac e-transfers
                are accepted at <span className='underline'>philipchanhk626@gmail.com</span>. For venmo, please use
                <a className='underline' href='https://venmo.com/u/Xi-Lin-1'>
                  @Xi-Lin-1
                </a>
              </div>
              <br />
              <div>
                For those who are from out of town or who would prefer a cash, we will also be accepting cash gifts in
                red envelopes.
              </div>
            </div>
          </div>
        </section>
        <GallerySection id={routes[4].id} />
      </div>
    </>
  )
}

export default Wedding
