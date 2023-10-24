/* eslint-disable no-var */
// export const myRequestAnimationFrame = (callback: () => void) => {
//   //   requestAnimationFrame(() => {
//   //     callback()
//   //   })

//   setTimeout(() => {
//     callback()
//   }, 1000 / 60)
// }

// export const myRequestAnimationFrame = requestAnimationFrame

var lastTime = 0
export const myRequestAnimationFrame = function (callback: (t?: number) => void) {
  var currTime = new Date().getTime()
  var timeToCall = Math.max(0, 16 - (currTime - lastTime))
  var id = setTimeout(function () {
    callback(currTime + timeToCall)
  }, timeToCall)
  lastTime = currTime + timeToCall
  return id
}

export const myCancelAnimationFrame = function (id: any) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  clearTimeout(id)
}
