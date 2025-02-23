import { useEffect, useState } from 'react'

import { safelyGetWindow } from '@utils/safely-get-window'

type WindowSize = {
  width?: number
  height?: number
}

export const useWindowSize = () => {
  const window = safelyGetWindow()
  const [windowSize, setWindowSize] = useState<WindowSize>()

  const isLandscape: boolean | undefined =
    windowSize?.width && windowSize?.height ? windowSize.width > windowSize.height : undefined
  const isMobile: boolean | undefined = windowSize?.width ? windowSize.width < 1000 : undefined

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window?.innerWidth,
        height: window?.innerHeight,
      })
    }

    window?.addEventListener('resize', handleResize)
    handleResize()

    return () => window?.removeEventListener('resize', handleResize)
  }, [window])

  return {
    width: windowSize?.width,
    height: windowSize?.height,
    isLandscape,
    isMobile,
  }
}
