export interface ApiConfig {
    /**
     * URL origin of the API without a trailing slash.
     * @default https://monitoringapi.solaredge.com
     */
    origin: string;
}
export interface DateRange {
    dateRange: [Date, Date];
}
export interface DateRangeParams {
    startDate: Date;
    endDate: Date;
}
export interface DateTimeRange {
    timeRange: [Date, Date];
}
export interface DateTimeRangeParams {
    startTime: Date;
    endTime: Date;
}
export declare type DateOrTimeRange = DateRange | DateTimeRange;
export declare type DateOrTimeRangeParams = DateRangeParams | DateTimeRangeParams;
export interface TimeUnitParam {
    timeUnit: TimeUnit;
}
export declare type Serialized<T> = T extends Date ? string : T extends object ? {
    [k in keyof T]: Serialized<T[k]>;
} : T;
export declare const enum TimeUnit {
    QuarterHour = "QUARTER_OF_AN_HOUR",
    Hour = "HOUR",
    Day = "DAY",
    Week = "WEEK",
    Month = "MONTH",
    Year = "YEAR"
}
export declare const enum SortOrder {
    Ascending = "ASC",
    Descending = "DESC"
}
export declare const enum SiteStatus {
    Active = "Active",
    Pending = "Pending",
    Disabled = "Disabled",
    All = "All"
}
export declare const enum Meter {
    Production = "Production",
    Consumption = "Consumption",
    SelfConsumption = "SelfConsumption",
    FeedIn = "FeedIn",
    Purchased = "Purchased"
}
export interface ApiCallOptions {
    params: Record<string, any>;
}
export declare type ApiCallGeneratorConfig<T> = {
    apiPath: string;
    interval: Duration;
    timeUnit?: TimeUnit;
    /** Parses the API response into a collection to be iterated over. */
    parser: (res: any) => T[];
} & DateOrTimeRange;
/**
 * Generator that yields individual collection items, lazily calling the API to
 * fetch more. Returns number of API calls performed.
 */
export declare type ApiCallGenerator<T> = AsyncGenerator<T, ApiCallGeneratorReturn, void>;
export interface ApiCallGeneratorReturn {
    config: ApiCallGeneratorConfig<unknown>;
    apiCallTotal: number;
    recordTotal: number;
}
export interface Range {
    type: RangeType;
    start: Date;
    end: Date;
}
export declare enum RangeType {
    Date = 0,
    DateTime = 1
}
