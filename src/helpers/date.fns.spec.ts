import {
  serializeDate,
  serializeDateOrTimeRange,
  serializeDateTime,
} from './date.fns'

const dateA = new Date(111111111111)
const dateB = new Date(999999999999)

describe(`date helpers`, () => {
  describe(`serializeDate`, () => {
    it(`serializes a Date to a date string`, () => {
      expect(serializeDate(dateA)).toBe('1973-07-10')
    })
  })

  describe(`serializeDateTime`, () => {
    it(`serializes a Date to a datetime string`, () => {
      expect(serializeDateTime(dateB)).toBe('2001-09-09 01:46:39')
    })
  })

  describe(`serializeDateOrTimeRange`, () => {
    it(`serializes a date range to date strings`, () => {
      expect(
        serializeDateOrTimeRange({
          startDate: dateA,
          endDate: dateB,
        })
      ).toEqual({
        startDate: '1973-07-10',
        endDate: '2001-09-09',
      })
    })

    it(`serializes a time range to datetime strings`, () => {
      expect(
        serializeDateOrTimeRange({
          startTime: dateA,
          endTime: dateB,
        })
      ).toEqual({
        startTime: '1973-07-10 00:11:51',
        endTime: '2001-09-09 01:46:39',
      })
    })
  })
})
