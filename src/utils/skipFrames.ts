/* eslint-disable @typescript-eslint/no-unsafe-call */
export function skipFrames(w: Window, frameCount: number, callback: () => void) {
  if (frameCount == 0) {
    callback()
  } else {
    w.requestAnimationFrame(() => skipFrames(w, frameCount - 1, callback))
  }
}
