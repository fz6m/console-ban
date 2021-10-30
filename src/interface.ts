import { BrowserType } from './constants'

export interface IFireRunner {
  (env?: BrowserType): void
}
