import React, { useEffect } from 'react'

import { debounce } from 'lodash'

import { signal } from '@preact/signals'
import { safelyGetWindow } from '@utils/safely-get-window'

const activeItem = signal('')
const containerAnchorPoints = signal({ containerNodeScrollTop: 0, containerNodeScrollBottom: 0 })

const setContainerAnchorPoints = (containerNode: Element) => {
  const containerNodeRect = containerNode.getBoundingClientRect()
  containerAnchorPoints.value = {
    containerNodeScrollTop: containerNode.scrollTop,
    containerNodeScrollBottom: containerNodeRect.height,
  }
}

const TOCHeader: React.FC<{ id: string; children: React.ReactNode }> = ({ id, ...props }) => (
  <li className={activeItem.value === id ? 'link-toc-active ' : 'opacity-[.60]'}>
    <a href={`#${id}`} {...props} />
  </li>
)

type Props = {
  toc: { id: string; text: string }[]
}

export const NavSidebar: React.FC<Props> = ({ toc }) => {
  const getElementAnchorPoints = () => {
    return toc.map(({ id }) => {
      const anchorNode = safelyGetWindow()?.document.getElementById(id)

      if (anchorNode) {
        const anchorNodeRect = anchorNode.getBoundingClientRect()
        const anchorNodeScrollTop = anchorNodeRect.top
        const anchorNodeScrollBottom = anchorNodeScrollTop + anchorNodeRect.height

        return { id, anchorNodeScrollTop, anchorNodeScrollBottom }
      }
    })
  }

  const handleScroll = debounce(() => {
    const anchorPoints = getElementAnchorPoints()
    const { containerNodeScrollTop, containerNodeScrollBottom } = containerAnchorPoints.value

    for (let i = 0; i < anchorPoints.length; i++) {
      const element = anchorPoints[i]
      if (!element) continue
      if (i === anchorPoints.length - 1) {
        activeItem.value = element.id
        break
      }

      const { id, anchorNodeScrollTop, anchorNodeScrollBottom } = element
      const isElementInViewport = [
        anchorNodeScrollTop < containerNodeScrollBottom,
        anchorNodeScrollBottom > containerNodeScrollTop,
      ].every(v => v)

      const nextElement = anchorPoints[i + 1]
      const isNextElementUpcoming = nextElement && nextElement.anchorNodeScrollBottom > containerNodeScrollBottom

      if (isElementInViewport || isNextElementUpcoming) {
        activeItem.value = id
        break
      }
    }
  }, 150)

  useEffect(() => {
    const containerNode = safelyGetWindow()?.document.getElementById('root')
    if (containerNode) {
      setContainerAnchorPoints(containerNode)
      handleScroll()
      safelyGetWindow()?.addEventListener('scroll', handleScroll)

      return () => {
        safelyGetWindow()?.removeEventListener('scroll', handleScroll)
        containerAnchorPoints.value = { containerNodeScrollTop: 0, containerNodeScrollBottom: 0 }
      }
    }
  })

  return (
    <div className='relative hidden pr-4 md:block'>
      <aside className='sticky top-24 right-0'>
        <ul>
          {toc.map(({ id, text }) => (
            <TOCHeader key={id} id={id}>
              {text}
            </TOCHeader>
          ))}
        </ul>
      </aside>
    </div>
  )
}
