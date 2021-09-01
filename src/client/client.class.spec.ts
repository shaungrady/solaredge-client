import { parseISO } from 'date-fns'
import { TimeUnit } from '../api/api.types'
import { apiCalls } from '../mocks/handlers'
import Err from '../shared/errors.enum'
import { asyncForEach } from '../test/async-for-each.fn'
import Client from './client.class'

describe(`Client`, () => {
	const apiKey = '123456789ABCDEFGHIJKLMNOPQRSTUVW'
	const startDate = parseISO('2019-01-01')
	const endDate = parseISO('2021-01-01')
	let dateRange: [Date, Date]
	let timeRange: [Date, Date]

	beforeEach(() => {
		dateRange = timeRange = [startDate, endDate]
	})

	afterEach(() => {
		apiCalls.clear()
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
		const client: Client = new Client({
			apiKey,
			apiOrigin: 'https://localhost',
		})

		describe(`#siteList`, () => {
			it(`calls the correct path`, async () => {
				await client.siteList()
				expect(apiCalls.last?.url.href).toMatchInlineSnapshot(
					`"https://localhost/sites/list?api_key=123456789ABCDEFGHIJKLMNOPQRSTUVW"`
				)
			})

			it(`wraps it in a response object`, async () => {
				const sites = await client.siteList()
				expect(sites.error).toBeNull()
				expect(sites.data?.site[0].id).toEqual(42)
			})
		})

		it(`#siteDetails calls the correct path`, async () => {
			await client.siteDetails('42')
			expect(apiCalls.last?.url.href).toMatchInlineSnapshot(
				`"https://localhost/site/42/details?api_key=123456789ABCDEFGHIJKLMNOPQRSTUVW"`
			)
		})

		it(`#siteDataPeriod calls the correct path`, async () => {
			await client.siteDataPeriod('42')
			expect(apiCalls.last?.url.href).toMatchInlineSnapshot(
				`"https://localhost/site/42/dataPeriod?api_key=123456789ABCDEFGHIJKLMNOPQRSTUVW"`
			)
		})

		describe(`#siteEnergy`, () => {
			it(`calls the correct path`, async () => {
				await client.siteEnergy('42', { dateRange }).next()
				expect(apiCalls.last?.url.pathname).toMatchInlineSnapshot(
					`"/site/42/energy"`
				)
			})

			it(`defaults to "timeUnit: DAY"`, async () => {
				await client.siteEnergy('42', { dateRange }).next()
				expect(apiCalls.last?.url.searchParams.get('timeUnit')).toEqual('DAY')
			})

			it(`merges the response properties and 'values' array into a collection`, async () => {
				const { value } = await client.siteEnergy('42', { dateRange }).next()
				expect(value).toMatchInlineSnapshot(`
			Object {
			  "date": "2020-01-01 00:00:00",
			  "measuredBy": "INVERTER",
			  "timeUnit": "DAY",
			  "unit": "Wh",
			  "value": 9585.842,
			}
		`)
			})

			it(`uses a one year interval when 'timeUnit' is greater than an hour`, async () => {
				const timeUnits = [
					TimeUnit.Day,
					TimeUnit.Week,
					TimeUnit.Month,
					TimeUnit.Year,
				]

				await asyncForEach(timeUnits, async (timeUnit) => {
					await client.siteEnergy('42', { dateRange, timeUnit }).next()
					const startDate = apiCalls.last?.url.searchParams.get('startDate')
					const endDate = apiCalls.last?.url.searchParams.get('endDate')

					expect({ startDate, endDate }).toEqual({
						startDate: '2019-01-01',
						endDate: '2020-01-01',
					})
				})
			})

			it(`uses a one month interval when 'timeUnit' is less than than a day`, async () => {
				const timeUnits = [TimeUnit.QuarterHour, TimeUnit.Hour]

				await asyncForEach(timeUnits, async (timeUnit) => {
					await client.siteEnergy('42', { dateRange, timeUnit }).next()
					const startDate = apiCalls.last?.url.searchParams.get('startDate')
					const endDate = apiCalls.last?.url.searchParams.get('endDate')

					expect({ startDate, endDate }).toEqual({
						startDate: '2019-01-01',
						endDate: '2019-02-01',
					})
				})
			})
		})

		describe(`#sitePower`, () => {
			it(`calls the correct path`, async () => {
				await client.sitePower('42', { timeRange }).next()
				expect(apiCalls.last?.url.pathname).toMatchInlineSnapshot(
					`"/site/42/power"`
				)
			})

			it(`merges the response properties and 'values' array into a collection`, async () => {
				const { value } = await client.sitePower('42', { timeRange }).next()
				expect(value).toMatchInlineSnapshot(`
			Object {
			  "date": "2020-01-01 12:00:00",
			  "measuredBy": "INVERTER",
			  "timeUnit": "QUARTER_OF_AN_HOUR",
			  "unit": "W",
			  "value": 1911.6666,
			}
		`)
			})
		})

		it(`#siteCurrentPowerFlow calls the correct path`, async () => {
			await client.siteCurrentPowerFlow('42')
			expect(apiCalls.last?.url.pathname).toMatchInlineSnapshot(
				`"/site/42/currentPowerFlow"`
			)
		})

		it(`#siteStorageData calls the correct path`, async () => {
			await client.siteStorageData('42')
			expect(apiCalls.last?.url.pathname).toMatchInlineSnapshot(
				`"/site/42/storageData"`
			)
		})

		it(`#siteEquipmentList calls the correct path`, async () => {
			await client.siteComponentsList('42')
			expect(apiCalls.last?.url.pathname).toMatchInlineSnapshot(
				`"/equipment/42/list"`
			)
		})

		it(`#siteEquipmentChangeLog calls the correct path`, async () => {
			await client.siteEquipmentChangeLog('42', '24')
			expect(apiCalls.last?.url.pathname).toMatchInlineSnapshot(
				`"/equipment/42/24/changeLog"`
			)
		})

		describe(`#siteEnvironmentalBenefits`, () => {
			it(`calls the correct path`, async () => {
				await client.siteEnvironmentalBenefits('42')
				expect(apiCalls.last?.url.pathname).toMatchInlineSnapshot(
					`"/site/42/envBenefits"`
				)
			})

			it(`calls with Imperial units by default`, async () => {
				await client.siteEnvironmentalBenefits('42')
				expect(apiCalls.last?.url.searchParams.get('systemUnits')).toBe(
					'Imperial'
				)
			})

			it(`calls with Metric units`, async () => {
				await client.siteEnvironmentalBenefits('42', true)
				expect(apiCalls.last?.url.searchParams.get('systemUnits')).toBe(
					'Metric'
				)
			})
		})

		describe(`#inverterTelemetry`, () => {
			it(`calls the correct path`, async () => {
				await client.inverterTechnicalData('42', '24', { timeRange }).next()
				expect(apiCalls.last?.url.pathname).toMatchInlineSnapshot(
					`"/equipment/42/24/data"`
				)
			})

			it(`returns the telemetries`, async () => {
				const { value } = await client
					.inverterTechnicalData('42', '24', { timeRange })
					.next()

				expect(value).toMatchInlineSnapshot(`
Object {
  "L1Data": Object {
    "acCurrent": 8.24805,
    "acFrequency": 60.0438,
    "acVoltage": 240.312,
    "activePower": 1918.5,
    "apparentPower": 1924,
    "cosPhi": 1,
    "reactivePower": 145.5,
  },
  "date": "2020-01-01 12:03:21",
  "dcVoltage": 362.188,
  "groundFaultResistance": 6000,
  "inverterMode": "MPPT",
  "powerLimit": 100,
  "temperature": 24.5174,
  "totalActivePower": 1918.5,
  "totalEnergy": 21649100,
}
`)
			})
		})
	})
})
