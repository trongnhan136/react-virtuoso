import { myRequestAnimationFrame } from '../hooks/animate_frame'

export function skipFrames(frameCount: number, callback: () => void) {
  if (frameCount == 0) {
    callback()
  } else {
    myRequestAnimationFrame(() => skipFrames(frameCount - 1, callback))
  }
}
