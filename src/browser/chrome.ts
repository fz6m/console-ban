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

/**
 * @refer https://stackoverflow.com/a/71794156
 *
 * Other alternatives
 * https://github.com/david-fong/detect-devtools-via-debugger-heartstop
 */
const errorDetector = (trigger: () => void) => {
  const e = new Error()
  Object.defineProperty(e, 'message', {
    get() {
      trigger()
    }
  })
  console.log(e)
}

export const getChromeTest = (fire: IFireRunner) => {
  const re = /./
  re.toString = getChromeRerenderTestFunc(fire) as any

  const func = () => re
  func.toString = getChromeRerenderTestFunc(fire)

  const date = new Date()
  date.toString = getChromeRerenderTestFunc(fire) as any

  console.log(
    '%c',
    // < 92
    func,
    // 92
    func(),
    // >= 93, <= 101
    date
  )

  // >= 102
  const errorFire = getChromeRerenderTestFunc(fire)
  errorDetector(errorFire)
}
