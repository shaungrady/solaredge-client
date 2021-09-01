import Api from '../api/api.class'
import {
	ApiCallGenerator,
	ApiResponse,
	DateRange,
	DateTimeRange,
	TimeUnit,
	TimeUnitParam,
} from '../api/api.types'
import {
	AccountSites,
	EquipmentChangeLog,
	InverterData,
	InverterTelemetry,
	SiteComponentsList,
	SiteDataPeriod,
	SiteDetails,
	SiteEnvironmentalBenefits,
	SiteInventory,
	SiteMeasurement,
	SiteMeasurements,
	SitesParams,
	SolaredgeClientOptions,
} from './client.types'

export default class Client {
	static readonly isValidApiKey = Api.isValidApiKey

	private readonly api: Api

	constructor({ apiKey, apiOrigin }: SolaredgeClientOptions) {
		this.api = new Api(apiKey, { origin: apiOrigin })
	}

	// ***************************************************************************
	//    ACCOUNT-RELATED METHODS
	// ***************************************************************************

	/**
	 * Returns a list of sites related to the given token, which is the account api key.
	 * This API accepts parameters for convenient search, sort and pagination.
	 */
	async siteList(params: SitesParams = {}): Promise<ApiResponse<AccountSites>> {
		return this.api.call<AccountSites>('/sites/list', { params })
	}

	// ***************************************************************************
	//    SITE-RELATED METHODS
	// ***************************************************************************

	async siteDetails(
		siteId: string | number
	): Promise<ApiResponse<SiteDetails>> {
		return this.api.call<SiteDetails>(`/site/${siteId}/details`)
	}

	/**
	 * Return the energy production start and end dates of the site.
	 */
	async siteDataPeriod(
		siteId: string | number
	): Promise<ApiResponse<SiteDataPeriod>> {
		return this.api.call<SiteDataPeriod>(`/site/${siteId}/dataPeriod`)
	}

	// Return an async generator for the site energy measurements (in watt-hours).
	// Default timeUnit: `TimeUnit.Day`
	siteEnergy(
		siteId: string | number,
		options: DateRange & Partial<TimeUnitParam>
	): ApiCallGenerator<SiteMeasurement> {
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

		return this.api.callGenerator({
			apiPath: `/site/${siteId}/energy`,
			timeUnit,
			dateRange,
			interval: periodDuration,
			parser: Client.measurementsResponseParser,
		})
	}

	// Return an async generator for the site power measurements in 15 minutes resolution (in watts).
	sitePower(
		siteId: string | number,
		options: DateTimeRange
	): ApiCallGenerator<SiteMeasurement> {
		// Usage limitation: This API is limited to one-month period. This means that the period between endTime and startTime
		// should not exceed one month. If the period is longer, the system will generate error 403 with proper description.
		const periodDuration: Duration = { months: 1 }

		return this.api.callGenerator({
			...options,
			apiPath: `/site/${siteId}/power`,
			interval: periodDuration,
			parser: Client.measurementsResponseParser,
		})
	}

	// Retrieves the current power flow between all elements of the site including PV array, storage (battery), loads
	// (consumption) and grid.
	// Note: Applies when export, import, and consumption can be measured.
	async siteCurrentPowerFlow(
		siteId: string | number
	): Promise<ApiResponse<unknown>> {
		// TODO: Write return interface
		return this.api.call(`/site/${siteId}/currentPowerFlow`)
	}

	// Get detailed storage information from batteries: the state of energy, power and lifetime energy.
	// Note: Applicable to systems with batteries.
	async siteStorageData(
		siteId: string | number
	): Promise<ApiResponse<unknown>> {
		// TODO: Write return interface
		return this.api.call(`/site/${siteId}/storageData`)
	}

	async siteEnvironmentalBenefits(
		siteId: string | number,
		metricUnits = false
	): Promise<ApiResponse<SiteEnvironmentalBenefits>> {
		const params = {
			systemUnits: metricUnits ? 'Metric' : 'Imperial',
		}
		return this.api.call<SiteEnvironmentalBenefits>(
			`/site/${siteId}/envBenefits`,
			{ params }
		)
	}

	async siteComponentsList(
		siteId: string | number
	): Promise<ApiResponse<SiteComponentsList>> {
		return this.api.call(`/equipment/${siteId}/list`)
	}

	async siteInventory(
		siteId: string | number
	): Promise<ApiResponse<SiteInventory>> {
		return this.api.call(`/equipment/${siteId}/list`)
	}

	async siteEquipmentChangeLog(
		siteId: string | number,
		equipmentId: string
	): Promise<ApiResponse<EquipmentChangeLog>> {
		return this.api.call<EquipmentChangeLog>(
			`/equipment/${siteId}/${equipmentId}/changeLog`
		)
	}

	inverterTechnicalData(
		siteId: string | number,
		inverterId: string,
		options: DateTimeRange
	): ApiCallGenerator<InverterTelemetry> {
		// Usage limitation: This API is limited to a one week period.
		const interval: Duration = { months: 1 }
		return this.api.callGenerator<InverterTelemetry>({
			...options,
			interval,
			apiPath: `/equipment/${siteId}/${inverterId}/data`,
			parser: (data: InverterData) => data.telemetries,
		})
	}

	// ***************************************************************************
	//    EQUIPMENT-RELATED METHODS
	// ***************************************************************************

	private static measurementsResponseParser({
		values,
		...metadata
	}: SiteMeasurements): SiteMeasurement[] {
		return values.map((measurement) => ({ ...metadata, ...measurement }))
	}
}
