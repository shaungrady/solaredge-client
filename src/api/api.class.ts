import fetch from 'isomorphic-unfetch'
import queryString from 'query-string'
import { recursivelyDeserializeDates } from '../helpers/date.js'

export default class SolaredgeApi {
  static readonly apiOrigin = 'https://monitoringapi.solaredge.com'

  static isValidApiKey(key: string): boolean {
    return /^[A-Z0-9]{32}$/.test(key)
  }

  constructor(public readonly apiKey: string) {
    if (!SolaredgeApi.isValidApiKey(apiKey)) {
      throw Error(
        'Bad API key (must be a 32-character uppercase alphanumeric string)'
      )
    }
  }

  protected async callApi<T>(
    path: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reqParams: Record<string, any> = {}
  ): Promise<T> {
    const { apiOrigin } = SolaredgeApi
    const { apiKey } = this

    // eslint-disable-next-line @typescript-eslint/camelcase
    const params: string = queryString.stringify({
      ...reqParams,
      api_key: apiKey,
    })
    const url = `${apiOrigin}${path}?${params}`
    const headers: Record<string, string> = { Accept: 'application/json' }

    console.debug('Calling API:', url)

    const res = await fetch(url, { headers })
    const body = await res.json()

    // Solaredge nests response data under a key that changes depending on the
    // request endpoint; this removes that nesting for ease of use.
    const bodyValues = Object.values(body)
    const data: T = bodyValues.length === 1 ? bodyValues[0] : body

    return recursivelyDeserializeDates(data)
  }
}
