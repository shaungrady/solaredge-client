// eslint-disable-next-line import/no-named-default
import { default as packageExport } from './index'
import Client from './client/client.class'

describe(`index`, () => {
  it(`exports SolaredgeClient`, () => {
    expect(packageExport).toBe(Client)
  })
})
