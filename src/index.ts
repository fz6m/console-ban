import { ConsoleBan, options } from './core'

export function init(option: options) {
  const instance = new ConsoleBan(option)
  instance.ban()
}

export default init
