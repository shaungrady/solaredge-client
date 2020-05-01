import { lightFormat, parse } from 'date-fns'
import traverse from 'traverse'
import { assertNever } from 'assert-never'

import {
  DateRangeParams,
  DateTimeRangeParams,
  Serialize,
} from '../api/api.types'

const dateFormat = 'yyyy-MM-dd'
const dateTimeFormat = 'yyyy-MM-dd HH:mm:ss'
const dateTimePattern = /^\d{4}-\d{2}-\d{2}( \d{2}:\d{2}:\d{2})?$/

export function deserializeDate(date: unknown): Date | unknown {
  if (typeof date !== 'string') {
    return date
  }

  const isDateString = dateTimePattern.test(date)
  const format = date.length === 10 ? dateFormat : dateTimeFormat

  return isDateString ? parse(date, format, new Date()) : date
}

// Mutates data
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function recursivelyDeserializeDates<T extends Record<string, any>>(
  data: T
): T {
  return traverse(data).forEach(function nodeHandler(val: unknown) {
    if (this.isLeaf) {
      this.update(deserializeDate(val))
    }
  })
}

export function serializeDate(date: Date): string {
  return lightFormat(date, dateFormat)
}

export function serializeDateTime(date: Date): string {
  return lightFormat(date, dateTimeFormat)
}

type dateOrDateTimeRange = DateRangeParams | DateTimeRangeParams

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
