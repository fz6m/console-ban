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
