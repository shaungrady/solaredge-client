export interface ApiConfig {
	/**
	 * URL origin of the API without a trailing slash.
	 * @default https://monitoringapi.solaredge.com
	 */
	origin: string
}

export interface ApiResponse<T> {
	error: string | null
	data: T | null
}

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

export interface ApiCallOptions {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	params: Record<string, any>
}

export type ApiCallGeneratorConfig<T> = {
	apiPath: string
	interval: Duration
	timeUnit?: TimeUnit
	/** Parses the API response into a collection to be iterated over. */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	parser: (res: any) => T[]
} & DateOrTimeRange

/**
 * Generator that yields individual collection items, lazily calling the API to
 * fetch more. Returns number of API calls performed.
 */
export type ApiCallGenerator<T> = AsyncGenerator<
	T,
	ApiCallGeneratorReturn,
	void
>
export interface ApiCallGeneratorReturn {
	config: ApiCallGeneratorConfig<unknown>
	apiCallTotal: number
	recordTotal: number
	error: string | null
}

export interface Range {
	type: RangeType
	start: Date
	end: Date
}

export enum RangeType {
	Date,
	DateTime,
}
