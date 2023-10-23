import React from 'react'
import { useSizeWithElRef } from './useSize'
import { WindowViewportInfo } from '../interfaces'

export default function useWindowViewportRectRef(callback: (info: WindowViewportInfo) => void, customScrollParent?: HTMLElement,externalWindow?:Window| null) {
  const viewportInfo = React.useRef<WindowViewportInfo | null>(null)

  const calculateInfo = React.useCallback(
    (element: HTMLElement | null) => {
      if (element === null || !element.offsetParent) {
        return
      }
      const myWindow = externalWindow ?? window;
      const rect = element.getBoundingClientRect()
      const visibleWidth = rect.width
      let visibleHeight: number, offsetTop: number

      if (customScrollParent) {
        const customScrollParentRect = customScrollParent.getBoundingClientRect()
        const deltaTop = rect.top - customScrollParentRect.top

        visibleHeight = customScrollParentRect.height - Math.max(0, deltaTop)
        offsetTop = deltaTop + customScrollParent.scrollTop
      } else {
        visibleHeight = myWindow.innerHeight - Math.max(0, rect.top)
        offsetTop = rect.top + myWindow.pageYOffset
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
      const observer = externalWindow? new externalWindow.ResizeObserver(scrollAndResizeEventHandler) :  new ResizeObserver(scrollAndResizeEventHandler)
      observer.observe(customScrollParent)
      return () => {
        customScrollParent.removeEventListener('scroll', scrollAndResizeEventHandler)
        observer.unobserve(customScrollParent)
      }
    } else {
      let myWindow = externalWindow ?? window;
      myWindow.addEventListener('scroll', scrollAndResizeEventHandler)
      myWindow.addEventListener('resize', scrollAndResizeEventHandler)
      return () => {
        myWindow.removeEventListener('scroll', scrollAndResizeEventHandler)
        myWindow.removeEventListener('resize', scrollAndResizeEventHandler)
      }
    }
  }, [scrollAndResizeEventHandler, customScrollParent])

  return callbackRef
}
