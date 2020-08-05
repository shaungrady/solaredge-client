import Err from '../shared/errors.enum'
import mockResponseBody from '../shared/response-body.mock'
import SolaredgeClient from './client.class'

describe(`Client`, () => {
  const apiKey = '123456789ABCDEFGHIJKLMNOPQRSTUVW'

  describe(`construction`, () => {
    it(`doesn't construct without an API key`, () => {
      // @ts-ignore
      expect(() => new SolaredgeClient()).toThrowError()
    })

    it(`doesn't construct with an invalid API key`, () => {
      // @ts-ignore
      expect(() => new SolaredgeClient({ apiKey: `${apiKey}!` })).toThrowError(
        Err.invalidApiKey
      )
    })

    it(`constructs with a valid API key`, () => {
      expect(new SolaredgeClient({ apiKey })).toBeInstanceOf(SolaredgeClient)
    })
  })

  describe(`instance`, () => {
    const client: SolaredgeClient = new SolaredgeClient({
      apiKey,
      apiOrigin: 'http://localhost',
    })
    let mock: typeof fetchMock.mock

    beforeEach(() => {
      mock = fetchMock.mockResponse(mockResponseBody({})).mock
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
        expect(mock.calls[0][0]).toEndWith(`/sites/list?api_key=${apiKey}`)
      })

      it(`unwraps the response`, async () => {
        const sites = await client.fetchSiteList()
        expect(sites).toBeArrayOfSize(21)
      })
    })

    it(`#fetchSiteDetails calls the correct path`, async () => {
      fetchMock.mockResponseOnce(mockResponseBody({}))
      await client.fetchSiteDetails('42')
      expect(mock.calls[0][0]).toContain(`/site/42/details?`)
    })

    it(`#fetchSiteDataPeriod calls the correct path`, async () => {
      fetchMock.mockResponseOnce(mockResponseBody({}))
      await client.fetchSiteDataPeriod('42')
      expect(mock.calls[0][0]).toContain(`/site/42/dataPeriod?`)
    })

    xdescribe(`#fetchSiteEnergyGenerator`, () => {
      it(``, () => {})
    })
  })
})
