import { defaultOptions } from './default'

import { completion } from './utils'

export interface options {
  debug?: boolean // 是否开启无限 debugger
  debugTime?: number // 无限 debugger 间隔
  callback?: Function // 打开 console 后的回调
  redirect?: string // 重定向地址
  clear?: boolean // 是否禁用 console.clear
  write?: string | Element // 是否重写 document 内容
}

export class ConsoleBan {
  _debug: boolean
  _debugTime: number
  _clear: boolean

  _callback?: Function
  _redirect?: string
  _write?: string | Element

  _evalCounts: number
  _isOpenedEver: boolean

  constructor(option: options) {
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

    this._evalCounts = 0
    this._isOpenedEver = false
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
    if (!this._redirect) {
      return
    }
    // 绝对地址
    if (!!~this._redirect.indexOf('http')) {
      location.href !== this._redirect ? (location.href = this._redirect) : null
      return
    }
    // 相对地址
    const path = location.pathname + location.search
    if (completion(this._redirect) === path) {
      return
    }
    location.href = this._redirect
  }

  callback() {
    if (!this._callback && !this._redirect && !this._write) {
      return
    }

    if (!window) {
      return
    }

    const RETURN_MESSAGE = '[WARNING] fire in the hole'

    // @ts-ignore
    if (window.chrome) {
      const isOpen = (): boolean => {
        return this._evalCounts === (this._isOpenedEver ? 1 : 2)
      }
      const watchElement = new Function()
      watchElement.toString = (): string => {
        this._evalCounts++
        if (isOpen()) {
          this._isOpenedEver = true
          this._evalCounts = 0
          this.fire()
        }
        return RETURN_MESSAGE
      }
      console.log && console.log('%c', watchElement)
    }

    if (~navigator.userAgent.toLowerCase().indexOf('firefox')) {
      const re = /./
      re.toString = (): string => {
        this.fire()
        return RETURN_MESSAGE
      }
      console.log && console.log(re)
    }
  }

  write() {
    if (this._write) {
      document.body.innerHTML =
        typeof this._write === 'string' ? this._write : this._write.innerHTML
    }
  }

  fire() {
    if (this._callback) {
      this._callback.call(null)
      return
    }
    this.redirect()
    if (this._redirect) {
      return
    }
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
