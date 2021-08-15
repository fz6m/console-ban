import { ConsoleBan, IConsoleBanOptions } from './core'

export type { options, IConsoleBanOptions } from './core'

let isInitialled = false

export const init = (option: IConsoleBanOptions) => {
  if (isInitialled) {
    return
  }
  const instance = new ConsoleBan(option)
  instance.ban()
  isInitialled = true
}
