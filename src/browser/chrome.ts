import { IFireRunner } from '@/interface'

let counts = 0

export const getChromeRerenderTestFunc = (fire: IFireRunner) => {
  let mark = 0
  const currentCount = ++counts
  return () => {
    if (counts && counts !== currentCount) {
      return
    }
    mark++
    if (mark === 2) {
      // first trigger
      counts = currentCount
      fire()
      mark = 1
    }
  }
}

export const getChromeTest = (fire: IFireRunner) => {
  const re = /./
  re.toString = getChromeRerenderTestFunc(fire) as any

  const func = () => re
  func.toString = getChromeRerenderTestFunc(fire)

  const date = new Date()
  date.toString = getChromeRerenderTestFunc(fire) as any

  console.log('%c', /* < 92 */ func, /* 92 */ func(), /* 93 */ date)
}
