import { BrowserType, EBrowser } from './constants'

/**
 * 处理 URL 补全
 * @example '' -> /
 * @example path -> /path
 * @example /path -> /path
 * @param url
 */
export const completion = (url: string) => {
  if (!url) {
    return '/'
  }
  return url[0] !== '/' ? `/${url}` : url
}

/**
 * 判断浏览器
 */
export const isUserAgentContains = (text: string) => {
  return ~navigator.userAgent.toLowerCase().indexOf(text)
}

/**
 * 判断字符串
 */
export const isString = (v: any): v is string => typeof v === 'string'

/**
 * 跳转策略：改变 location
 */
export const locationChange = (target: string, env?: BrowserType) => {
  // Safari 15 has bfcache. prevent click history back button
  if (env === EBrowser.Safari) {
    location.replace(target)
    return
  }
  location.href = target
}
