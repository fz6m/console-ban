/**
 * 处理 URL 补全
 * @example '' -> /
 * @example path -> /path
 * @example /path -> /path
 * @param url
 */
export declare const completion: (url: string) => string;
/**
 * 判断浏览器
 */
export declare const isUserAgentContains: (text: string) => number;
/**
 * 判断字符串
 */
export declare const isString: (v: any) => v is string;
