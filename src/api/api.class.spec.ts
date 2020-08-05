import { parseISO } from 'date-fns'
import fetchMock from 'jest-fetch-mock'
import * as queryString from 'querystring'
import Err from '../shared/errors.enum'
import mockResponseBody from '../shared/response-body.mock'
import Api from './api.class'
import { ApiCallGeneratorConfig, TimeUnit } from './api.types'

describe(`Api`, () => {
  const apiKey = '123456789ABCDEFGHIJKLMNOPQRSTUVW'
  const dateA = new Date(111111111111)
  const dateB = new Date(999999999999)
  const startDate = parseISO('1999-01-01')
  const endDate = parseISO('2000-01-01')

  describe(`static`, () => {
    describe(`#isValidApiKey`, () => {
      // prettier-ignore
      const testCases: [string, boolean][] = [
        [apiKey, true],
        [apiKey.toLowerCase(), false],
        [apiKey.replace('W', '!'), false],
        [apiKey.replace('W', '☠️'), false],
        [apiKey.substr(0, 31), false],
        [`${apiKey}Z`, false]
      ]

      testCases.forEach(([input, expectation]) => {
        it(`${input} is ${expectation ? 'valid' : 'invalid'}`, () => {
          expect(Api.isValidApiKey(input)).toBe(expectation)
        })
      })
    })

    describe(`#serializeDate`, () => {
      it(`serializes a Date to a date string`, () => {
        expect(Api.serializeDate(dateA)).toBe('1973-07-10')
      })
    })

    describe(`#serializeDateTime`, () => {
      it(`serializes a Date to a datetime string`, () => {
        expect(Api.serializeDateTime(dateB)).toBe('2001-09-09 01:46:39')
      })
    })
  })

  describe(`construction`, () => {
    it(`doesn't construct without an API key`, () => {
      // @ts-ignore
      expect(() => new Api()).toThrowError()
    })

    it(`doesn't construct with an invalid API key`, () => {
      expect(() => new Api(`${apiKey}!`)).toThrowError(Err.invalidApiKey)
    })

    it(`constructs with a valid API key`, () => {
      expect(new Api(apiKey)).toBeInstanceOf(Api)
    })
  })

  describe(`instance`, () => {
    type CallDebug = { url: string; params: Record<string, string> }
    const mockOrigin = 'http://localhost'
    let api: Api

    beforeEach(() => {
      // Origin set to localhost for safety, so unmocked requests don't leak out.
      api = new Api(apiKey, { origin: mockOrigin })
      fetchMock.resetMocks()
      fetchMock.mockResponse(({ url }) =>
        Promise.resolve(
          JSON.stringify({
            url,
            params: queryString.parse(url.split('?').pop()!),
          })
        )
      )
    })

    describe(`#call`, () => {
      it(`uses the default origin`, async () => {
        const defaultApi = new Api(apiKey)
        expect(defaultApi.config.origin).toBe(
          'https://monitoringapi.solaredge.com'
        )
      })

      it(`uses a custom origin`, async () => {
        expect(api.config.origin).toBe(mockOrigin)
        const { url } = await api.call<CallDebug>('')

        expect(url).toStartWith(mockOrigin)
      })

      it(`includes the API key query param`, async () => {
        const { params } = await api.call<CallDebug>('')
        expect(params.api_key).toBe(apiKey)
      })

      it(`appends the path to the API origin`, async () => {
        const { url } = await api.call<CallDebug>('/foo')
        expect(url).toStartWith(`${mockOrigin}/foo`)
      })

      it(`appends query params`, async () => {
        const { url } = await api.call<CallDebug>('/foo', {
          params: { bar: ['foobar', 'bar'] },
        })
        expect(url).toEndWith(
          '/foo?api_key=123456789ABCDEFGHIJKLMNOPQRSTUVW&bar=foobar&bar=bar'
        )
      })
    })

    describe(`#callGenerator`, () => {
      let config: ApiCallGeneratorConfig<CallDebug>

      beforeEach(() => {
        config = {
          apiPath: '/',
          timeUnit: TimeUnit.Day,
          interval: { months: 1 },
          dateRange: [startDate, endDate],
          parser: (res) => [res],
        }
      })

      it(`returns a generator that calls the API`, async () => {
        const generator = api.callGenerator<CallDebug>(config)
        const { value } = await generator.next()

        // @ts-ignore
        expect('url' in value && value.url).toInclude(mockOrigin)
      })

      it(`accepts a dateRange`, async () => {
        const { apiPath, timeUnit, interval, parser } = config
        const generator = api.callGenerator<CallDebug>({
          dateRange: [startDate, endDate],
          apiPath,
          timeUnit,
          interval,
          parser,
        })
        const result = await generator.next()

        expect(result.done).toBeFalse()
        if (!result.done) {
          expect(result.value.params.startDate).toBe('1999-01-01')
          expect(result.value.params.endDate).toBe('1999-02-01')
        }
      })

      it(`accepts a timeRange`, async () => {
        const { apiPath, timeUnit, interval, parser } = config
        const generator = api.callGenerator<CallDebug>({
          timeRange: [startDate, endDate],
          apiPath,
          timeUnit,
          interval,
          parser,
        })
        const result = await generator.next()

        expect(result.done).toBeFalse()
        if (!result.done) {
          expect(result.value.params.startTime).toBe('1999-01-01 00:00:00')
          expect(result.value.params.endTime).toBe('1999-02-01 00:00:00')
        }
      })

      it(`doesn't matter if dateRange or timeRange is reversed`, async () => {
        const { apiPath, timeUnit, interval, parser } = config
        const generator = api.callGenerator<CallDebug>({
          timeRange: [endDate, startDate],
          apiPath,
          timeUnit,
          interval,
          parser,
        })

        const result = await generator.next()

        expect(result.done).toBeFalse()
        if (!result.done) {
          expect(result.value.params.startTime).toBe('1999-01-01 00:00:00')
          expect(result.value.params.endTime).toBe('1999-02-01 00:00:00')
        }
      })

      it(`accepts an interval`, async () => {
        const generator = api.callGenerator<CallDebug>(config)
        const result = await generator.next()

        expect(result.done).toBeFalse()
        if (!result.done) {
          expect(result.value.params.timeUnit).toBe('DAY')
        }
      })

      it(`iterates by the specified interval`, async () => {
        const generator = api.callGenerator<CallDebug>(config)
        const first = await generator.next()
        const second = await generator.next()

        if (first.done || second.done) {
          expect(first.done).toBeFalse()
          expect(second.done).toBeFalse()
          return
        }

        expect(first.value.params.startDate).toBe('1999-01-01')
        expect(first.value.params.endDate).toBe('1999-02-01')

        expect(second.value.params.startDate).toBe('1999-02-01')
        expect(second.value.params.endDate).toBe('1999-03-01')
      })

      it(`interval doesn't exceed the specified range`, async () => {
        config.interval = { years: 25 }

        const generator = api.callGenerator<CallDebug>(config)
        const first = await generator.next()
        const { done } = await generator.next()

        if (first.done) {
          expect(first.done).toBeFalse()
          return
        }

        expect(first.value.params.startDate).toBe('1999-01-01')
        expect(first.value.params.endDate).toBe('2000-01-01')
        expect(done).toBeTrue()
      })

      it(`returns data about the calls`, async () => {
        config.parser = (res) => new Array(12).fill(res)
        const generator = api.callGenerator<CallDebug>(config)

        let value: any
        let done = false
        while (!done) {
          const result = await generator.next()
          value = result.value
          done = result.done!
        }

        expect(value).toEqual({
          config,
          apiCallTotal: 12,
          recordTotal: 144,
        })
      })
    })
  })
})
