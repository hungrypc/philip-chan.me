import React, { useEffect, useMemo } from 'react'

import { signal } from '@preact/signals'
import { useGetOnScreenElements } from '@utils/hooks'
import { safelyGetWindow } from '@utils/safely-get-window'

export const activeItem = signal('')

type Props = {
  toc: TOCItem[]
}

export const useVisibleAnchorItem = ({ toc }: { toc: TOCItem[] }) => {
  const elements = useMemo(() => {
    const results: Element[] = []
    toc.forEach(({ id }) => {
      const element = safelyGetWindow()?.document.getElementById(id)
      if (element) {
        results.push(element)
      }
    })

    return results
  }, [toc])
  const onScreenElements = useGetOnScreenElements(elements)

  return onScreenElements[0]?.id ?? (activeItem.value || toc[0].id)
}

export const NavSidebar: React.FC<Props> = ({ toc }) => {
  const visibleAnchorItem = useVisibleAnchorItem({ toc })

  useEffect(() => {
    const isActive = (item: TOCItem) => visibleAnchorItem === item.id
    activeItem.value = toc.find(isActive)?.id || toc[0].id
  }, [toc, visibleAnchorItem])

  return (
    <div className='relative hidden pr-4 md:block'>
      <aside className='sticky top-24 right-0'>
        <ul>
          {toc.map(({ id, text }) => (
            <li key={id} className={activeItem.value === id ? 'link-toc-active ' : 'opacity-[.60]'}>
              <a href={`#${id}`}>{text}</a>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  )
}
