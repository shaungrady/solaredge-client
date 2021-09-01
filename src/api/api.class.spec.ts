import { parseISO } from 'date-fns'
import { apiCalls } from '../mocks/handlers'
import Err from '../shared/errors.enum'
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
		const mockOrigin = 'https://localhost'
		let api: Api

		beforeEach(() => {
			api = new Api(apiKey, { origin: mockOrigin })
		})

		afterEach(() => {
			apiCalls.clear()
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
			})

			it(`includes the API key query param`, async () => {
				await api.call<CallDebug>('')
				const apiKeyParam = apiCalls.last?.url.searchParams.get('api_key')

				expect(apiKeyParam).toBe(apiKey)
			})

			it(`appends the path to the API origin`, async () => {
				await api.call<CallDebug>('/foo')
				const { href } = apiCalls.last?.url!

				expect(href).toStartWith(`${mockOrigin}/foo`)
			})

			it(`appends query params`, async () => {
				await api.call<CallDebug>('/foo', {
					params: { bar: ['foobar', 'bar'] },
				})
				const { search } = apiCalls.last?.url!

				expect(search).toMatchInlineSnapshot(
					`"?api_key=123456789ABCDEFGHIJKLMNOPQRSTUVW&bar=foobar&bar=bar"`
				)
			})
		})

		describe(`#callGenerator`, () => {
			let config: ApiCallGeneratorConfig<CallDebug>

			beforeEach(() => {
				config = {
					apiPath: '/DEBUG',
					timeUnit: TimeUnit.Day,
					interval: { months: 1 },
					dateRange: [startDate, endDate],
					parser: (res) => [res],
				}
			})

			it(`returns a generator that calls the API`, async () => {
				await api.callGenerator<CallDebug>(config).next()
				expect(apiCalls.last?.url.origin).toEqual(mockOrigin)
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

				const startDateParam = apiCalls.last?.url.searchParams.get('startDate')
				const endDateParam = apiCalls.last?.url.searchParams.get('endDate')

				expect({ startDateParam, endDateParam }).toEqual({
					startDateParam: '1999-01-01',
					endDateParam: '1999-02-01',
				})
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

				const startTimeParam = apiCalls.last?.url.searchParams.get('startTime')
				const endTimeParam = apiCalls.last?.url.searchParams.get('endTime')

				expect({ startTimeParam, endTimeParam }).toEqual({
					startTimeParam: '1999-01-01 00:00:00',
					endTimeParam: '1999-02-01 00:00:00',
				})
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

				await generator.next()

				const startTimeParam = apiCalls.last?.url.searchParams.get('startTime')
				const endTimeParam = apiCalls.last?.url.searchParams.get('endTime')

				expect({ startTimeParam, endTimeParam }).toEqual({
					startTimeParam: '1999-01-01 00:00:00',
					endTimeParam: '1999-02-01 00:00:00',
				})
			})

			it(`accepts an interval`, async () => {
				await api.callGenerator<CallDebug>(config).next()
				expect(apiCalls.last?.url.searchParams.get('timeUnit')).toBe('DAY')
			})

			it(`iterates by the specified interval`, async () => {
				const generator = api.callGenerator<CallDebug>(config)
				await generator.next()
				expect(apiCalls.last?.url.searchParams.get('startDate')).toBe(
					'1999-01-01'
				)
				expect(apiCalls.last?.url.searchParams.get('endDate')).toBe(
					'1999-02-01'
				)

				await generator.next()
				expect(apiCalls.last?.url.searchParams.get('startDate')).toBe(
					'1999-02-01'
				)
				expect(apiCalls.last?.url.searchParams.get('endDate')).toBe(
					'1999-03-01'
				)
			})

			it(`interval doesn't exceed the specified range`, async () => {
				config.interval = { years: 25 }

				const generator = api.callGenerator<CallDebug>(config)
				await generator.next()

				expect(apiCalls.last?.url.searchParams.get('startDate')).toBe(
					'1999-01-01'
				)
				expect(apiCalls.last?.url.searchParams.get('endDate')).toBe(
					'2000-01-01'
				)

				const { done } = await generator.next()
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
					error: null,
					config,
					apiCallTotal: 12,
					recordTotal: 144,
				})
			})
		})
	})
})
