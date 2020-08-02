export interface DateRange {
  dateRange: [Date, Date]
}
export interface DateRangeParams {
  startDate: Date
  endDate: Date
}

export interface DateTimeRange {
  timeRange: [Date, Date]
}
export interface DateTimeRangeParams {
  startTime: Date
  endTime: Date
}

export type DateOrTimeRange = DateRange | DateTimeRange
export type DateOrTimeRangeParams = DateRangeParams | DateTimeRangeParams

export interface TimeUnitParam {
  timeUnit: TimeUnit
}

export interface TransformerParam<T, O> {
  transformer: Transformer
}

export type Transformer = <T, O>(input: T) => O

export type Serialized<T> = T extends Date
  ? string // eslint-disable-next-line @typescript-eslint/ban-types
  : T extends object
  ? {
      [k in keyof T]: Serialized<T[k]>
    }
  : T

export const enum TimeUnit {
  QuarterHour = 'QUARTER_OF_AN_HOUR',
  Hour = 'HOUR',
  Day = 'DAY',
  Week = 'WEEK',
  Month = 'MONTH',
  Year = 'YEAR',
}

export const enum SortOrder {
  Ascending = 'ASC',
  Descending = 'DESC',
}

export const enum SiteStatus {
  Active = 'Active',
  Pending = 'Pending',
  Disabled = 'Disabled',
  All = 'All',
}

export const enum Meter {
  // AC production power meter / inverter production AC power (fallback)
  Production = 'Production',
  // Consumption meter
  Consumption = 'Consumption',
  // Virtual self-consumption (calculated)
  SelfConsumption = 'SelfConsumption',
  // Export to GRID meter
  FeedIn = 'FeedIn',
  // Import power from GRID meter
  Purchased = 'Purchased',
}

export type GetApiCallGeneratorConfig = {
  apiPath: string
  interval: Duration
  timeUnit?: TimeUnit
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  /** Parses the API response into a collection. */
  parser: (res: any) => unknown[]
  transformer?: Transformer
} & DateOrTimeRange

export interface Range {
  type: RangeType
  start: Date
  end: Date
}

export enum RangeType {
  Date,
  DateTime,
}
