/**
 * not use enum. it will increase the output size
 */
export const EBrowser = {
  Chrome: 0,
  Firefox: 1,
  Safari: 2
}
type ValueOf<T> = T[keyof T]
export type BrowserType = ValueOf<typeof EBrowser>
