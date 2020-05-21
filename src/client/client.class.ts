import Api from '../api/api.class'
import {
  DateRangeParam,
  DateTimeRangeParam,
  TimeUnit,
  TimeUnitParam,
} from '../api/api.types'
import {
  AccountSites,
  EquipmentChange,
  EquipmentChangeLog,
  InverterData,
  InverterTelemetry,
  SiteDataPeriod,
  SiteDetails,
  SiteEnvironmentalBenefits,
  SiteEquipmentList,
  SiteMeasurement,
  SiteMeasurements,
  SitesParams,
} from './client.types'

interface Options {
  apiKey: string
  apiOrigin?: string
}

// eslint-disable-next-line import/prefer-default-export
export default class SolaredgeClient {
  private readonly api: Api

  constructor({ apiKey, apiOrigin }: Options) {
    this.api = new Api(apiKey, apiOrigin)
  }

  // ***************************************************************************
  //    ACCOUNT-RELATED METHODS
  // ***************************************************************************

  async fetchSiteList(params: SitesParams = {}): Promise<SiteDetails[]> {
    return (await this.api.call<AccountSites>('/sites/list', params)).site
  }

  // ***************************************************************************
  //    SITE-RELATED METHODS
  // ***************************************************************************

  async fetchSiteDetails(siteId: string): Promise<SiteDetails> {
    return this.api.call<SiteDetails>(`/site/${siteId}/details`)
  }

  /**
   * Return the energy production start and end dates of the site.
   */
  async fetchSiteDataPeriod(siteId: string): Promise<SiteDataPeriod> {
    return this.api.call<SiteDataPeriod>(`/site/${siteId}/dataPeriod`)
  }

  // Return an async generator for the site energy measurements (in watt-hours).
  // Default timeUnit: `TimeUnit.Day`
  getSiteEnergyGenerator(
    siteId: string,
    options: DateRangeParam & Partial<TimeUnitParam>
  ): AsyncGenerator<SiteMeasurement, void, void> {
    const { timeUnit = TimeUnit.Day, dateRange } = options

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

    return this.api.getGenerator({
      apiPath: `/site/${siteId}/energy`,
      timeUnit,
      dateRange,
      interval: periodDuration,
      parser: SolaredgeClient.measurementsParser,
    })
  }

  // Return an async generator for the site power measurements in 15 minutes resolution (in watts).
  getSitePowerGenerator(
    siteId: string,
    options: DateTimeRangeParam
  ): AsyncGenerator<SiteMeasurement, void, void> {
    // Usage limitation: This API is limited to one-month period. This means that the period between endTime and startTime
    // should not exceed one month. If the period is longer, the system will generate error 403 with proper description.
    const periodDuration: Duration = { months: 1 }

    return this.api.getGenerator({
      ...options,
      apiPath: `/site/${siteId}/power`,
      interval: periodDuration,
      parser: SolaredgeClient.measurementsParser,
    })
  }

  // Retrieves the current power flow between all elements of the site including PV array, storage (battery), loads
  // (consumption) and grid.
  // Note: Applies when export, import, and consumption can be measured.
  async fetchSiteCurrentPowerFlow(siteId: string): Promise<unknown> {
    // TODO: Write return interface
    return this.api.call(`/site/${siteId}/currentPowerFlow`)
  }

  // Get detailed storage information from batteries: the state of energy, power and lifetime energy.
  // Note: Applicable to systems with batteries.
  async fetchSiteStorageData(siteId: string): Promise<unknown> {
    // TODO: Write return interface
    return this.api.call(`/site/${siteId}/storageData`)
  }

  async fetchSiteEnvironmentalBenefits(
    siteId: string,
    metricUnits?: boolean
  ): Promise<SiteEnvironmentalBenefits> {
    const params: { systemUnits?: string } = {}
    if (metricUnits ?? false) {
      params.systemUnits = metricUnits ? 'Metric' : 'Imperial'
    }
    return this.api.call<SiteEnvironmentalBenefits>(
      `/site/${siteId}/envBenefits`,
      params
    )
  }

  async fetchSiteEquipmentList(siteId: string): Promise<SiteEquipmentList> {
    return this.api.call(`/equipment/${siteId}/list`)
  }

  async fetchSiteEquipmentChangeLog(
    siteId: string,
    equipmentId: string
  ): Promise<EquipmentChange[]> {
    return (
      await this.api.call<EquipmentChangeLog>(
        `/equipment/${siteId}/${equipmentId}/changeLog`
      )
    ).list
  }

  getInverterTelemetryGenerator(
    siteId: string,
    inverterId: string,
    options: DateTimeRangeParam
  ): AsyncGenerator<InverterTelemetry, void, void> {
    // Usage limitation: This API is limited to a one week period.
    const interval: Duration = { months: 1 }
    return this.api.getGenerator<InverterTelemetry>({
      ...options,
      interval,
      apiPath: `/equipment/${siteId}/${inverterId}/data`,
      parser: (data: InverterData) => data.telemetries,
    })
  }

  // ***************************************************************************
  //    EQUIPMENT-RELATED METHODS
  // ***************************************************************************

  private static measurementsParser({
    values,
    ...metadata
  }: SiteMeasurements): SiteMeasurement[] {
    return values.map((measurement) => ({ ...metadata, ...measurement }))
  }
}
