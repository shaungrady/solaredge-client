import Api from './api.class'

describe(`Api`, () => {
  const dateA = new Date(111111111111)
  const dateB = new Date(999999999999)

  describe(`static`, () => {
    describe(`#isValidApiKey`, () => {
      // prettier-ignore
      const testCases: [string, boolean][] = [
        ['123456789ABCDEFGHIJKLMNOPQRSTUVW', true],
        ['123456789ABCDEFGHIJKLMNOPQRSTUVw', false], // Lowercase char
        ['123456789ABCDEFGHIJKLMNOPQRSTUV@', false], // Symbol char
        ['123456789ABCDEFGHIJKLMNOPQRSTUV', false], // Too short
        ['123456789ABCDEFGHIJKLMNOPQRSTUVWX', false], // Too long
      ]

      testCases.forEach(([input, expectation]) => {
        it(`${input} is ${expectation}`, () => {
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
})
