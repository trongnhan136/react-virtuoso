export const myRequestAnimationFrame = (callback: () => void) => {
  //   requestAnimationFrame(() => {
  //     callback()
  //   })

  setTimeout(() => {
    callback()
  }, 1000 / 60)
}

// export const myRequestAnimationFrame = requestAnimationFrame
