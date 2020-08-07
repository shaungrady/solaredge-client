import { SiteStatus, SortOrder, TimeUnit } from '../api/api.types';
export interface SolaredgeClientOptions {
    apiKey: string;
    apiOrigin?: string;
}
export interface SitesParams {
    /**
     * The maximum number of sites returned by this call. The
     * maximum number of sites that can be returned by this
     * call is 100. If you have more than 100 sites, just request
     * another 100 sites with startIndex=100. This will fetch sites
     * 100-199.
     */
    size?: number;
    /** The first site index to be returned in the results */
    startIndex?: number;
    searchText?: string;
    /** A sorting option for this site list, based on one of its properties. */
    sortProperty?: SiteSortProperty;
    sortOrder?: SortOrder;
    status?: SiteStatus;
}
export interface AccountSites {
    count: number;
    site: SiteDetails[];
}
export declare const enum SiteSortProperty {
    Name = "Name",
    Country = "Country",
    State = "State",
    City = "City",
    Address = "Address",
    Zip = "Zip",
    Status = "Status",
    PeakPower = "PeakPower",
    InstallationDate = "InstallationDate",
    Amount = "Amount",
    MaxSeverity = "MaxSeverity",
    CreationTime = "CreationTime"
}
export interface SiteDetails {
    id: number;
    name: string;
    accountId: number;
    status: string;
    peakPower: number;
    lastUpdateTime: string | null;
    installationDate: string | null;
    ptoDate: string | null;
    notes: string;
    type: string;
    location: {
        country: string;
        state: string;
        city: string;
        address: string;
        address2: string;
        zip: string;
        timeZone: string;
    };
    alertQuantity: number;
    alertSeverity: string;
    uris: {
        PUBLIC_URL: string;
        IMAGE_URI: string;
    };
    publicSettings: {
        name: string;
        isPublic: boolean;
    };
}
export interface SiteDataPeriod {
    startDate: string | null;
    endDate: string | null;
}
export interface SiteMeasurements {
    timeUnit: TimeUnit;
    unit: string;
    measuredBy: string;
    values: SiteMeasurementValue[];
}
interface SiteMeasurementValue {
    date: string;
    value: number | null;
}
export declare type SiteMeasurement = Omit<SiteMeasurements, 'values'> & SiteMeasurementValue;
export interface SiteEnvironmentalBenefits {
    gasEmissionSaved: {
        units: string;
        co2: number;
        so2: number;
        nox: number;
    };
    treesPlanted: number;
    lightBulbs: number;
}
export interface SiteEquipmentList {
    count: number;
    list: EquipmentDetails[];
}
export interface EquipmentDetails {
    name: string;
    manufacturer: string;
    model: string;
    serialNumber: string;
}
export interface InverterData {
    count: number;
    telemetries: InverterTelemetry[];
}
export interface InverterTelemetry {
    date: string;
    totalActivePower: number;
    dcVoltage: number;
    groundFaultResistance: number;
    powerLimit: number;
    totalEnergy: number;
    temperature: number;
    inverterMode: string;
    L1Data: {
        acCurrent: number;
        acVoltage: number;
        acFrequency: number;
        apparentPower: number;
        activePower: number;
        reactivePower: number;
        cosPhi: number;
    };
}
export interface EquipmentChangeLog {
    count: number;
    list: EquipmentChange[];
}
export interface EquipmentChange {
    serialNumber: string;
    partNumber: string;
    date: string;
}
export {};
