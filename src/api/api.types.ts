export interface DateRangeParams {
  startDate: Date
  endDate: Date
}

export interface DateTimeRangeParams {
  startTime: Date
  endTime: Date
}

export interface TimeUnitParam {
  timeUnit: TimeUnit
}

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
