export const getChromeRerenderTestFunc = (fire: () => void) => {
  let mark = 0
  return () => {
    mark++
    if (mark === 2) {
      fire()
      mark = 1
    }
  }
}

export const getChromeTest = (fire: () => void) => {
  const re = /./
  re.toString = getChromeRerenderTestFunc(fire) as any
  const func = () => re
  func.toString = getChromeRerenderTestFunc(fire)
  console.log('%c', /* < 92 */ func, /* 92 */ func())
}
