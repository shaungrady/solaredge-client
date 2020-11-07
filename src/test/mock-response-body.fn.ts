import { MockResponseInitFunction } from 'jest-fetch-mock/types'

export default function mockResponseBody(
	body: Record<any, any>
): MockResponseInitFunction {
	return async () => JSON.stringify(body)
}
