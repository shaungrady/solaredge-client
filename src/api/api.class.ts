import { add, isBefore, lightFormat, min } from 'date-fns'
import queryString from 'query-string'
import Err from '../shared/errors.enum'
import { Subset } from '../shared/types'
import {
  ApiConfig,
  DateOrTimeRange,
  DateOrTimeRangeParams,
  GetApiCallGeneratorConfig,
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
      ;[start, end] = config.dateRange.sort()
      type = RangeType.Date
    } else {
      ;[start, end] = config.timeRange.sort()
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

  constructor(public readonly key: string, config: Partial<ApiConfig> = {}) {
    if (!Api.isValidApiKey(key)) {
      throw Error(Err.invalidApiKey)
    }

    this.config = Object.freeze({
      origin: Api.defaultOrigin,
      ...config,
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async call<T>(path: string, reqParams: Record<string, any> = {}): Promise<T> {
    const { key, config } = this

    const headers: Record<string, string> = { Accept: 'application/json' }
    const params: string = queryString.stringify({
      ...reqParams,
      api_key: key,
    })

    const url = `${config.origin}${path}?${params}`
    const res = await fetch(url, { headers })
    const body = await res.json()

    // Solaredge nests response data under a key that changes depending on the
    // request endpoint; this removes that nesting for ease of use.
    const bodyValues = Object.values(body)
    return bodyValues.length === 1 ? bodyValues[0] : body
  }

  // For fetching data collections. Handles pagination and date range limitations.
  getCallGenerator<T>(
    config: GetApiCallGeneratorConfig
  ): AsyncGenerator<T, void, void> {
    const { apiPath, interval, parser, transformer } = config
    const call = this.call.bind(this)

    const timeUnit = 'timeUnit' in config && config.timeUnit
    const range: Readonly<Range> = Api.parseDateOrTimeRange(config)

    return (async function* apiCallGenerator(): AsyncGenerator<T, void, void> {
      let periodStart = range.start

      while (isBefore(periodStart, range.end)) {
        const periodEnd = min([range.end, add(periodStart, interval)])
        const timeUnitParam = timeUnit ? { timeUnit } : {}
        const rangeParams = Api.serializeRange({
          type: range.type,
          start: periodStart,
          end: periodEnd,
        })

        let collection = parser(
          // eslint-disable-next-line no-await-in-loop
          await call(apiPath, { ...rangeParams, ...timeUnitParam })
        )

        if (transformer) {
          collection = collection.map(transformer)
        }

        for (const data of collection) {
          yield data as T
        }

        periodStart = periodEnd
      }
    })()
  }
}
