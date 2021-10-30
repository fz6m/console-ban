import { IFireRunner } from '@/interface'

export const getFirefoxTest = (fire: IFireRunner) => {
  const re = /./
  re.toString = fire as any
  console.log(re)
}
