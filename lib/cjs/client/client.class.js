"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_class_1 = __importDefault(require("../api/api.class"));
class Client {
    constructor({ apiKey, apiOrigin }) {
        this.api = new api_class_1.default(apiKey, { origin: apiOrigin });
    }
    // ***************************************************************************
    //    ACCOUNT-RELATED METHODS
    // ***************************************************************************
    /**
     * Returns a list of sites related to the given token, which is the account api key.
     * This API accepts parameters for convenient search, sort and pagination.
     */
    fetchSiteList(params = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.api.call('/sites/list', { params });
            return data.site;
        });
    }
    // ***************************************************************************
    //    SITE-RELATED METHODS
    // ***************************************************************************
    fetchSiteDetails(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.api.call(`/site/${siteId}/details`);
        });
    }
    /**
     * Return the energy production start and end dates of the site.
     */
    fetchSiteDataPeriod(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.api.call(`/site/${siteId}/dataPeriod`);
        });
    }
    // Return an async generator for the site energy measurements (in watt-hours).
    // Default timeUnit: `TimeUnit.Day`
    fetchSiteEnergyGenerator(siteId, options) {
        const { timeUnit = "DAY" /* Day */, dateRange } = options;
        // Usage limitation: This API is limited to one year when using timeUnit=DAY (i.e., daily resolution) and to one month when
        // using timeUnit=QUARTER_OF_AN_HOUR or timeUnit=HOUR. This means that the period between endTime and startTime
        // should not exceed one year or one month respectively. If the period is longer, the system will generate error 403 with
        // proper description.
        let periodDuration;
        switch (timeUnit) {
            case "QUARTER_OF_AN_HOUR" /* QuarterHour */:
            case "HOUR" /* Hour */:
                periodDuration = { months: 1 };
                break;
            default:
                periodDuration = { years: 1 };
        }
        return this.api.callGenerator({
            apiPath: `/site/${siteId}/energy`,
            timeUnit,
            dateRange,
            interval: periodDuration,
            parser: Client.measurementsResponseParser,
        });
    }
    // Return an async generator for the site power measurements in 15 minutes resolution (in watts).
    fetchSitePowerGenerator(siteId, options) {
        // Usage limitation: This API is limited to one-month period. This means that the period between endTime and startTime
        // should not exceed one month. If the period is longer, the system will generate error 403 with proper description.
        const periodDuration = { months: 1 };
        return this.api.callGenerator(Object.assign(Object.assign({}, options), { apiPath: `/site/${siteId}/power`, interval: periodDuration, parser: Client.measurementsResponseParser }));
    }
    // Retrieves the current power flow between all elements of the site including PV array, storage (battery), loads
    // (consumption) and grid.
    // Note: Applies when export, import, and consumption can be measured.
    fetchSiteCurrentPowerFlow(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Write return interface
            return this.api.call(`/site/${siteId}/currentPowerFlow`);
        });
    }
    // Get detailed storage information from batteries: the state of energy, power and lifetime energy.
    // Note: Applicable to systems with batteries.
    fetchSiteStorageData(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Write return interface
            return this.api.call(`/site/${siteId}/storageData`);
        });
    }
    fetchSiteEnvironmentalBenefits(siteId, metricUnits = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                systemUnits: metricUnits ? 'Metric' : 'Imperial',
            };
            return this.api.call(`/site/${siteId}/envBenefits`, { params });
        });
    }
    fetchSiteEquipmentList(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.api.call(`/equipment/${siteId}/list`);
        });
    }
    fetchSiteEquipmentChangeLog(siteId, equipmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.api.call(`/equipment/${siteId}/${equipmentId}/changeLog`);
            return data.list;
        });
    }
    fetchInverterTelemetryGenerator(siteId, inverterId, options) {
        // Usage limitation: This API is limited to a one week period.
        const interval = { months: 1 };
        return this.api.callGenerator(Object.assign(Object.assign({}, options), { interval, apiPath: `/equipment/${siteId}/${inverterId}/data`, parser: (data) => data.telemetries }));
    }
    // ***************************************************************************
    //    EQUIPMENT-RELATED METHODS
    // ***************************************************************************
    static measurementsResponseParser(_a) {
        var { values } = _a, metadata = __rest(_a, ["values"]);
        return values.map((measurement) => (Object.assign(Object.assign({}, metadata), measurement)));
    }
}
exports.default = Client;
//# sourceMappingURL=client.class.js.map