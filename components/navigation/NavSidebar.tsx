import React, { useEffect, useRef } from 'react'

import { debounce } from 'lodash'

import { signal } from '@preact/signals'
import { safelyGetWindow } from '@utils/safely-get-window'

type ContainerAnchorPoints = {
  containerNodeScrollTop: number
  containerNodeScrollBottom: number
}

type Props = {
  toc: { id: string; text: string }[]
}

const activeItem = signal('')

const TOCHeader: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
  const anchorTarget = useRef<Element>()

  const onClick = () => {
    anchorTarget.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  useEffect(() => {
    if (!anchorTarget.current) {
      const element = document.getElementById(id) as HTMLElement
      anchorTarget.current = element
    }
  })

  return (
    <div
      className={`mb-2 text-sm text-right text-stone-800 dark:text-stone-300 hover:tocHeader transition-opacity transition-font duration-150 ease-linear cursor-pointer ${
        activeItem.value === id ? 'opacity-100 font-semibold' : 'opacity-[.60]'
      }`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export const NavSidebar: React.FC<Props> = ({ toc }) => {
  const containerAnchorPoints = signal<ContainerAnchorPoints | undefined>(undefined)

  const setContainerAnchorPoints = (containerNode: Element) => {
    const containerNodeRect = containerNode.getBoundingClientRect()
    const containerNodeScrollTop = containerNode.scrollTop
    const containerNodeScrollBottom = containerNodeRect.height

    containerAnchorPoints.value = { containerNodeScrollTop, containerNodeScrollBottom }
  }

  const getElementAnchorPoints = () => {
    return toc.map(({ id }) => {
      const anchorNode = document.getElementById(id) as HTMLElement
      const anchorNodeRect = anchorNode?.getBoundingClientRect()

      const anchorNodeScrollTop = anchorNodeRect.top
      const anchorNodeScrollBottom = anchorNodeScrollTop + anchorNodeRect.height

      return { id, anchorNodeScrollTop, anchorNodeScrollBottom }
    })
  }

  const handleScroll = debounce(() => {
    const anchorPoints = getElementAnchorPoints()
    const { containerNodeScrollTop, containerNodeScrollBottom } = containerAnchorPoints.value as ContainerAnchorPoints

    for (const element of anchorPoints) {
      const { id, anchorNodeScrollTop, anchorNodeScrollBottom } = element

      const isElementInTopHalfOfViewport = [
        anchorNodeScrollTop < containerNodeScrollBottom,
        anchorNodeScrollBottom > containerNodeScrollTop,
      ].every(v => v)

      if (isElementInTopHalfOfViewport || id === anchorPoints[anchorPoints.length]?.id) {
        activeItem.value = id
        break
      }
    }
  }, 125)

  useEffect(() => {
    const containerNode = document.getElementById('root')
    containerNode && setContainerAnchorPoints(containerNode)
    handleScroll()
    safelyGetWindow()?.addEventListener('scroll', handleScroll)

    return () => {
      safelyGetWindow()?.removeEventListener('scroll', handleScroll)
      containerAnchorPoints.value = undefined
    }
  })

  return (
    <div className='hidden md:block relative'>
      <aside className='sticky top-24 right-0'>
        {toc.map(({ id, text }) => (
          <TOCHeader key={id} id={id}>
            {text}
          </TOCHeader>
        ))}
      </aside>
    </div>
  )
}
