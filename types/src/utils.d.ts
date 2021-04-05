/**
 * 处理 URL 补全
 * @example '' -> /
 * @example path -> /path
 * @example /path -> /path
 * @param url
 */
export declare function completion(url: string): string;
/**
 * 判断浏览器
 */
export declare function isUserAgentContains(text: string): number;
