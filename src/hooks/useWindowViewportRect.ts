import React from 'react'
import { useSizeWithElRef } from './useSize'
import { WindowViewportInfo } from '../interfaces'

export default function useWindowViewportRectRef(
  callback: (info: WindowViewportInfo) => void,
  customScrollParent?: HTMLElement,
  externalWindow?: Window | null
) {
  const viewportInfo = React.useRef<WindowViewportInfo | null>(null)

  const calculateInfo = React.useCallback(
    (element: HTMLElement | null) => {
      if (element === null || !element.offsetParent) {
        return
      }
      const w = externalWindow ?? window
      const rect = element.getBoundingClientRect()
      const visibleWidth = rect.width
      let visibleHeight: number, offsetTop: number

      if (customScrollParent) {
        const customScrollParentRect = customScrollParent.getBoundingClientRect()
        const deltaTop = rect.top - customScrollParentRect.top

        visibleHeight = customScrollParentRect.height - Math.max(0, deltaTop)
        offsetTop = deltaTop + customScrollParent.scrollTop
      } else {
        visibleHeight = w.innerHeight - Math.max(0, rect.top)
        offsetTop = rect.top + w.pageYOffset
      }

      viewportInfo.current = {
        offsetTop,
        visibleHeight,
        visibleWidth,
      }

      callback(viewportInfo.current)
    },
    [callback, customScrollParent]
  )

  const { callbackRef, ref } = useSizeWithElRef(calculateInfo, true, externalWindow)

  const scrollAndResizeEventHandler = React.useCallback(() => {
    calculateInfo(ref.current)
  }, [calculateInfo, ref])

  React.useEffect(() => {
    if (customScrollParent) {
      customScrollParent.addEventListener('scroll', scrollAndResizeEventHandler)
      const observer = externalWindow
        ? new externalWindow.ResizeObserver(scrollAndResizeEventHandler)
        : new ResizeObserver(scrollAndResizeEventHandler)
      observer.observe(customScrollParent)
      return () => {
        customScrollParent.removeEventListener('scroll', scrollAndResizeEventHandler)
        observer.unobserve(customScrollParent)
      }
    } else {
      const w = externalWindow ?? window
      w.addEventListener('scroll', scrollAndResizeEventHandler)
      w.addEventListener('resize', scrollAndResizeEventHandler)
      return () => {
        w.removeEventListener('scroll', scrollAndResizeEventHandler)
        w.removeEventListener('resize', scrollAndResizeEventHandler)
      }
    }
  }, [scrollAndResizeEventHandler, customScrollParent])

  return callbackRef
}
