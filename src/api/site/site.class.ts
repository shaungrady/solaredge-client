import { add, isBefore, min } from 'date-fns'

import {
  DateRangeParams,
  DateTimeRangeParams,
  TimeUnit,
  TimeUnitParam,
} from '../api.types'
import { serializeDateOrTimeRange } from '../../helpers/date'
import {
  SiteDataPeriod,
  SiteDetails,
  SiteEnvironmentalBenefits,
  SiteMeasurement,
  SiteMeasurementGeneratorConfig,
  SiteMeasurements,
} from './site.types'
import SolaredgeApi from '../api.class'

export default class SolaredgeSite extends SolaredgeApi {
  #details?: SiteDetails

  get details(): SiteDetails | undefined {
    return this.#details
  }

  constructor(public readonly apiKey: string, public readonly id: number) {
    super(apiKey)
  }

  deserializeDetails(site: SiteDetails): SolaredgeSite {
    this.#details = site
    return this
  }

  // Displays the site details, such as name, location, status, etc.
  // Also updates the site details of the SolaredgeSite instance.
  async fetchDetails(): Promise<SiteDetails> {
    return this.callApi<SiteDetails>('/details').then((details) => {
      this.deserializeDetails(details)
      return details
    })
  }

  // Return the energy production start and end dates of the site.
  async fetchDataPeriod(): Promise<SiteDataPeriod> {
    return this.callApi<SiteDataPeriod>('/dataPeriod')
  }

  // Return an async generator for the site energy measurements (in watt-hours).
  // Default timeUnit: `TimeUnit.Day`
  getEnergyGenerator(
    options: DateRangeParams & Partial<TimeUnitParam>
  ): AsyncGenerator<SiteMeasurement, void, void> {
    const { timeUnit = TimeUnit.Day, startDate, endDate } = options

    // Usage limitation: This API is limited to one year when using timeUnit=DAY (i.e., daily resolution) and to one month when
    // using timeUnit=QUARTER_OF_AN_HOUR or timeUnit=HOUR. This means that the period between endTime and startTime
    // should not exceed one year or one month respectively. If the period is longer, the system will generate error 403 with
    // proper description.
    let periodDuration: Duration
    switch (timeUnit) {
      case TimeUnit.QuarterHour:
      case TimeUnit.Hour:
        periodDuration = { months: 1 }
        break
      default:
        periodDuration = { years: 1 }
    }

    return this.getSiteMeasurementGenerator({
      apiPath: '/energy',
      timeUnit,
      periodDuration,
      range: {
        startDate,
        endDate,
      },
    })
  }

  // Return an async generator for the site power measurements in 15 minutes resolution (in watts).
  getPowerGenerator(
    options: DateTimeRangeParams
  ): AsyncGenerator<SiteMeasurement, void, void> {
    // Usage limitation: This API is limited to one-month period. This means that the period between endTime and startTime
    // should not exceed one month. If the period is longer, the system will generate error 403 with proper description.
    const periodDuration: Duration = { months: 1 }

    return this.getSiteMeasurementGenerator({
      apiPath: '/power',
      periodDuration,
      range: options,
    })
  }

  // Detailed site energy measurements from meters such as consumption, export (feed-in), import (purchase), etc.
  // Note: Calculated meter readings (also referred to as "virtual meters"), such as self-consumption, are calculated using the data
  // measured by the meter and the inverters.
  // async energyDetails(): Promise<SiteDetailedMeasurements> {
  // 	const startTime = startOfToday()
  // 	const endTime = startOfTomorrow()
  //
  // 	return this.apiCall<SiteDetailedMeasurements>('/energyDetails', {
  // 		startTime: serializeDateTime(startTime),
  // 		endTime: serializeDateTime(endTime),
  // 	})
  // }

  // Detailed site power measurements from meters such as consumption, export (feed-in), import (purchase), etc.
  // Note: Calculated meter readings (also referred to as "virtual meters"), such as self-consumption, are calculated using the data
  // measured by the meter and the inverters.
  // async powerDetails(): Promise<SiteDetailedMeasurements> {
  // 	const startTime = startOfToday()
  // 	const endTime = startOfTomorrow()
  //
  // 	return this.apiCall<SiteDetailedMeasurements>('/powerDetails', {
  // 		startTime: serializeDateTime(startTime),
  // 		endTime: serializeDateTime(endTime),
  // 	})
  // }

  // Retrieves the current power flow between all elements of the site including PV array, storage (battery), loads
  // (consumption) and grid.
  // Note: Applies when export, import, and consumption can be measured.
  async fetchCurrentPowerFlow(): Promise<unknown> {
    // TODO: Write return interface
    return this.callApi('/currentPowerFlow')
  }

  // Get detailed storage information from batteries: the state of energy, power and lifetime energy.
  // Note: Applicable to systems with batteries.
  async fetchStorageData(): Promise<unknown> {
    // TODO: Write return interface
    return this.callApi('/storageData')
  }

  async fetchEnvironmentalBenefits(
    metricUnits?: boolean
  ): Promise<SiteEnvironmentalBenefits> {
    const params: { systemUnits?: string } = {}
    if (metricUnits ?? false) {
      params.systemUnits = metricUnits ? 'Metric' : 'Imperial'
    }
    return this.callApi<SiteEnvironmentalBenefits>('/envBenefits', params)
  }

  protected callApi<T>(
    path: string,
    reqParams: Record<string, any> = {}
  ): Promise<T> {
    return super.callApi(`/site/${this.id}${path}`, reqParams)
  }

  protected getSiteMeasurementGenerator(
    config: SiteMeasurementGeneratorConfig
  ): AsyncGenerator<SiteMeasurement, void, void> {
    const callApi = this.callApi.bind(this)
    const { apiPath, periodDuration, range, ...timeUnit } = config

    // TODO: This is kind of ugly…
    let isDateRange: boolean
    let rangeStart: Date
    let rangeEnd: Date

    if ('startDate' in range) {
      isDateRange = true
      rangeStart = range.startDate
      rangeEnd = range.endDate
    } else {
      isDateRange = false
      rangeStart = range.startTime
      rangeEnd = range.endTime
    }

    return (async function* SiteMeasurementGenerator(): AsyncGenerator<
      SiteMeasurement,
      void,
      void
    > {
      let periodStart = rangeStart
      while (isBefore(periodStart, rangeEnd)) {
        const periodEnd = min([rangeEnd, add(periodStart, periodDuration)])

        // TODO: This is kind of ugly…
        const rangeParams = isDateRange
          ? {
              startDate: periodStart,
              endDate: periodEnd,
            }
          : {
              startTime: periodStart,
              endTime: periodEnd,
            }

        // eslint-disable-next-line no-await-in-loop
        const measurements = await callApi<SiteMeasurements>(apiPath, {
          ...serializeDateOrTimeRange(rangeParams),
          ...timeUnit,
        })

        const { values, ...metadata } = measurements

        for (const value of values) {
          yield {
            ...metadata,
            ...value,
          }
        }

        periodStart = periodEnd
      }
    })()
  }
}
