export const myRequestAnimationFrame = (callback: () => void) => {
  //   requestAnimationFrame(() => {
  //     callback()
  //   })

  setTimeout(() => {
    callback()
  }, 1000 / 24)
}
