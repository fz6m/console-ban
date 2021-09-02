import { ConsoleBan, IConsoleBanOptions } from './core'

export type { options, IConsoleBanOptions } from './core'

export const init = (option: IConsoleBanOptions) => {
  const instance = new ConsoleBan(option)
  instance.ban()
}
