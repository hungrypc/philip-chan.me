import { safelyGetWindow } from '@utils/safely-get-window'
import { useEffect, useRef, useState } from 'react'

export const useGetOnScreenElements = (
  elements: Element[],
  options?: IntersectionObserverInit,
  rootId?: string,
) => {
  const window = safelyGetWindow()
  const root = rootId ? window?.document.getElementById(rootId) : null
  const [intersectingElements, setIntersectingElements] = useState<Element[]>([])
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down')
  // const [prevScrollY, setPrevScrollY] = useState<number>(0)
  const prevScrollY = useRef<number>(0)

  const observer = useRef<IntersectionObserver>()

  useEffect(() => {
    observer.current = new IntersectionObserver(entries => {
      const scrollY = window?.scrollY ?? 0
      console.log('scrollY', scrollY, prevScrollY.current)
      prevScrollY.current = scrollY
      console.log('scrollDirection', scrollDirection)
      
      setIntersectingElements(() => {
        const elementsWithinViewbox: Element[] = []

        entries.forEach((entry: IntersectionObserverEntry) => {
          entry.isIntersecting && elementsWithinViewbox.push(entry.target)
        })

        return elementsWithinViewbox
      })
    }, options)

    for (const element of elements) {
      observer.current && observer.current.observe(element)
    }
    return () => {
      observer.current && observer.current.disconnect()
    }
  }, [window])

  return intersectingElements
}
