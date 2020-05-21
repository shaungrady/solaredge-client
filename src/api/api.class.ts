import { add, isBefore, min } from 'date-fns'
import fetch from 'isomorphic-unfetch'
import queryString from 'query-string'
import { serializeDateOrTimeRange } from '../helpers/date'
import { getApiDataGeneratorConfig } from './api.types'

export default class Api {
  static isValidApiKey(key: string): boolean {
    return /^[A-Z0-9]{32}$/.test(key)
  }

  constructor(
    public readonly key: string,
    public readonly origin = 'https://monitoringapi.solaredge.com'
  ) {
    if (!Api.isValidApiKey(key)) {
      throw Error(
        'Bad API key (must be a 32-character uppercase alphanumeric string)'
      )
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async call<T>(path: string, reqParams: Record<string, any> = {}): Promise<T> {
    const { key, origin } = this

    const headers: Record<string, string> = { Accept: 'application/json' }
    const params: string = queryString.stringify({
      ...reqParams,
      api_key: key,
    })
    const url = `${origin}${path}?${params}`

    console.debug('Calling API:', url)

    const res = await fetch(url, { headers })
    const body = await res.json()

    // Solaredge nests response data under a key that changes depending on the
    // request endpoint; this removes that nesting for ease of use.
    const bodyValues = Object.values(body)
    return bodyValues.length === 1 ? bodyValues[0] : body
  }

  // For fetching data collections. Handles pagination and date range limitations.
  getGenerator<T>(
    config: getApiDataGeneratorConfig
  ): AsyncGenerator<T, void, void> {
    const call = this.call.bind(this)
    const { apiPath, interval, parser } = config

    const timeUnit = 'timeUnit' in config && config.timeUnit
    let isDateRange: boolean
    let rangeStart: Date
    let rangeEnd: Date

    if ('dateRange' in config) {
      isDateRange = true
      ;[rangeStart, rangeEnd] = config.dateRange.sort()
    } else {
      isDateRange = false
      ;[rangeStart, rangeEnd] = config.timeRange.sort()
    }
    return (async function* apiDataGenerator(): AsyncGenerator<T, void, void> {
      let periodStart = rangeStart
      while (isBefore(periodStart, rangeEnd)) {
        const periodEnd = min([rangeEnd, add(periodStart, interval)])

        // TODO: This is kind of ugly…
        const rangeParams = isDateRange
          ? {
              startDate: periodStart,
              endDate: periodEnd,
            }
          : {
              startTime: periodStart,
              endTime: periodEnd,
            }

        const params: Record<string, string> = serializeDateOrTimeRange(
          rangeParams
        )
        if (timeUnit) {
          params.timeUnit = timeUnit
        }

        // eslint-disable-next-line no-await-in-loop
        const collection = parser(await call(apiPath, params))
        for (const data of collection) {
          yield data as T
        }

        periodStart = periodEnd
      }
    })()
  }
}
