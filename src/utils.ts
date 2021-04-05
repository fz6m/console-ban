/**
 * 处理 URL 补全
 * @example '' -> /
 * @example path -> /path
 * @example /path -> /path
 * @param url
 */
export function completion(url: string): string {
  if (!url) return '/'
  return url[0] !== '/' ? `/${url}` : url
}

/**
 * 判断浏览器
 */
export function isUserAgentContains(text: string) {
  return ~navigator.userAgent.toLowerCase().indexOf(text)
}
