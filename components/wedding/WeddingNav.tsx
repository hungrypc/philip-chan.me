import React from 'react'

import Link from 'next/link'

type Props = {
  routes: { id: string; title: string }[]
  visibleAnchorItem: string
}

export const WeddingNav: React.FC<Props> = ({ routes, visibleAnchorItem }) => {
  return (
    <header className='relative h-24 w-full text-black'>
      <div className='fixed z-50 flex h-24 w-full justify-between border border-b-black bg-[#f2ebe2]'>
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
