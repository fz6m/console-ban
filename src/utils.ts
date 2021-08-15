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
