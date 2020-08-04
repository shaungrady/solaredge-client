// eslint-disable-next-line import/no-named-default
import { default as client } from './index'
import SolaredgeClient from './client/client.class'

describe(`index`, () => {
  it(`exports SolaredgeClient`, () => {
    expect(client).toBe(SolaredgeClient)
  })
})
