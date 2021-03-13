export interface options {
    debug?: boolean;
    debugTime?: number;
    callback?: Function;
    redirect?: string;
    clear?: boolean;
    write?: string | Element;
}
export declare class ConsoleBan {
    _debug: boolean;
    _debugTime: number;
    _clear: boolean;
    _callback?: Function;
    _redirect?: string;
    _write?: string | Element;
    _evalCounts: number;
    _isOpenedEver: boolean;
    constructor(option: options);
    clear(): void;
    debug(): void;
    redirect(): void;
    callback(): void;
    write(): void;
    fire(): void;
    ban(): void;
}
