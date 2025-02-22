import { useEffect, useRef, useState } from 'react'

export const useGetOnScreenElements = (elements: Element[], options?: IntersectionObserverInit) => {
  const [intersectingElements, setIntersectingElements] = useState<Element[]>([])
  const observer = useRef<IntersectionObserver>()

  useEffect(() => {
    observer.current = new IntersectionObserver(entries => {
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
