import { parseISO } from 'date-fns'
import { TimeUnit } from '../api/api.types'
import Err from '../shared/errors.enum'
import { parseParams } from '../shared/parse-params.mock'
import mockResponseBody from '../shared/response-body.mock'
import Client from './client.class'

describe(`Client`, () => {
  const apiKey = '123456789ABCDEFGHIJKLMNOPQRSTUVW'
  const startDate = parseISO('1999-01-01')
  const endDate = parseISO('2001-01-01')
  let dateRange: [Date, Date]
  let timeRange: [Date, Date]

  beforeEach(() => {
    dateRange = timeRange = [startDate, endDate]
  })

  describe(`construction`, () => {
    it(`doesn't construct without an API key`, () => {
      // @ts-ignore
      expect(() => new Client()).toThrowError()
    })

    it(`doesn't construct with an invalid API key`, () => {
      // @ts-ignore
      expect(() => new Client({ apiKey: `${apiKey}!` })).toThrowError(
        Err.invalidApiKey
      )
    })

    it(`constructs with a valid API key`, () => {
      expect(new Client({ apiKey })).toBeInstanceOf(Client)
    })
  })

  describe(`instance`, () => {
    let mock: typeof fetchMock.mock
    const lastCallUrl = () => mock.calls[0][0] as string | undefined
    const lastCallParams = () => parseParams(lastCallUrl() ?? '')
    const client: Client = new Client({
      apiKey,
      apiOrigin: 'http://localhost',
    })

    beforeEach(() => {
      mock = fetchMock.mockResponse(
        mockResponseBody({
          foo: 'bar',
          values: new Array(21).fill({ baz: 'foobar' }),
        })
      ).mock
    })

    afterEach(() => {
      fetchMock.resetMocks()
    })

    describe(`#fetchSiteList`, () => {
      beforeEach(() => {
        fetchMock.mockResponseOnce(
          mockResponseBody({
            sites: {
              count: 1,
              site: new Array(21).fill({}),
            },
          })
        )
      })

      it(`calls the correct path`, async () => {
        await client.fetchSiteList()
        expect(lastCallUrl()).toEndWith(`/sites/list?api_key=${apiKey}`)
      })

      it(`unwraps the response`, async () => {
        const sites = await client.fetchSiteList()
        expect(sites).toBeArrayOfSize(21)
      })
    })

    it(`#fetchSiteDetails calls the correct path`, async () => {
      await client.fetchSiteDetails('42')
      expect(lastCallUrl()).toContain(`/site/42/details?`)
    })

    it(`#fetchSiteDataPeriod calls the correct path`, async () => {
      await client.fetchSiteDataPeriod('42')
      expect(lastCallUrl()).toContain(`/site/42/dataPeriod?`)
    })

    describe(`#fetchSiteEnergyGenerator`, () => {
      it(`calls the correct path`, async () => {
        await client.fetchSiteEnergyGenerator('42', { dateRange }).next()
        expect(lastCallUrl()).toContain(`/site/42/energy?`)
      })

      it(`defaults to "timeUnit: DAY"`, async () => {
        await client.fetchSiteEnergyGenerator('42', { dateRange }).next()
        expect(lastCallParams()).toHaveProperty('timeUnit', 'DAY')
      })

      it(`merges the response properties and 'values' array into a collection`, async () => {
        const { value } = await client
          .fetchSiteEnergyGenerator('42', { dateRange })
          .next()
        expect(value).toEqual({
          foo: 'bar',
          baz: 'foobar',
        })
      })

      it(`uses a one year interval when 'timeUnit' is greater than an hour`, async () => {
        const reqs: Promise<any>[] = []
        const timeUnits = [
          TimeUnit.Day,
          TimeUnit.Week,
          TimeUnit.Month,
          TimeUnit.Year,
        ]

        timeUnits.forEach((timeUnit) => {
          const req = client
            .fetchSiteEnergyGenerator('42', { dateRange, timeUnit })
            .next()
          reqs.push(req)

          const params = lastCallParams()
          expect(params).toHaveProperty('startDate', '1999-01-01')
          expect(params).toHaveProperty('endDate', '2000-01-01')
        })

        await Promise.all(reqs)
      })

      it(`uses a one month interval when 'timeUnit' is less than than a day`, async () => {
        const reqs: Promise<any>[] = []
        const timeUnits = [TimeUnit.QuarterHour, TimeUnit.Hour]

        timeUnits.forEach((timeUnit) => {
          const req = client
            .fetchSiteEnergyGenerator('42', { dateRange, timeUnit })
            .next()
          reqs.push(req)

          const params = lastCallParams()
          expect(params).toHaveProperty('startDate', '1999-01-01')
          expect(params).toHaveProperty('endDate', '1999-02-01')
        })

        await Promise.all(reqs)
      })
    })
  })
})
