import React from 'react'
declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    ResizeObserver: typeof ResizeObserver
    requestAnimationFrame: any
  }
}

export type CallbackRefParam = HTMLElement | null

export function useSizeWithElRef(callback: (e: HTMLElement) => void, enabled = true, externalWindow?: Window | null) {
  const ref = React.useRef<CallbackRefParam>(null)

  let callbackRef = (_el: CallbackRefParam) => {
    void 0
  }

  if (typeof ResizeObserver !== 'undefined') {
    const observer = React.useMemo(() => {
      if (externalWindow) {
        return new externalWindow.ResizeObserver((entries: ResizeObserverEntry[]) => {
          const element = entries[0].target as HTMLElement
          if (element.offsetParent !== null) {
            callback(element)
          }
        })
      }
      return new ResizeObserver((entries: ResizeObserverEntry[]) => {
        const element = entries[0].target as HTMLElement
        if (element.offsetParent !== null) {
          callback(element)
        }
      })
    }, [callback])

    callbackRef = (elRef: CallbackRefParam) => {
      if (elRef && enabled) {
        observer.observe(elRef)
        ref.current = elRef
      } else {
        if (ref.current) {
          observer.unobserve(ref.current)
        }
        ref.current = null
      }
    }
  }

  return { ref, callbackRef }
}

export default function useSize(callback: (e: HTMLElement) => void, enabled = true, externalWindow?: Window | null) {
  return useSizeWithElRef(callback, enabled, externalWindow).callbackRef
}
