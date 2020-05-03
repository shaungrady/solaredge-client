import {
  DateRangeParams,
  DateTimeRangeParams,
  Meter,
  TimeUnit,
} from '../api.types.js'

export interface SiteDetails {
  id: number
  name: string
  accountId: number
  status: string
  peakPower: number
  lastUpdateTime: Date | null
  installationDate: Date | null
  ptoDate: Date | null
  notes: string
  type: string
  location: {
    country: string
    state: string
    city: string
    address: string
    address2: string
    zip: string
    timeZone: string
  }
  alertQuantity: number
  alertSeverity: string
  uris: {
    PUBLIC_URL: string
    IMAGE_URI: string
  }
  publicSettings: {
    name: string
    isPublic: boolean
  }
}

export interface SiteDataPeriod {
  startDate: Date | null
  endDate: Date | null
}

export interface SiteMeasurements {
  timeUnit: TimeUnit
  unit: string
  measuredBy: string
  values: SiteMeasurementValue[]
}

interface SiteMeasurementValue {
  date: Date
  value: number | null
}

export type SiteMeasurement = Omit<SiteMeasurements, 'values'> &
  SiteMeasurementValue

export type SiteMeasurementGeneratorConfig = {
  apiPath: string
  periodDuration: Duration
  range: DateRangeParams | DateTimeRangeParams
  timeUnit?: TimeUnit
}

export interface SiteDetailedMeasurements {
  timeUnit: TimeUnit
  unit: string
  meters: Array<{
    type: Meter
    values: Array<{
      date: Date
      value: number
    }>
  }>
}

export interface SiteEnvironmentalBenefits {
  gasEmissionSaved: {
    units: string
    co2: number
    so2: number
    nox: number
  }
  treesPlanted: number
  lightBulbs: number
}
