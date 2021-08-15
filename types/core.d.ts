export interface IConsoleBanOptions {
    /** 是否开启无限 debugger */
    debug?: boolean;
    /** 无限 debugger 间隔 */
    debugTime?: number;
    /** 打开 console 后的回调 */
    callback?: () => any;
    /** 重定向地址 */
    redirect?: string;
    /** 是否禁用 console.clear */
    clear?: boolean;
    /** 是否重写 document 内容 */
    write?: string | Element;
}
export declare type options = IConsoleBanOptions;
export declare class ConsoleBan {
    _debug: boolean;
    _debugTime: number;
    _clear: boolean;
    _callback?: () => any;
    _redirect?: string;
    _write?: string | Element;
    constructor(option: IConsoleBanOptions);
    clear(): void;
    debug(): void;
    redirect(): void;
    callback(): void;
    write(): void;
    fire(): void;
    ban(): void;
}
