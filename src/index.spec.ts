// eslint-disable-next-line import/no-named-default
import Client from './client/client.class'
import { SolaredgeClient } from './index'

describe(`index`, () => {
	it(`exports SolaredgeClient`, () => {
		expect(SolaredgeClient).toBe(Client)
	})
})
