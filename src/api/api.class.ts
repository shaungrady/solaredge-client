import Axios from 'axios'

import { recursivelyDeserializeDates } from '../helpers/date'

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

  // TODO: Drop Axios
  protected callApi<T>(
    path: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reqParams: Record<string, any> = {}
  ): Promise<T> {
    const { apiOrigin } = SolaredgeApi
    const { apiKey } = this
    // eslint-disable-next-line @typescript-eslint/camelcase
    const params = { ...reqParams, api_key: apiKey }

    return (
      Axios.get<Record<string, T>>(apiOrigin + path, {
        params,
      })
        // Unwrap data nested under top-level key
        .then(({ data }) => data[Object.keys(data)[0]])
        // Convert date strings to Dates
        .then(recursivelyDeserializeDates)
        .catch((err) => {
          throw Error(err)
        })
    )
  }
}
