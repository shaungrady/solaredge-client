/* eslint-disable @typescript-eslint/ban-ts-comment */
import { parseISO } from 'date-fns'
import fetchMock from 'jest-fetch-mock'
import Err from '../shared/errors.enum'
import Api from './api.class'

describe(`Api`, () => {
  const apiKey = '123456789ABCDEFGHIJKLMNOPQRSTUVW'
  const dateA = new Date(111111111111)
  const dateB = new Date(999999999999)
  const startDate = parseISO('2000-01-01')
  const endDate = parseISO('2010-01-01')

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
      // @ts-ignore
      expect(() => new Api(`${apiKey}!`)).toThrowError(Err.invalidApiKey)
    })

    it(`constructs with a valid API key`, () => {
      // @ts-ignore
      expect(new Api(apiKey)).toBeInstanceOf(Api)
    })
  })

  describe(`instance`, () => {
    const mockOrigin = 'http://localhost'
    let api: Api

    beforeEach(() => {
      // Origin set to localhost for safety, so unmocked requests don't leak out.
      api = new Api(apiKey, { origin: mockOrigin })
      fetchMock.resetMocks()
      fetchMock.mockResponse(({ url }) =>
        Promise.resolve(JSON.stringify({ url }))
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
        const res = await api.call<string>('')
        expect(res).toStartWith(mockOrigin)
      })

      it(`includes the API key query param`, async () => {
        const res = await api.call<string>('')
        expect(res).toInclude(`api_key=${apiKey}`)
      })

      it(`appends the path to the API origin`, async () => {
        const res = await api.call<string>('/foo')
        expect(res).toStartWith(`${mockOrigin}/foo`)
      })

      it(`appends query params`, async () => {
        const res = await api.call<string>('/foo', { bar: ['foobar', 'bar'] })
        expect(res).toEndWith(
          '/foo?api_key=123456789ABCDEFGHIJKLMNOPQRSTUVW&bar=foobar&bar=bar'
        )
      })
    })

    describe(`#getCallGenerator`, () => {
      xit(`returns a generator that calls the API`, () => {
        // api.getCallGenerator({
        //   apiPath: '',
        // })
      })
    })
  })
})
