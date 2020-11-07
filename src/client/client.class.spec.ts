import { parseISO } from 'date-fns'
import { TimeUnit } from '../api/api.types'
import { asyncForEach } from '../test/async-for-each.fn'
import Err from '../shared/errors.enum'
import { parseParams } from '../test/parse-params.fn'
import mockResponseBody from '../test/mock-response-body.fn'
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
							telemetries: new Array(21).fill({}),
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
				const timeUnits = [
					TimeUnit.Day,
					TimeUnit.Week,
					TimeUnit.Month,
					TimeUnit.Year,
				]

				await asyncForEach(timeUnits, async (timeUnit) => {
					await client
						.fetchSiteEnergyGenerator('42', { dateRange, timeUnit })
						.next()
					const params = lastCallParams()
					expect(params).toHaveProperty('startDate', '1999-01-01')
					expect(params).toHaveProperty('endDate', '2000-01-01')
				})
			})

			it(`uses a one month interval when 'timeUnit' is less than than a day`, async () => {
				const timeUnits = [TimeUnit.QuarterHour, TimeUnit.Hour]

				await asyncForEach(timeUnits, async (timeUnit) => {
					await client
						.fetchSiteEnergyGenerator('42', { dateRange, timeUnit })
						.next()
					const params = lastCallParams()
					expect(params).toHaveProperty('startDate', '1999-01-01')
					expect(params).toHaveProperty('endDate', '1999-02-01')
				})
			})
		})

		describe(`#fetchSitePowerGenerator`, () => {
			it(`calls the correct path`, async () => {
				await client.fetchSitePowerGenerator('42', { timeRange }).next()
				expect(lastCallUrl()).toContain(`/site/42/power?`)
			})

			it(`merges the response properties and 'values' array into a collection`, async () => {
				const { value } = await client
					.fetchSitePowerGenerator('42', { timeRange })
					.next()
				expect(value).toEqual({
					foo: 'bar',
					baz: 'foobar',
				})
			})
		})

		it(`#fetchSiteCurrentPowerFlow calls the correct path`, async () => {
			await client.fetchSiteCurrentPowerFlow('42')
			expect(lastCallUrl()).toContain(`/site/42/currentPowerFlow?`)
		})

		it(`#fetchSiteStorageData calls the correct path`, async () => {
			await client.fetchSiteStorageData('42')
			expect(lastCallUrl()).toContain(`/site/42/storageData?`)
		})

		it(`#fetchSiteEquipmentList calls the correct path`, async () => {
			await client.fetchSiteEquipmentList('42')
			expect(lastCallUrl()).toContain(`/equipment/42/list?`)
		})

		it(`#fetchSiteEquipmentChangeLog calls the correct path`, async () => {
			await client.fetchSiteEquipmentChangeLog('42', '24')
			expect(lastCallUrl()).toContain(`/equipment/42/24/changeLog?`)
		})

		describe(`#fetchSiteEnvironmentalBenefits`, () => {
			it(`calls the correct path`, async () => {
				await client.fetchSiteEnvironmentalBenefits('42')
				expect(lastCallUrl()).toContain(`/site/42/envBenefits?`)
			})

			it(`calls with Imperial units by default`, async () => {
				await client.fetchSiteEnvironmentalBenefits('42')
				expect(lastCallParams()).toHaveProperty('systemUnits', 'Imperial')
			})

			it(`calls with Metric units`, async () => {
				await client.fetchSiteEnvironmentalBenefits('42', true)
				expect(lastCallParams()).toHaveProperty('systemUnits', 'Metric')
			})
		})

		describe(`#fetchInverterTelemetryGenerator`, () => {
			const telemetries = [{ a: 1 }, { a: 2 }, { a: 3 }]
			beforeEach(() => {
				fetchMock.mockResponseOnce(
					mockResponseBody({
						sites: {
							count: 1,
							telemetries,
						},
					})
				)
			})

			it(`calls the correct path`, async () => {
				await client
					.fetchInverterTelemetryGenerator('42', '24', { timeRange })
					.next()
				expect(lastCallUrl()).toContain(`/equipment/42/24/data?`)
			})

			it(`returns the telemetries`, async () => {
				const { value } = await client
					.fetchInverterTelemetryGenerator('42', '24', { timeRange })
					.next()
				expect(value).toEqual(telemetries[0])
			})
		})
	})
})
