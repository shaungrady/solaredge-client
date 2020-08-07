import { ApiCallGenerator, DateRange, DateTimeRange, TimeUnitParam } from '../api/api.types';
import { EquipmentChange, InverterTelemetry, SiteDataPeriod, SiteDetails, SiteEnvironmentalBenefits, SiteEquipmentList, SiteMeasurement, SitesParams, SolaredgeClientOptions } from './client.types';
export default class Client {
    private readonly api;
    constructor({ apiKey, apiOrigin }: SolaredgeClientOptions);
    /**
     * Returns a list of sites related to the given token, which is the account api key.
     * This API accepts parameters for convenient search, sort and pagination.
     */
    fetchSiteList(params?: SitesParams): Promise<SiteDetails[]>;
    fetchSiteDetails(siteId: string): Promise<SiteDetails>;
    /**
     * Return the energy production start and end dates of the site.
     */
    fetchSiteDataPeriod(siteId: string): Promise<SiteDataPeriod>;
    fetchSiteEnergyGenerator(siteId: string, options: DateRange & Partial<TimeUnitParam>): ApiCallGenerator<SiteMeasurement>;
    fetchSitePowerGenerator(siteId: string, options: DateTimeRange): ApiCallGenerator<SiteMeasurement>;
    fetchSiteCurrentPowerFlow(siteId: string): Promise<unknown>;
    fetchSiteStorageData(siteId: string): Promise<unknown>;
    fetchSiteEnvironmentalBenefits(siteId: string, metricUnits?: boolean): Promise<SiteEnvironmentalBenefits>;
    fetchSiteEquipmentList(siteId: string): Promise<SiteEquipmentList>;
    fetchSiteEquipmentChangeLog(siteId: string, equipmentId: string): Promise<EquipmentChange[]>;
    fetchInverterTelemetryGenerator(siteId: string, inverterId: string, options: DateTimeRange): ApiCallGenerator<InverterTelemetry>;
    private static measurementsResponseParser;
}
