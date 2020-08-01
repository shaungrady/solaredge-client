export interface DateRangeParam {
  dateRange: [Date, Date]
}

export interface DateTimeRangeParam {
  timeRange: [Date, Date]
}

export interface TimeUnitParam {
  timeUnit: TimeUnit
}

export interface TransformerParam<T, O> {
  transformer: Transformer
}

export type Transformer = <T, O>(input: T) => O

export type Serialize<T> = T extends Date
  ? string
  : T extends object
  ? {
      [k in keyof T]: Serialize<T[k]>
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

export type getApiDataGeneratorConfig = {
  apiPath: string
  interval: Duration
  timeUnit?: TimeUnit
  parser: (res: any) => unknown[]
  transformer?: Transformer
} & (DateRangeParam | DateTimeRangeParam)
