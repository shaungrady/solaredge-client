var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
import { add, isBefore, lightFormat, min } from 'date-fns';
import queryString from 'query-string';
import compareDates from '../shared/compare-dates.fn';
import { RangeType, } from './api.types';
export default class Api {
    constructor(key, config = {}) {
        this.key = key;
        if (!Api.isValidApiKey(key)) {
            throw Error("Invalid API key; must be a 32-character uppercase alphanumeric string." /* invalidApiKey */);
        }
        this.config = Object.freeze(Object.assign({ origin: Api.defaultOrigin }, config));
    }
    static isValidApiKey(key) {
        return /^[A-Z0-9]{32}$/.test(key);
    }
    static serializeDate(date) {
        return lightFormat(date, Api.dateFormat);
    }
    static serializeDateTime(date) {
        return lightFormat(date, Api.dateTimeFormat);
    }
    static parseDateOrTimeRange(config) {
        let type;
        let start;
        let end;
        if ('dateRange' in config) {
            ;
            [start, end] = config.dateRange.slice().sort(compareDates);
            type = RangeType.Date;
        }
        else {
            ;
            [start, end] = config.timeRange.slice().sort(compareDates);
            type = RangeType.DateTime;
        }
        return { type, start, end };
    }
    static serializeRange({ type, start, end, }) {
        return type === RangeType.Date
            ? {
                startDate: Api.serializeDate(start),
                endDate: Api.serializeDate(end),
            }
            : {
                startTime: Api.serializeDateTime(start),
                endTime: Api.serializeDateTime(end),
            };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    call(path, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, config } = this;
            const callConfig = Object.assign({ params: {} }, options);
            const headers = { Accept: 'application/json' };
            const params = queryString.stringify(Object.assign(Object.assign({}, callConfig.params), { api_key: key }));
            const url = `${config.origin}${path}?${params}`;
            const res = yield fetch(url, { headers });
            const body = yield res.json();
            // Solaredge nests response data under a key that changes depending on the
            // request endpoint; this removes that nesting for ease of use.
            const bodyValues = Object.values(body);
            return bodyValues.length === 1 ? bodyValues[0] : body;
        });
    }
    callGenerator(config) {
        return __asyncGenerator(this, arguments, function* callGenerator_1() {
            const { apiPath, interval, parser } = config;
            const call = this.call.bind(this);
            const generatorReturnData = {
                config,
                apiCallTotal: 0,
                recordTotal: 0,
            };
            const timeUnit = 'timeUnit' in config && config.timeUnit;
            const range = Api.parseDateOrTimeRange(config);
            let periodStart = range.start;
            while (isBefore(periodStart, range.end)) {
                const periodEnd = min([range.end, add(periodStart, interval)]);
                const timeUnitParam = timeUnit ? { timeUnit } : {};
                const rangeParams = Api.serializeRange({
                    type: range.type,
                    start: periodStart,
                    end: periodEnd,
                });
                // Since the monitoring API limits the number of API calls in a given time
                // period, we won't call the API until it's needed.
                // eslint-disable-next-line no-await-in-loop
                const callData = yield __await(call(apiPath, {
                    params: Object.assign(Object.assign({}, rangeParams), timeUnitParam),
                }));
                const collection = parser(callData);
                for (const data of collection) {
                    generatorReturnData.recordTotal += 1;
                    yield yield __await(data);
                }
                generatorReturnData.apiCallTotal += 1;
                periodStart = periodEnd;
            }
            return yield __await(generatorReturnData);
        });
    }
}
Api.defaultOrigin = 'https://monitoringapi.solaredge.com';
Api.dateFormat = 'yyyy-MM-dd';
Api.dateTimeFormat = 'yyyy-MM-dd HH:mm:ss';
//# sourceMappingURL=api.class.js.map