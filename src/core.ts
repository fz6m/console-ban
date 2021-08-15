import { defaultOptions } from './default'
import { completion, isUserAgentContains, isString } from './utils'

import { getChromeTest } from './browser/chrome'
import { getFirefoxTest } from './browser/firefox'
import { getSafariTest } from './browser/safari'

export interface IConsoleBanOptions {
  /** 是否开启无限 debugger */
  debug?: boolean
  /** 无限 debugger 间隔 */
  debugTime?: number
  /** 打开 console 后的回调 */
  callback?: () => any
  /** 重定向地址 */
  redirect?: string
  /** 是否禁用 console.clear */
  clear?: boolean
  /** 是否重写 document 内容 */
  write?: string | Element
}
// 向前兼容
export type options = IConsoleBanOptions

export class ConsoleBan {
  _debug: boolean
  _debugTime: number
  _clear: boolean

  _callback?: () => any
  _redirect?: string
  _write?: string | Element

  constructor(option: IConsoleBanOptions) {
    const { clear, debug, debugTime, callback, redirect, write } = {
      ...defaultOptions,
      ...option
    }

    this._debug = debug
    this._debugTime = debugTime
    this._clear = clear

    this._callback = callback
    this._redirect = redirect
    this._write = write
  }

  clear() {
    if (this._clear) {
      console.clear = () => {}
    }
  }

  debug() {
    if (this._debug) {
      const db = new Function('debugger')
      setInterval(db, this._debugTime)
    }
  }

  redirect() {
    const target = this._redirect
    if (!target) {
      return
    }
    // 绝对地址
    if (target.indexOf('http') === 0) {
      location.href !== target && (location.href = target)
      return
    }
    // 相对地址
    const path = location.pathname + location.search
    if (completion(target) === path) {
      return
    }
    location.href = target
  }

  callback() {
    if (!this._callback && !this._redirect && !this._write) {
      return
    }

    if (!window) {
      return
    }

    const fireCallback = this.fire.bind(this)

    const isChrome = window.chrome || isUserAgentContains('chrome')
    const isFirefox = isUserAgentContains('firefox')

    if (isChrome) {
      getChromeTest(fireCallback)
      return
    }

    if (isFirefox) {
      getFirefoxTest(fireCallback)
      return
    }

    // 其他一律当做 safari 逻辑处理
    getSafariTest(fireCallback)
  }

  write() {
    const content = this._write
    if (content) {
      document.body.innerHTML = isString(content) ? content : content.innerHTML
    }
  }

  fire() {
    // 优先执行回调
    if (this._callback) {
      this._callback.call(null)
      return
    }
    // 其次检查跳转
    this.redirect()
    if (this._redirect) {
      return
    }
    // 最后是重写逻辑
    this.write()
  }

  ban() {
    // callback
    this.callback()

    // clear console.clear
    this.clear()

    // debug init
    this.debug()
  }
}
