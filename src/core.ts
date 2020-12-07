import { defaultOptions } from './default'

import { completion } from './utils'

export interface options {
  debug?: boolean // 是否开启无限 debugger
  debugTime?: number // 无限 debugger 间隔
  callback?: Function // 打开 console 后的回调
  redirect?: string // 重定向地址
  clear?: boolean // 是否可以 console.clear
  write?: string | Element // 重写 document 内容
}

export class ConsoleBan {
  _debug: boolean
  _debugTime: number
  _clear: boolean

  _callback?: Function
  _redirect?: string
  _write?: string | Element

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
    const img = new Image()
    Object.defineProperty(img, 'id', {
      get: () => {
        // callback
        if (this._callback) {
          this._callback.call(null)
          return
        }

        // redirect
        this.redirect()
        if (this._redirect) {
          return
        }

        // write
        this.write()
      }
    })
    console.log(img)
  }

  write() {
    if (this._write) {
      document.body.innerHTML =
        typeof this._write === 'string' ? this._write : this._write.innerHTML
    }
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
