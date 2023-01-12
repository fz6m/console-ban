import { defaultOptions } from './default'
import {
  completion,
  isUserAgentContains,
  isString,
  locationChange
} from './utils'
import { BrowserType } from './constants'

import { getChromeTest } from './browser/chrome'
import { getFirefoxTest } from './browser/firefox'
import { getSafariTest } from './browser/safari'

export interface IConsoleBanOptions {
  /** enable loop infinite debugger */
  debug?: boolean
  /** loop debugger interval */
  debugTime?: number
  /** console opend callback */
  callback?: () => any
  /** redirect url */
  redirect?: string
  /** disable console.clear */
  clear?: boolean
  /** rewrite document content */
  write?: string | Element
}

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

  redirect(env?: BrowserType) {
    const target = this._redirect
    if (!target) {
      return
    }
    // absolute path
    if (target.indexOf('http') === 0) {
      location.href !== target && locationChange(target, env)
      return
    }
    // relative path
    const path = location.pathname + location.search
    if (completion(target) === path) {
      return
    }
    locationChange(target, env)
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

    // other like safari
    getSafariTest(fireCallback)
  }

  write() {
    const content = this._write
    if (content) {
      document.body.innerHTML = isString(content) ? content : content.innerHTML
    }
  }

  fire(env?: BrowserType) {
    // first callback
    if (this._callback) {
      this._callback.call(null)
      return
    }
    // check redirect
    this.redirect(env)
    if (this._redirect) {
      return
    }
    // finally write html
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
