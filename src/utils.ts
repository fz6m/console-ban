import { BrowserType, EBrowser } from './constants'

/**
 * url completion
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
 * detect browser
 */
export const isUserAgentContains = (text: string) => {
  return ~navigator.userAgent.toLowerCase().indexOf(text)
}

export const isString = (v: any): v is string => typeof v === 'string'

export const locationChange = (target: string, env?: BrowserType) => {
  // Safari 15 has bfcache. prevent click history back button
  if (env === EBrowser.Safari) {
    location.replace(target)
    return
  }
  location.href = target
}
