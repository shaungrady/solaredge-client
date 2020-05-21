import { assertNever } from 'assert-never'
import { lightFormat } from 'date-fns'

import { Serialize } from '../api/api.types'

const dateFormat = 'yyyy-MM-dd'
const dateTimeFormat = 'yyyy-MM-dd HH:mm:ss'

export function serializeDate(date: Date): string {
  return lightFormat(date, dateFormat)
}

export function serializeDateTime(date: Date): string {
  return lightFormat(date, dateTimeFormat)
}

type dateOrDateTimeRange =
  | {
      startDate: Date
      endDate: Date
    }
  | {
      startTime: Date
      endTime: Date
    }

export function serializeDateOrTimeRange(
  range: dateOrDateTimeRange
): Serialize<dateOrDateTimeRange> {
  if ('startDate' in range) {
    return {
      startDate: serializeDate(range.startDate),
      endDate: serializeDate(range.endDate),
    }
  }
  if ('startTime' in range) {
    return {
      startTime: serializeDateTime(range.startTime),
      endTime: serializeDateTime(range.endTime),
    }
  }

  return assertNever(range)
}
