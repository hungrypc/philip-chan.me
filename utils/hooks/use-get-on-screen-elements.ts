import { useEffect, useRef, useState } from 'react'

export const useGetOnScreenElements = (elements: Element[], options?: IntersectionObserverInit) => {
  const [intersectingElements, setIntersectingElements] = useState<Element[]>([])
  const observer = useRef<IntersectionObserver>()

  useEffect(() => {
    observer.current = new IntersectionObserver(entries => {
      setIntersectingElements(() => {
        const elementsWithinViewbox: Element[] = []
        entries.forEach(entry => {
          entry.isIntersecting && elementsWithinViewbox.push(entry.target)
        })
        return elementsWithinViewbox
      })
    }, options)

    elements.map(el => observer.current && observer.current.observe(el))
    return () => {
      observer.current && observer.current.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return intersectingElements
}
