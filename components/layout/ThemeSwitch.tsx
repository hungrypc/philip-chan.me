import { useEffect, useState } from 'react'

import dynamic from 'next/dynamic'
import Head from 'next/head'
import { Props } from 'react-toggle-dark-mode'

import { setLocalStorage } from '@utils/localStorage'

const DarkModeSwitch = dynamic<Props>(() => import('react-toggle-dark-mode').then(mod => mod.DarkModeSwitch), {
  loading: () => <div className='h-5 w-5'></div>,
})

type ColorTheme = 'light' | 'dark'

export const ThemeSwitch: React.FC = () => {
  const COLOR_THEME = 'theme'

  const [theme, setTheme] = useState<ColorTheme>('dark')

  useEffect(() => {
    const theme = (document.body.getAttribute('class') as ColorTheme) || 'dark'
    setTheme(theme)
  }, [])

  const switchTheme = () => {
    const bodyClass = document.body.classList

    if (theme === 'dark') {
      setTheme('light')
      setLocalStorage<ColorTheme>(COLOR_THEME, 'light')

      bodyClass.add('light')
      bodyClass.remove('dark')
    } else {
      setTheme('dark')
      setLocalStorage<ColorTheme>(COLOR_THEME, 'dark')

      bodyClass.add('dark')
      bodyClass.remove('light')
    }
  }

  return (
    <>
      <Head>
        <meta name='theme-color' content={theme === 'dark' ? '#000' : '#fdfdfd'} />
      </Head>
      <div className='flex h-5 w-5 items-center bg-transparent'>
        <DarkModeSwitch checked={theme === 'dark'} onChange={switchTheme} moonColor='white' sunColor='black' />
      </div>
    </>
  )
}
