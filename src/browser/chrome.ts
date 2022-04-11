import { IFireRunner } from '@/interface'

let counts = 0
let triggered = 0

export const getChromeRerenderTestFunc = (fire: IFireRunner) => {
  let mark = 0
  const seq = 1 << counts++
  return () => {
    if (triggered && !(triggered & seq)) {
      return
    }
    mark++
    if (mark === 2) {
      triggered |= seq
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

  console.log('%c', /* < 92 */ func, /* 92 */ func(), /* >= 93 */ date)
}
