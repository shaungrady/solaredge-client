import { ApiCallGenerator, ApiConfig, ApiCallGeneratorConfig, ApiCallOptions } from './api.types';
export default class Api {
    readonly key: string;
    static readonly defaultOrigin = "https://monitoringapi.solaredge.com";
    static readonly dateFormat = "yyyy-MM-dd";
    static readonly dateTimeFormat = "yyyy-MM-dd HH:mm:ss";
    static isValidApiKey(key: string): boolean;
    static serializeDate(date: Date): string;
    static serializeDateTime(date: Date): string;
    private static parseDateOrTimeRange;
    private static serializeRange;
    readonly config: Readonly<ApiConfig>;
    constructor(key: string, config?: Partial<ApiConfig>);
    call<T>(path: string, options?: Partial<ApiCallOptions>): Promise<T>;
    callGenerator<T>(config: ApiCallGeneratorConfig<T>): ApiCallGenerator<T>;
}
