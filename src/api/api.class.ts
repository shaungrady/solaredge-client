import fetch from 'cross-fetch'
import { add, isBefore, lightFormat, min } from 'date-fns'
import queryString from 'query-string'

import compareDates from '../shared/compare-dates.fn'
import Err from '../shared/errors.enum'
import { Subset } from '../shared/types'
import {
	ApiCallGenerator,
	ApiCallGeneratorConfig,
	ApiCallGeneratorReturn,
	ApiCallOptions,
	ApiConfig,
	ApiResponse,
	DateOrTimeRange,
	DateOrTimeRangeParams,
	Range,
	RangeType,
	Serialized,
} from './api.types'

export default class Api {
	static readonly defaultOrigin = 'https://monitoringapi.solaredge.com'

	static readonly dateFormat = 'yyyy-MM-dd'

	static readonly dateTimeFormat = 'yyyy-MM-dd HH:mm:ss'

	static isValidApiKey(key: string): boolean {
		return /^[A-Z0-9]{32}$/.test(key)
	}

	static serializeDate(date: Date): string {
		return lightFormat(date, Api.dateFormat)
	}

	static serializeDateTime(date: Date): string {
		return lightFormat(date, Api.dateTimeFormat)
	}

	private static parseDateOrTimeRange<T extends keyof DateOrTimeRange>(
		config: Subset<T, DateOrTimeRange>
	): Range {
		let type: RangeType
		let start: Date
		let end: Date

		if ('dateRange' in config) {
			;[start, end] = config.dateRange.slice().sort(compareDates)
			type = RangeType.Date
		} else {
			;[start, end] = config.timeRange.slice().sort(compareDates)
			type = RangeType.DateTime
		}

		return { type, start, end }
	}

	private static serializeRange({
		type,
		start,
		end,
	}: Range): Serialized<DateOrTimeRangeParams> {
		return type === RangeType.Date
			? {
					startDate: Api.serializeDate(start),
					endDate: Api.serializeDate(end),
			  }
			: {
					startTime: Api.serializeDateTime(start),
					endTime: Api.serializeDateTime(end),
			  }
	}

	readonly config: Readonly<ApiConfig>

	constructor(
		public readonly key: string,
		{ origin }: Partial<ApiConfig> = {}
	) {
		if (!Api.isValidApiKey(key)) {
			throw Error(Err.invalidApiKey)
		}

		this.config = Object.freeze({
			origin: origin ?? Api.defaultOrigin,
		})
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async call<T = any>(
		path: string,
		options: Partial<ApiCallOptions> = {}
	): Promise<ApiResponse<T>> {
		const { key, config } = this
		const callConfig: ApiCallOptions = {
			params: {},
			...options,
		}

		const headers = { Accept: 'application/json' }
		const params: string = queryString.stringify({
			...callConfig.params,
			api_key: key,
		})

		const url = `${config.origin}${path}?${params}`
		const res = await fetch(url, { headers })
		const body = await res.json()

		if ('String' in body) {
			return { error: body.String, data: null }
		}

		// SolarEdge nests response data under a key that changes depending on the
		// request endpoint; this removes that nesting for ease of consumption.
		const bodyValues: T[] = Object.values(body)
		const data = bodyValues.length === 1 ? bodyValues[0] : body

		return { error: null, data }
	}

	async *callGenerator<T>(
		config: ApiCallGeneratorConfig<T>
	): ApiCallGenerator<T> {
		const { apiPath, interval, parser } = config
		const call = this.call.bind(this)
		const generatorReturnData: ApiCallGeneratorReturn = {
			error: null,
			config,
			apiCallTotal: 0,
			recordTotal: 0,
		}

		const timeUnit = 'timeUnit' in config && config.timeUnit
		const range: Readonly<Range> = Api.parseDateOrTimeRange(config)

		let periodStart = range.start

		while (isBefore(periodStart, range.end)) {
			const periodEnd = min([range.end, add(periodStart, interval)])
			const timeUnitParam = timeUnit ? { timeUnit } : {}
			const rangeParams = Api.serializeRange({
				type: range.type,
				start: periodStart,
				end: periodEnd,
			})

			// Since the monitoring API limits the number of API calls in a given time
			// period, we won't call the API until it's needed.
			// eslint-disable-next-line no-await-in-loop
			const { data, error } = await call(apiPath, {
				params: { ...rangeParams, ...timeUnitParam },
			})

			if (error) {
				generatorReturnData.error = error
				break
			}

			const collection = parser(data)

			for (const record of collection) {
				generatorReturnData.recordTotal += 1
				yield record
			}

			generatorReturnData.apiCallTotal += 1
			periodStart = periodEnd
		}

		return generatorReturnData
	}
}
