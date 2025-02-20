import Link from 'next/link'

export const WeddingNav: React.FC = () => {
  return (
    <header className='relative h-16 w-full'>
      <div className='fixed z-40 flex h-20 w-full justify-between bg-[#F9F9F950] backdrop-blur-[20px] backdrop-saturate-150'>
        <nav className='m-auto w-full items-center justify-between px-5 sm:grid sm:max-w-[100ch] md:flex '>
          <Link href='#home' passHref>
            <a title='Home' aria-label='Xi & Phil'>
              Xi & Phil
            </a>
          </Link>
          <div className='flex items-center gap-5'>
            {/* {routes.map(({ route, title }) => (
              <Link key={route} href={route}>
                <a
                  className={`capitalize transition-opacity duration-100 ease-linear hover:opacity-100 ${
                    isActive(route) ? '' : 'opacity-75'
                  }`}
                  onClick={resetTags}
                >
                  {title}
                </a>
              </Link>
            ))}
            <ThemeSwitch /> */}
          </div>
        </nav>
      </div>
    </header>
  )
}
