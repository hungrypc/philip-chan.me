import { useEffect, useRef, useState } from 'react'

import { safelyGetWindow } from '@utils/safely-get-window'

export const useGetOnScreenElement = (elements: Element[], options: Required<IntersectionObserverInit>) => {
  const window = safelyGetWindow()
  const [intersectElement, setIntersectElement] = useState<Element[]>([])

  const scrollDirection = useRef<'up' | 'down'>('down')
  const prevScrollY = useRef<number>(0)
  const observer = useRef<IntersectionObserver>()

  const handleScroll = () => {
    const scrollY = window?.scrollY ?? 0
    if (scrollY > prevScrollY.current) {
      scrollDirection.current = 'down'
    } else {
      scrollDirection.current = 'up'
    }

    prevScrollY.current = scrollY
  }

  const getTargetSection = (entry: IntersectionObserverEntry) => {
    if (scrollDirection.current === 'down') {
      setIntersectElement([entry.target.nextElementSibling ?? entry.target])
    } else {
      setIntersectElement([entry.target])
    }
  }

  const shouldUpdate = (entry: IntersectionObserverEntry) => {
    if (scrollDirection.current === 'down' && !entry.isIntersecting) {
      return true
    }

    if (scrollDirection.current === 'up' && entry.isIntersecting) {
      return true
    }

    return false
  }

  useEffect(() => {
    observer.current = new IntersectionObserver(entries => {
      handleScroll()
      entries.forEach((entry: IntersectionObserverEntry) => {
        if (!shouldUpdate(entry)) {
          return
        }

        getTargetSection(entry)
      })
    }, options)

    for (const element of elements) {
      observer.current && observer.current.observe(element)
    }
    return () => {
      observer.current && observer.current.disconnect()
    }
  }, [window])

  return intersectElement[0]
}
