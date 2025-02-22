import { useMemo, useRef } from 'react'

import Link from 'next/link'

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
  // {
  //   id: 'rsvp',
  //   title: 'RSVP',
  // },
]

type Props = {
  rootRef: HTMLDivElement | null
}

export const WeddingNav: React.FC<Props> = ({ rootRef }) => {
  const headerRef = useRef<HTMLDivElement | null>(null)

  const elements = useMemo(() => {
    return routes.map(({ id }) => safelyGetWindow()?.document.getElementById(id)) as Element[]
  }, [])

  const onScreenElement = useGetOnScreenElement(elements, {
    root: rootRef,
    rootMargin: '-60% 0% -60% 0%',
    threshold: 0,
  })
  const visibleAnchorItem = onScreenElement?.id

  return (
    <header className='relative h-24 w-full text-black' ref={headerRef}>
      <div className='fixed z-40 flex h-24 w-full justify-between border border-b-black bg-[#f2ebe2]'>
        <nav className='m-auto w-full items-center justify-between px-5 sm:grid sm:max-w-[120ch] md:flex '>
          <Link href='#home' passHref>
            <a title='Home' aria-label='Xi & Phil'>
              <span className='forum-regular text-4xl'>XI</span>
              <span className='forum-regular text-3xl tracking-tighter'> & </span>
              <span className='forum-regular text-4xl'>PHIL</span>
            </a>
          </Link>
          <div className='mt-1 flex items-center gap-5 sm:mt-0'>
            {routes
              .filter(r => r.id !== 'home')
              .map(({ id, title }) => (
                <Link key={id} href={`#${id}`} passHref>
                  <a
                    className={`text-xl opacity-75 transition-opacity duration-100 ease-linear hover:opacity-100 ${
                      visibleAnchorItem === id ? 'eb-garamond-italic font-semibold opacity-100' : 'eb-garamond-regular'
                    }`}
                  >
                    {title}
                  </a>
                </Link>
              ))}
          </div>
        </nav>
      </div>
    </header>
  )
}
