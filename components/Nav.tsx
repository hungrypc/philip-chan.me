import Link from 'next/link'
import { useRouter } from 'next/router'

import { CurrentActivity } from './CurrentActivity'
import { useTags } from './tags/TagsContext'
import { ThemeSwitch } from './ThemeSwitch'

const routes = [
  { route: '/posts', title: 'posts' },
  { route: '/notes', title: 'notes' },
]

const Nav: React.FC = () => {
  const router = useRouter()
  const { resetTags } = useTags()

  const isActive = (pathname: string) => {
    return router.asPath.includes(pathname)
  }

  return (
    <header className='relative w-full h-16'>
      <div className='fixed h-20 z-40 w-full flex justify-between backdrop-blur-[20px] backdrop-saturate-150 bg-white/50 dark:bg-[#0D0D1050]'>
        <nav className='w-full sm:max-w-[75ch] m-auto sm:grid md:flex px-5 justify-between items-center '>
          <Link href='/' passHref>
            <a title='Home' aria-label='Home'>
              <CurrentActivity />
            </a>
          </Link>
          <div className='flex items-center gap-5'>
            {routes.map(({ route, title }) => (
              <Link key={route} href={route}>
                <a className={`capitalize ${isActive(route) ? '' : 'opacity-50'}`} onClick={resetTags}>
                  {title}
                </a>
              </Link>
            ))}
            <ThemeSwitch />
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Nav