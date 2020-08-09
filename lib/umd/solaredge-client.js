/* solaredge-client@1.0.0 (ISC) — https://github.com/shaungrady/solaredge-client */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.SolaredgeClient = {}));
}(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }

    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    }

    function toInteger(dirtyNumber) {
      if (dirtyNumber === null || dirtyNumber === true || dirtyNumber === false) {
        return NaN;
      }

      var number = Number(dirtyNumber);

      if (isNaN(number)) {
        return number;
      }

      return number < 0 ? Math.ceil(number) : Math.floor(number);
    }

    function requiredArgs(required, args) {
      if (args.length < required) {
        throw new TypeError(required + ' argument' + (required > 1 ? 's' : '') + ' required, but only ' + args.length + ' present');
      }
    }

    /**
     * @name toDate
     * @category Common Helpers
     * @summary Convert the given argument to an instance of Date.
     *
     * @description
     * Convert the given argument to an instance of Date.
     *
     * If the argument is an instance of Date, the function returns its clone.
     *
     * If the argument is a number, it is treated as a timestamp.
     *
     * If the argument is none of the above, the function returns Invalid Date.
     *
     * **Note**: *all* Date arguments passed to any *date-fns* function is processed by `toDate`.
     *
     * @param {Date|Number} argument - the value to convert
     * @returns {Date} the parsed date in the local time zone
     * @throws {TypeError} 1 argument required
     *
     * @example
     * // Clone the date:
     * const result = toDate(new Date(2014, 1, 11, 11, 30, 30))
     * //=> Tue Feb 11 2014 11:30:30
     *
     * @example
     * // Convert the timestamp to date:
     * const result = toDate(1392098430000)
     * //=> Tue Feb 11 2014 11:30:30
     */

    function toDate(argument) {
      requiredArgs(1, arguments);
      var argStr = Object.prototype.toString.call(argument); // Clone the date

      if (argument instanceof Date || typeof argument === 'object' && argStr === '[object Date]') {
        // Prevent the date to lose the milliseconds when passed to new Date() in IE10
        return new Date(argument.getTime());
      } else if (typeof argument === 'number' || argStr === '[object Number]') {
        return new Date(argument);
      } else {
        if ((typeof argument === 'string' || argStr === '[object String]') && typeof console !== 'undefined') {
          // eslint-disable-next-line no-console
          console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as arguments. Please use `parseISO` to parse strings. See: https://git.io/fjule"); // eslint-disable-next-line no-console

          console.warn(new Error().stack);
        }

        return new Date(NaN);
      }
    }

    /**
     * @name addDays
     * @category Day Helpers
     * @summary Add the specified number of days to the given date.
     *
     * @description
     * Add the specified number of days to the given date.
     *
     * ### v2.0.0 breaking changes:
     *
     * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
     *
     * @param {Date|Number} date - the date to be changed
     * @param {Number} amount - the amount of days to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
     * @returns {Date} the new date with the days added
     * @throws {TypeError} 2 arguments required
     *
     * @example
     * // Add 10 days to 1 September 2014:
     * var result = addDays(new Date(2014, 8, 1), 10)
     * //=> Thu Sep 11 2014 00:00:00
     */

    function addDays(dirtyDate, dirtyAmount) {
      requiredArgs(2, arguments);
      var date = toDate(dirtyDate);
      var amount = toInteger(dirtyAmount);

      if (isNaN(amount)) {
        return new Date(NaN);
      }

      if (!amount) {
        // If 0 days, no-op to avoid changing times in the hour before end of DST
        return date;
      }

      date.setDate(date.getDate() + amount);
      return date;
    }

    /**
     * @name addMonths
     * @category Month Helpers
     * @summary Add the specified number of months to the given date.
     *
     * @description
     * Add the specified number of months to the given date.
     *
     * ### v2.0.0 breaking changes:
     *
     * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
     *
     * @param {Date|Number} date - the date to be changed
     * @param {Number} amount - the amount of months to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
     * @returns {Date} the new date with the months added
     * @throws {TypeError} 2 arguments required
     *
     * @example
     * // Add 5 months to 1 September 2014:
     * var result = addMonths(new Date(2014, 8, 1), 5)
     * //=> Sun Feb 01 2015 00:00:00
     */

    function addMonths(dirtyDate, dirtyAmount) {
      requiredArgs(2, arguments);
      var date = toDate(dirtyDate);
      var amount = toInteger(dirtyAmount);

      if (isNaN(amount)) {
        return new Date(NaN);
      }

      if (!amount) {
        // If 0 months, no-op to avoid changing times in the hour before end of DST
        return date;
      }

      var dayOfMonth = date.getDate(); // The JS Date object supports date math by accepting out-of-bounds values for
      // month, day, etc. For example, new Date(2020, 1, 0) returns 31 Dec 2019 and
      // new Date(2020, 13, 1) returns 1 Feb 2021.  This is *almost* the behavior we
      // want except that dates will wrap around the end of a month, meaning that
      // new Date(2020, 13, 31) will return 3 Mar 2021 not 28 Feb 2021 as desired. So
      // we'll default to the end of the desired month by adding 1 to the desired
      // month and using a date of 0 to back up one day to the end of the desired
      // month.

      var endOfDesiredMonth = new Date(date.getTime());
      endOfDesiredMonth.setMonth(date.getMonth() + amount + 1, 0);
      var daysInMonth = endOfDesiredMonth.getDate();

      if (dayOfMonth >= daysInMonth) {
        // If we're already at the end of the month, then this is the correct date
        // and we're done.
        return endOfDesiredMonth;
      } else {
        // Otherwise, we now know that setting the original day-of-month value won't
        // cause an overflow, so set the desired day-of-month. Note that we can't
        // just set the date of `endOfDesiredMonth` because that object may have had
        // its time changed in the unusual case where where a DST transition was on
        // the last day of the month and its local time was in the hour skipped or
        // repeated next to a DST transition.  So we use `date` instead which is
        // guaranteed to still have the original time.
        date.setFullYear(endOfDesiredMonth.getFullYear(), endOfDesiredMonth.getMonth(), dayOfMonth);
        return date;
      }
    }

    /**
     * @name add
     * @category Common Helpers
     * @summary Add the specified years, months, weeks, days, hours, minutes and seconds to the given date.
     *
     * @description
     * Add the specified years, months, weeks, days, hours, minutes and seconds to the given date.
     *
     * @param {Date|Number} date - the date to be changed
     * @param {Duration} duration - the object with years, months, weeks, days, hours, minutes and seconds to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
     *
     * | Key            | Description                        |
     * |----------------|------------------------------------|
     * | years          | Amount of years to be added        |
     * | months         | Amount of months to be added       |
     * | weeks          | Amount of weeks to be added       |
     * | days           | Amount of days to be added         |
     * | hours          | Amount of hours to be added        |
     * | minutes        | Amount of minutes to be added      |
     * | seconds        | Amount of seconds to be added      |
     *
     * All values default to 0
     *
     * @returns {Date} the new date with the seconds added
     * @throws {TypeError} 2 arguments required
     *
     * @example
     * // Add the following duration to 1 September 2014, 10:19:50
     * var result = add(new Date(2014, 8, 1, 10, 19, 50), {
     *   years: 2,
     *   months: 9,
     *   weeks: 1,
     *   days: 7,
     *   hours: 5,
     *   minutes: 9,
     *   seconds: 30,
     * })
     * //=> Thu Jun 15 2017 15:29:20
     */

    function add(dirtyDate, duration) {
      requiredArgs(2, arguments);
      if (!duration || typeof duration !== 'object') return new Date(NaN);
      var years = 'years' in duration ? toInteger(duration.years) : 0;
      var months = 'months' in duration ? toInteger(duration.months) : 0;
      var weeks = 'weeks' in duration ? toInteger(duration.weeks) : 0;
      var days = 'days' in duration ? toInteger(duration.days) : 0;
      var hours = 'hours' in duration ? toInteger(duration.hours) : 0;
      var minutes = 'minutes' in duration ? toInteger(duration.minutes) : 0;
      var seconds = 'seconds' in duration ? toInteger(duration.seconds) : 0; // Add years and months

      var date = toDate(dirtyDate);
      var dateWithMonths = months || years ? addMonths(date, months + years * 12) : date; // Add weeks and days

      var dateWithDays = days || weeks ? addDays(dateWithMonths, days + weeks * 7) : dateWithMonths; // Add days, hours, minutes and seconds

      var minutesToAdd = minutes + hours * 60;
      var secondsToAdd = seconds + minutesToAdd * 60;
      var msToAdd = secondsToAdd * 1000;
      var finalDate = new Date(dateWithDays.getTime() + msToAdd);
      return finalDate;
    }

    /**
     * @name addMilliseconds
     * @category Millisecond Helpers
     * @summary Add the specified number of milliseconds to the given date.
     *
     * @description
     * Add the specified number of milliseconds to the given date.
     *
     * ### v2.0.0 breaking changes:
     *
     * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
     *
     * @param {Date|Number} date - the date to be changed
     * @param {Number} amount - the amount of milliseconds to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
     * @returns {Date} the new date with the milliseconds added
     * @throws {TypeError} 2 arguments required
     *
     * @example
     * // Add 750 milliseconds to 10 July 2014 12:45:30.000:
     * var result = addMilliseconds(new Date(2014, 6, 10, 12, 45, 30, 0), 750)
     * //=> Thu Jul 10 2014 12:45:30.750
     */

    function addMilliseconds(dirtyDate, dirtyAmount) {
      requiredArgs(2, arguments);
      var timestamp = toDate(dirtyDate).getTime();
      var amount = toInteger(dirtyAmount);
      return new Date(timestamp + amount);
    }

    var MILLISECONDS_IN_MINUTE = 60000;

    function getDateMillisecondsPart(date) {
      return date.getTime() % MILLISECONDS_IN_MINUTE;
    }
    /**
     * Google Chrome as of 67.0.3396.87 introduced timezones with offset that includes seconds.
     * They usually appear for dates that denote time before the timezones were introduced
     * (e.g. for 'Europe/Prague' timezone the offset is GMT+00:57:44 before 1 October 1891
     * and GMT+01:00:00 after that date)
     *
     * Date#getTimezoneOffset returns the offset in minutes and would return 57 for the example above,
     * which would lead to incorrect calculations.
     *
     * This function returns the timezone offset in milliseconds that takes seconds in account.
     */


    function getTimezoneOffsetInMilliseconds(dirtyDate) {
      var date = new Date(dirtyDate.getTime());
      var baseTimezoneOffset = Math.ceil(date.getTimezoneOffset());
      date.setSeconds(0, 0);
      var hasNegativeUTCOffset = baseTimezoneOffset > 0;
      var millisecondsPartOfTimezoneOffset = hasNegativeUTCOffset ? (MILLISECONDS_IN_MINUTE + getDateMillisecondsPart(date)) % MILLISECONDS_IN_MINUTE : getDateMillisecondsPart(date);
      return baseTimezoneOffset * MILLISECONDS_IN_MINUTE + millisecondsPartOfTimezoneOffset;
    }

    /**
     * @name isValid
     * @category Common Helpers
     * @summary Is the given date valid?
     *
     * @description
     * Returns false if argument is Invalid Date and true otherwise.
     * Argument is converted to Date using `toDate`. See [toDate]{@link https://date-fns.org/docs/toDate}
     * Invalid Date is a Date, whose time value is NaN.
     *
     * Time value of Date: http://es5.github.io/#x15.9.1.1
     *
     * ### v2.0.0 breaking changes:
     *
     * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
     *
     * - Now `isValid` doesn't throw an exception
     *   if the first argument is not an instance of Date.
     *   Instead, argument is converted beforehand using `toDate`.
     *
     *   Examples:
     *
     *   | `isValid` argument        | Before v2.0.0 | v2.0.0 onward |
     *   |---------------------------|---------------|---------------|
     *   | `new Date()`              | `true`        | `true`        |
     *   | `new Date('2016-01-01')`  | `true`        | `true`        |
     *   | `new Date('')`            | `false`       | `false`       |
     *   | `new Date(1488370835081)` | `true`        | `true`        |
     *   | `new Date(NaN)`           | `false`       | `false`       |
     *   | `'2016-01-01'`            | `TypeError`   | `false`       |
     *   | `''`                      | `TypeError`   | `false`       |
     *   | `1488370835081`           | `TypeError`   | `true`        |
     *   | `NaN`                     | `TypeError`   | `false`       |
     *
     *   We introduce this change to make *date-fns* consistent with ECMAScript behavior
     *   that try to coerce arguments to the expected type
     *   (which is also the case with other *date-fns* functions).
     *
     * @param {*} date - the date to check
     * @returns {Boolean} the date is valid
     * @throws {TypeError} 1 argument required
     *
     * @example
     * // For the valid date:
     * var result = isValid(new Date(2014, 1, 31))
     * //=> true
     *
     * @example
     * // For the value, convertable into a date:
     * var result = isValid(1393804800000)
     * //=> true
     *
     * @example
     * // For the invalid date:
     * var result = isValid(new Date(''))
     * //=> false
     */

    function isValid(dirtyDate) {
      requiredArgs(1, arguments);
      var date = toDate(dirtyDate);
      return !isNaN(date);
    }

    /**
     * @name subMilliseconds
     * @category Millisecond Helpers
     * @summary Subtract the specified number of milliseconds from the given date.
     *
     * @description
     * Subtract the specified number of milliseconds from the given date.
     *
     * ### v2.0.0 breaking changes:
     *
     * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
     *
     * @param {Date|Number} date - the date to be changed
     * @param {Number} amount - the amount of milliseconds to be subtracted. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
     * @returns {Date} the new date with the milliseconds subtracted
     * @throws {TypeError} 2 arguments required
     *
     * @example
     * // Subtract 750 milliseconds from 10 July 2014 12:45:30.000:
     * var result = subMilliseconds(new Date(2014, 6, 10, 12, 45, 30, 0), 750)
     * //=> Thu Jul 10 2014 12:45:29.250
     */

    function subMilliseconds(dirtyDate, dirtyAmount) {
      requiredArgs(2, arguments);
      var amount = toInteger(dirtyAmount);
      return addMilliseconds(dirtyDate, -amount);
    }

    function addLeadingZeros(number, targetLength) {
      var sign = number < 0 ? '-' : '';
      var output = Math.abs(number).toString();

      while (output.length < targetLength) {
        output = '0' + output;
      }

      return sign + output;
    }

    /*
     * |     | Unit                           |     | Unit                           |
     * |-----|--------------------------------|-----|--------------------------------|
     * |  a  | AM, PM                         |  A* |                                |
     * |  d  | Day of month                   |  D  |                                |
     * |  h  | Hour [1-12]                    |  H  | Hour [0-23]                    |
     * |  m  | Minute                         |  M  | Month                          |
     * |  s  | Second                         |  S  | Fraction of second             |
     * |  y  | Year (abs)                     |  Y  |                                |
     *
     * Letters marked by * are not implemented but reserved by Unicode standard.
     */

    var formatters = {
      // Year
      y: function (date, token) {
        // From http://www.unicode.org/reports/tr35/tr35-31/tr35-dates.html#Date_Format_tokens
        // | Year     |     y | yy |   yyy |  yyyy | yyyyy |
        // |----------|-------|----|-------|-------|-------|
        // | AD 1     |     1 | 01 |   001 |  0001 | 00001 |
        // | AD 12    |    12 | 12 |   012 |  0012 | 00012 |
        // | AD 123   |   123 | 23 |   123 |  0123 | 00123 |
        // | AD 1234  |  1234 | 34 |  1234 |  1234 | 01234 |
        // | AD 12345 | 12345 | 45 | 12345 | 12345 | 12345 |
        var signedYear = date.getUTCFullYear(); // Returns 1 for 1 BC (which is year 0 in JavaScript)

        var year = signedYear > 0 ? signedYear : 1 - signedYear;
        return addLeadingZeros(token === 'yy' ? year % 100 : year, token.length);
      },
      // Month
      M: function (date, token) {
        var month = date.getUTCMonth();
        return token === 'M' ? String(month + 1) : addLeadingZeros(month + 1, 2);
      },
      // Day of the month
      d: function (date, token) {
        return addLeadingZeros(date.getUTCDate(), token.length);
      },
      // AM or PM
      a: function (date, token) {
        var dayPeriodEnumValue = date.getUTCHours() / 12 >= 1 ? 'pm' : 'am';

        switch (token) {
          case 'a':
          case 'aa':
          case 'aaa':
            return dayPeriodEnumValue.toUpperCase();

          case 'aaaaa':
            return dayPeriodEnumValue[0];

          case 'aaaa':
          default:
            return dayPeriodEnumValue === 'am' ? 'a.m.' : 'p.m.';
        }
      },
      // Hour [1-12]
      h: function (date, token) {
        return addLeadingZeros(date.getUTCHours() % 12 || 12, token.length);
      },
      // Hour [0-23]
      H: function (date, token) {
        return addLeadingZeros(date.getUTCHours(), token.length);
      },
      // Minute
      m: function (date, token) {
        return addLeadingZeros(date.getUTCMinutes(), token.length);
      },
      // Second
      s: function (date, token) {
        return addLeadingZeros(date.getUTCSeconds(), token.length);
      },
      // Fraction of second
      S: function (date, token) {
        var numberOfDigits = token.length;
        var milliseconds = date.getUTCMilliseconds();
        var fractionalSeconds = Math.floor(milliseconds * Math.pow(10, numberOfDigits - 3));
        return addLeadingZeros(fractionalSeconds, token.length);
      }
    };

    /**
     * @name isBefore
     * @category Common Helpers
     * @summary Is the first date before the second one?
     *
     * @description
     * Is the first date before the second one?
     *
     * ### v2.0.0 breaking changes:
     *
     * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
     *
     * @param {Date|Number} date - the date that should be before the other one to return true
     * @param {Date|Number} dateToCompare - the date to compare with
     * @returns {Boolean} the first date is before the second date
     * @throws {TypeError} 2 arguments required
     *
     * @example
     * // Is 10 July 1989 before 11 February 1987?
     * var result = isBefore(new Date(1989, 6, 10), new Date(1987, 1, 11))
     * //=> false
     */

    function isBefore(dirtyDate, dirtyDateToCompare) {
      requiredArgs(2, arguments);
      var date = toDate(dirtyDate);
      var dateToCompare = toDate(dirtyDateToCompare);
      return date.getTime() < dateToCompare.getTime();
    }

    // - (\w)\1* matches any sequences of the same letter
    // - '' matches two quote characters in a row
    // - '(''|[^'])+('|$) matches anything surrounded by two quote characters ('),
    //   except a single quote symbol, which ends the sequence.
    //   Two quote characters do not end the sequence.
    //   If there is no matching single quote
    //   then the sequence will continue until the end of the string.
    // - . matches any single character unmatched by previous parts of the RegExps

    var formattingTokensRegExp = /(\w)\1*|''|'(''|[^'])+('|$)|./g;
    var escapedStringRegExp = /^'([^]*?)'?$/;
    var doubleQuoteRegExp = /''/g;
    var unescapedLatinCharacterRegExp = /[a-zA-Z]/;
    /**
     * @name lightFormat
     * @category Common Helpers
     * @summary Format the date.
     *
     * @description
     * Return the formatted date string in the given format. Unlike `format`,
     * `lightFormat` doesn't use locales and outputs date using the most popular tokens.
     *
     * > ⚠️ Please note that the `lightFormat` tokens differ from Moment.js and other libraries.
     * > See: https://git.io/fxCyr
     *
     * The characters wrapped between two single quotes characters (') are escaped.
     * Two single quotes in a row, whether inside or outside a quoted sequence, represent a 'real' single quote.
     *
     * Format of the string is based on Unicode Technical Standard #35:
     * https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
     *
     * Accepted patterns:
     * | Unit                            | Pattern | Result examples                   |
     * |---------------------------------|---------|-----------------------------------|
     * | AM, PM                          | a..aaa  | AM, PM                            |
     * |                                 | aaaa    | a.m., p.m.                        |
     * |                                 | aaaaa   | a, p                              |
     * | Calendar year                   | y       | 44, 1, 1900, 2017                 |
     * |                                 | yy      | 44, 01, 00, 17                    |
     * |                                 | yyy     | 044, 001, 000, 017                |
     * |                                 | yyyy    | 0044, 0001, 1900, 2017            |
     * | Month (formatting)              | M       | 1, 2, ..., 12                     |
     * |                                 | MM      | 01, 02, ..., 12                   |
     * | Day of month                    | d       | 1, 2, ..., 31                     |
     * |                                 | dd      | 01, 02, ..., 31                   |
     * | Hour [1-12]                     | h       | 1, 2, ..., 11, 12                 |
     * |                                 | hh      | 01, 02, ..., 11, 12               |
     * | Hour [0-23]                     | H       | 0, 1, 2, ..., 23                  |
     * |                                 | HH      | 00, 01, 02, ..., 23               |
     * | Minute                          | m       | 0, 1, ..., 59                     |
     * |                                 | mm      | 00, 01, ..., 59                   |
     * | Second                          | s       | 0, 1, ..., 59                     |
     * |                                 | ss      | 00, 01, ..., 59                   |
     * | Fraction of second              | S       | 0, 1, ..., 9                      |
     * |                                 | SS      | 00, 01, ..., 99                   |
     * |                                 | SSS     | 000, 0001, ..., 999               |
     * |                                 | SSSS    | ...                               |
     *
     * @param {Date|Number} date - the original date
     * @param {String} format - the string of tokens
     * @returns {String} the formatted date string
     * @throws {TypeError} 2 arguments required
     * @throws {RangeError} format string contains an unescaped latin alphabet character
     *
     * @example
     * var result = lightFormat(new Date(2014, 1, 11), 'yyyy-MM-dd')
     * //=> '1987-02-11'
     */

    function lightFormat(dirtyDate, dirtyFormatStr) {
      requiredArgs(2, arguments);
      var formatStr = String(dirtyFormatStr);
      var originalDate = toDate(dirtyDate);

      if (!isValid(originalDate)) {
        throw new RangeError('Invalid time value');
      } // Convert the date in system timezone to the same date in UTC+00:00 timezone.
      // This ensures that when UTC functions will be implemented, locales will be compatible with them.
      // See an issue about UTC functions: https://github.com/date-fns/date-fns/issues/376


      var timezoneOffset = getTimezoneOffsetInMilliseconds(originalDate);
      var utcDate = subMilliseconds(originalDate, timezoneOffset);
      var result = formatStr.match(formattingTokensRegExp).map(function (substring) {
        // Replace two single quote characters with one single quote character
        if (substring === "''") {
          return "'";
        }

        var firstCharacter = substring[0];

        if (firstCharacter === "'") {
          return cleanEscapedString(substring);
        }

        var formatter = formatters[firstCharacter];

        if (formatter) {
          return formatter(utcDate, substring, null, {});
        }

        if (firstCharacter.match(unescapedLatinCharacterRegExp)) {
          throw new RangeError('Format string contains an unescaped latin alphabet character `' + firstCharacter + '`');
        }

        return substring;
      }).join('');
      return result;
    }

    function cleanEscapedString(input) {
      return input.match(escapedStringRegExp)[1].replace(doubleQuoteRegExp, "'");
    }

    /**
     * @name min
     * @category Common Helpers
     * @summary Return the earliest of the given dates.
     *
     * @description
     * Return the earliest of the given dates.
     *
     * ### v2.0.0 breaking changes:
     *
     * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
     *
     * - `min` function now accepts an array of dates rather than spread arguments.
     *
     *   ```javascript
     *   // Before v2.0.0
     *   var date1 = new Date(1989, 6, 10)
     *   var date2 = new Date(1987, 1, 11)
     *   var minDate = min(date1, date2)
     *
     *   // v2.0.0 onward:
     *   var dates = [new Date(1989, 6, 10), new Date(1987, 1, 11)]
     *   var minDate = min(dates)
     *   ```
     *
     * @param {Date[]|Number[]} datesArray - the dates to compare
     * @returns {Date} the earliest of the dates
     * @throws {TypeError} 1 argument required
     *
     * @example
     * // Which of these dates is the earliest?
     * var result = min([
     *   new Date(1989, 6, 10),
     *   new Date(1987, 1, 11),
     *   new Date(1995, 6, 2),
     *   new Date(1990, 0, 1)
     * ])
     * //=> Wed Feb 11 1987 00:00:00
     */

    function min(dirtyDatesArray) {
      requiredArgs(1, arguments);
      var datesArray; // `dirtyDatesArray` is Array, Set or Map, or object with custom `forEach` method

      if (dirtyDatesArray && typeof dirtyDatesArray.forEach === 'function') {
        datesArray = dirtyDatesArray; // If `dirtyDatesArray` is Array-like Object, convert to Array.
      } else if (typeof dirtyDatesArray === 'object' && dirtyDatesArray !== null) {
        datesArray = Array.prototype.slice.call(dirtyDatesArray);
      } else {
        // `dirtyDatesArray` is non-iterable, return Invalid Date
        return new Date(NaN);
      }

      var result;
      datesArray.forEach(function (dirtyDate) {
        var currentDate = toDate(dirtyDate);

        if (result === undefined || result > currentDate || isNaN(currentDate)) {
          result = currentDate;
        }
      });
      return result || new Date(NaN);
    }

    function createCommonjsModule(fn, basedir, module) {
    	return module = {
    	  path: basedir,
    	  exports: {},
    	  require: function (path, base) {
          return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
        }
    	}, fn(module, module.exports), module.exports;
    }

    function commonjsRequire () {
    	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
    }

    var strictUriEncode = str => encodeURIComponent(str).replace(/[!'()*]/g, x => `%${x.charCodeAt(0).toString(16).toUpperCase()}`);

    var token = '%[a-f0-9]{2}';
    var singleMatcher = new RegExp(token, 'gi');
    var multiMatcher = new RegExp('(' + token + ')+', 'gi');

    function decodeComponents(components, split) {
    	try {
    		// Try to decode the entire string first
    		return decodeURIComponent(components.join(''));
    	} catch (err) {
    		// Do nothing
    	}

    	if (components.length === 1) {
    		return components;
    	}

    	split = split || 1;

    	// Split the array in 2 parts
    	var left = components.slice(0, split);
    	var right = components.slice(split);

    	return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
    }

    function decode(input) {
    	try {
    		return decodeURIComponent(input);
    	} catch (err) {
    		var tokens = input.match(singleMatcher);

    		for (var i = 1; i < tokens.length; i++) {
    			input = decodeComponents(tokens, i).join('');

    			tokens = input.match(singleMatcher);
    		}

    		return input;
    	}
    }

    function customDecodeURIComponent(input) {
    	// Keep track of all the replacements and prefill the map with the `BOM`
    	var replaceMap = {
    		'%FE%FF': '\uFFFD\uFFFD',
    		'%FF%FE': '\uFFFD\uFFFD'
    	};

    	var match = multiMatcher.exec(input);
    	while (match) {
    		try {
    			// Decode as big chunks as possible
    			replaceMap[match[0]] = decodeURIComponent(match[0]);
    		} catch (err) {
    			var result = decode(match[0]);

    			if (result !== match[0]) {
    				replaceMap[match[0]] = result;
    			}
    		}

    		match = multiMatcher.exec(input);
    	}

    	// Add `%C2` at the end of the map to make sure it does not replace the combinator before everything else
    	replaceMap['%C2'] = '\uFFFD';

    	var entries = Object.keys(replaceMap);

    	for (var i = 0; i < entries.length; i++) {
    		// Replace all decoded components
    		var key = entries[i];
    		input = input.replace(new RegExp(key, 'g'), replaceMap[key]);
    	}

    	return input;
    }

    var decodeUriComponent = function (encodedURI) {
    	if (typeof encodedURI !== 'string') {
    		throw new TypeError('Expected `encodedURI` to be of type `string`, got `' + typeof encodedURI + '`');
    	}

    	try {
    		encodedURI = encodedURI.replace(/\+/g, ' ');

    		// Try the built in decoder first
    		return decodeURIComponent(encodedURI);
    	} catch (err) {
    		// Fallback to a more advanced decoder
    		return customDecodeURIComponent(encodedURI);
    	}
    };

    var splitOnFirst = (string, separator) => {
    	if (!(typeof string === 'string' && typeof separator === 'string')) {
    		throw new TypeError('Expected the arguments to be of type `string`');
    	}

    	if (separator === '') {
    		return [string];
    	}

    	const separatorIndex = string.indexOf(separator);

    	if (separatorIndex === -1) {
    		return [string];
    	}

    	return [
    		string.slice(0, separatorIndex),
    		string.slice(separatorIndex + separator.length)
    	];
    };

    var queryString = createCommonjsModule(function (module, exports) {




    const isNullOrUndefined = value => value === null || value === undefined;

    function encoderForArrayFormat(options) {
    	switch (options.arrayFormat) {
    		case 'index':
    			return key => (result, value) => {
    				const index = result.length;

    				if (
    					value === undefined ||
    					(options.skipNull && value === null) ||
    					(options.skipEmptyString && value === '')
    				) {
    					return result;
    				}

    				if (value === null) {
    					return [...result, [encode(key, options), '[', index, ']'].join('')];
    				}

    				return [
    					...result,
    					[encode(key, options), '[', encode(index, options), ']=', encode(value, options)].join('')
    				];
    			};

    		case 'bracket':
    			return key => (result, value) => {
    				if (
    					value === undefined ||
    					(options.skipNull && value === null) ||
    					(options.skipEmptyString && value === '')
    				) {
    					return result;
    				}

    				if (value === null) {
    					return [...result, [encode(key, options), '[]'].join('')];
    				}

    				return [...result, [encode(key, options), '[]=', encode(value, options)].join('')];
    			};

    		case 'comma':
    		case 'separator':
    			return key => (result, value) => {
    				if (value === null || value === undefined || value.length === 0) {
    					return result;
    				}

    				if (result.length === 0) {
    					return [[encode(key, options), '=', encode(value, options)].join('')];
    				}

    				return [[result, encode(value, options)].join(options.arrayFormatSeparator)];
    			};

    		default:
    			return key => (result, value) => {
    				if (
    					value === undefined ||
    					(options.skipNull && value === null) ||
    					(options.skipEmptyString && value === '')
    				) {
    					return result;
    				}

    				if (value === null) {
    					return [...result, encode(key, options)];
    				}

    				return [...result, [encode(key, options), '=', encode(value, options)].join('')];
    			};
    	}
    }

    function parserForArrayFormat(options) {
    	let result;

    	switch (options.arrayFormat) {
    		case 'index':
    			return (key, value, accumulator) => {
    				result = /\[(\d*)\]$/.exec(key);

    				key = key.replace(/\[\d*\]$/, '');

    				if (!result) {
    					accumulator[key] = value;
    					return;
    				}

    				if (accumulator[key] === undefined) {
    					accumulator[key] = {};
    				}

    				accumulator[key][result[1]] = value;
    			};

    		case 'bracket':
    			return (key, value, accumulator) => {
    				result = /(\[\])$/.exec(key);
    				key = key.replace(/\[\]$/, '');

    				if (!result) {
    					accumulator[key] = value;
    					return;
    				}

    				if (accumulator[key] === undefined) {
    					accumulator[key] = [value];
    					return;
    				}

    				accumulator[key] = [].concat(accumulator[key], value);
    			};

    		case 'comma':
    		case 'separator':
    			return (key, value, accumulator) => {
    				const isArray = typeof value === 'string' && value.split('').indexOf(options.arrayFormatSeparator) > -1;
    				const newValue = isArray ? value.split(options.arrayFormatSeparator).map(item => decode(item, options)) : value === null ? value : decode(value, options);
    				accumulator[key] = newValue;
    			};

    		default:
    			return (key, value, accumulator) => {
    				if (accumulator[key] === undefined) {
    					accumulator[key] = value;
    					return;
    				}

    				accumulator[key] = [].concat(accumulator[key], value);
    			};
    	}
    }

    function validateArrayFormatSeparator(value) {
    	if (typeof value !== 'string' || value.length !== 1) {
    		throw new TypeError('arrayFormatSeparator must be single character string');
    	}
    }

    function encode(value, options) {
    	if (options.encode) {
    		return options.strict ? strictUriEncode(value) : encodeURIComponent(value);
    	}

    	return value;
    }

    function decode(value, options) {
    	if (options.decode) {
    		return decodeUriComponent(value);
    	}

    	return value;
    }

    function keysSorter(input) {
    	if (Array.isArray(input)) {
    		return input.sort();
    	}

    	if (typeof input === 'object') {
    		return keysSorter(Object.keys(input))
    			.sort((a, b) => Number(a) - Number(b))
    			.map(key => input[key]);
    	}

    	return input;
    }

    function removeHash(input) {
    	const hashStart = input.indexOf('#');
    	if (hashStart !== -1) {
    		input = input.slice(0, hashStart);
    	}

    	return input;
    }

    function getHash(url) {
    	let hash = '';
    	const hashStart = url.indexOf('#');
    	if (hashStart !== -1) {
    		hash = url.slice(hashStart);
    	}

    	return hash;
    }

    function extract(input) {
    	input = removeHash(input);
    	const queryStart = input.indexOf('?');
    	if (queryStart === -1) {
    		return '';
    	}

    	return input.slice(queryStart + 1);
    }

    function parseValue(value, options) {
    	if (options.parseNumbers && !Number.isNaN(Number(value)) && (typeof value === 'string' && value.trim() !== '')) {
    		value = Number(value);
    	} else if (options.parseBooleans && value !== null && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {
    		value = value.toLowerCase() === 'true';
    	}

    	return value;
    }

    function parse(input, options) {
    	options = Object.assign({
    		decode: true,
    		sort: true,
    		arrayFormat: 'none',
    		arrayFormatSeparator: ',',
    		parseNumbers: false,
    		parseBooleans: false
    	}, options);

    	validateArrayFormatSeparator(options.arrayFormatSeparator);

    	const formatter = parserForArrayFormat(options);

    	// Create an object with no prototype
    	const ret = Object.create(null);

    	if (typeof input !== 'string') {
    		return ret;
    	}

    	input = input.trim().replace(/^[?#&]/, '');

    	if (!input) {
    		return ret;
    	}

    	for (const param of input.split('&')) {
    		let [key, value] = splitOnFirst(options.decode ? param.replace(/\+/g, ' ') : param, '=');

    		// Missing `=` should be `null`:
    		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
    		value = value === undefined ? null : ['comma', 'separator'].includes(options.arrayFormat) ? value : decode(value, options);
    		formatter(decode(key, options), value, ret);
    	}

    	for (const key of Object.keys(ret)) {
    		const value = ret[key];
    		if (typeof value === 'object' && value !== null) {
    			for (const k of Object.keys(value)) {
    				value[k] = parseValue(value[k], options);
    			}
    		} else {
    			ret[key] = parseValue(value, options);
    		}
    	}

    	if (options.sort === false) {
    		return ret;
    	}

    	return (options.sort === true ? Object.keys(ret).sort() : Object.keys(ret).sort(options.sort)).reduce((result, key) => {
    		const value = ret[key];
    		if (Boolean(value) && typeof value === 'object' && !Array.isArray(value)) {
    			// Sort object keys, not values
    			result[key] = keysSorter(value);
    		} else {
    			result[key] = value;
    		}

    		return result;
    	}, Object.create(null));
    }

    exports.extract = extract;
    exports.parse = parse;

    exports.stringify = (object, options) => {
    	if (!object) {
    		return '';
    	}

    	options = Object.assign({
    		encode: true,
    		strict: true,
    		arrayFormat: 'none',
    		arrayFormatSeparator: ','
    	}, options);

    	validateArrayFormatSeparator(options.arrayFormatSeparator);

    	const shouldFilter = key => (
    		(options.skipNull && isNullOrUndefined(object[key])) ||
    		(options.skipEmptyString && object[key] === '')
    	);

    	const formatter = encoderForArrayFormat(options);

    	const objectCopy = {};

    	for (const key of Object.keys(object)) {
    		if (!shouldFilter(key)) {
    			objectCopy[key] = object[key];
    		}
    	}

    	const keys = Object.keys(objectCopy);

    	if (options.sort !== false) {
    		keys.sort(options.sort);
    	}

    	return keys.map(key => {
    		const value = object[key];

    		if (value === undefined) {
    			return '';
    		}

    		if (value === null) {
    			return encode(key, options);
    		}

    		if (Array.isArray(value)) {
    			return value
    				.reduce(formatter(key), [])
    				.join('&');
    		}

    		return encode(key, options) + '=' + encode(value, options);
    	}).filter(x => x.length > 0).join('&');
    };

    exports.parseUrl = (input, options) => {
    	options = Object.assign({
    		decode: true
    	}, options);

    	const [url, hash] = splitOnFirst(input, '#');

    	return Object.assign(
    		{
    			url: url.split('?')[0] || '',
    			query: parse(extract(input), options)
    		},
    		options && options.parseFragmentIdentifier && hash ? {fragmentIdentifier: decode(hash, options)} : {}
    	);
    };

    exports.stringifyUrl = (input, options) => {
    	options = Object.assign({
    		encode: true,
    		strict: true
    	}, options);

    	const url = removeHash(input.url).split('?')[0] || '';
    	const queryFromUrl = exports.extract(input.url);
    	const parsedQueryFromUrl = exports.parse(queryFromUrl, {sort: false});

    	const query = Object.assign(parsedQueryFromUrl, input.query);
    	let queryString = exports.stringify(query, options);
    	if (queryString) {
    		queryString = `?${queryString}`;
    	}

    	let hash = getHash(input.url);
    	if (input.fragmentIdentifier) {
    		hash = `#${encode(input.fragmentIdentifier, options)}`;
    	}

    	return `${url}${queryString}${hash}`;
    };
    });

    function compareDates(a, b) {
        return Number(a) - Number(b);
    }

    (function (RangeType) {
        RangeType[RangeType["Date"] = 0] = "Date";
        RangeType[RangeType["DateTime"] = 1] = "DateTime";
    })(exports.RangeType || (exports.RangeType = {}));

    var Api = /** @class */ (function () {
        function Api(key, config) {
            if (config === void 0) { config = {}; }
            this.key = key;
            if (!Api.isValidApiKey(key)) {
                throw Error("Invalid API key; must be a 32-character uppercase alphanumeric string." /* invalidApiKey */);
            }
            this.config = Object.freeze(__assign({ origin: Api.defaultOrigin }, config));
        }
        Api.isValidApiKey = function (key) {
            return /^[A-Z0-9]{32}$/.test(key);
        };
        Api.serializeDate = function (date) {
            return lightFormat(date, Api.dateFormat);
        };
        Api.serializeDateTime = function (date) {
            return lightFormat(date, Api.dateTimeFormat);
        };
        Api.parseDateOrTimeRange = function (config) {
            var _a, _b;
            var type;
            var start;
            var end;
            if ('dateRange' in config) {
                _a = config.dateRange.slice().sort(compareDates), start = _a[0], end = _a[1];
                type = exports.RangeType.Date;
            }
            else {
                _b = config.timeRange.slice().sort(compareDates), start = _b[0], end = _b[1];
                type = exports.RangeType.DateTime;
            }
            return { type: type, start: start, end: end };
        };
        Api.serializeRange = function (_a) {
            var type = _a.type, start = _a.start, end = _a.end;
            return type === exports.RangeType.Date
                ? {
                    startDate: Api.serializeDate(start),
                    endDate: Api.serializeDate(end),
                }
                : {
                    startTime: Api.serializeDateTime(start),
                    endTime: Api.serializeDateTime(end),
                };
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Api.prototype.call = function (path, options) {
            if (options === void 0) { options = {}; }
            return __awaiter(this, void 0, void 0, function () {
                var _a, key, config, callConfig, headers, params, url, res, body, bodyValues;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = this, key = _a.key, config = _a.config;
                            callConfig = __assign({ params: {} }, options);
                            headers = { Accept: 'application/json' };
                            params = queryString.stringify(__assign(__assign({}, callConfig.params), { api_key: key }));
                            url = "" + config.origin + path + "?" + params;
                            return [4 /*yield*/, fetch(url, { headers: headers })];
                        case 1:
                            res = _b.sent();
                            return [4 /*yield*/, res.json()
                                // Solaredge nests response data under a key that changes depending on the
                                // request endpoint; this removes that nesting for ease of use.
                            ];
                        case 2:
                            body = _b.sent();
                            bodyValues = Object.values(body);
                            return [2 /*return*/, bodyValues.length === 1 ? bodyValues[0] : body];
                    }
                });
            });
        };
        Api.prototype.callGenerator = function (config) {
            return __asyncGenerator(this, arguments, function callGenerator_1() {
                var apiPath, interval, parser, call, generatorReturnData, timeUnit, range, periodStart, periodEnd, timeUnitParam, rangeParams, callData, collection, _i, collection_1, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            apiPath = config.apiPath, interval = config.interval, parser = config.parser;
                            call = this.call.bind(this);
                            generatorReturnData = {
                                config: config,
                                apiCallTotal: 0,
                                recordTotal: 0,
                            };
                            timeUnit = 'timeUnit' in config && config.timeUnit;
                            range = Api.parseDateOrTimeRange(config);
                            periodStart = range.start;
                            _a.label = 1;
                        case 1:
                            if (!isBefore(periodStart, range.end)) return [3 /*break*/, 8];
                            periodEnd = min([range.end, add(periodStart, interval)]);
                            timeUnitParam = timeUnit ? { timeUnit: timeUnit } : {};
                            rangeParams = Api.serializeRange({
                                type: range.type,
                                start: periodStart,
                                end: periodEnd,
                            });
                            return [4 /*yield*/, __await(call(apiPath, {
                                    params: __assign(__assign({}, rangeParams), timeUnitParam),
                                }))];
                        case 2:
                            callData = _a.sent();
                            collection = parser(callData);
                            _i = 0, collection_1 = collection;
                            _a.label = 3;
                        case 3:
                            if (!(_i < collection_1.length)) return [3 /*break*/, 7];
                            data = collection_1[_i];
                            generatorReturnData.recordTotal += 1;
                            return [4 /*yield*/, __await(data)];
                        case 4: return [4 /*yield*/, _a.sent()];
                        case 5:
                            _a.sent();
                            _a.label = 6;
                        case 6:
                            _i++;
                            return [3 /*break*/, 3];
                        case 7:
                            generatorReturnData.apiCallTotal += 1;
                            periodStart = periodEnd;
                            return [3 /*break*/, 1];
                        case 8: return [4 /*yield*/, __await(generatorReturnData)];
                        case 9: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        Api.defaultOrigin = 'https://monitoringapi.solaredge.com';
        Api.dateFormat = 'yyyy-MM-dd';
        Api.dateTimeFormat = 'yyyy-MM-dd HH:mm:ss';
        return Api;
    }());

    var Client = /** @class */ (function () {
        function Client(_a) {
            var apiKey = _a.apiKey, apiOrigin = _a.apiOrigin;
            this.api = new Api(apiKey, { origin: apiOrigin });
        }
        // ***************************************************************************
        //    ACCOUNT-RELATED METHODS
        // ***************************************************************************
        /**
         * Returns a list of sites related to the given token, which is the account api key.
         * This API accepts parameters for convenient search, sort and pagination.
         */
        Client.prototype.fetchSiteList = function (params) {
            if (params === void 0) { params = {}; }
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.api.call('/sites/list', { params: params })];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, data.site];
                    }
                });
            });
        };
        // ***************************************************************************
        //    SITE-RELATED METHODS
        // ***************************************************************************
        Client.prototype.fetchSiteDetails = function (siteId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.api.call("/site/" + siteId + "/details")];
                });
            });
        };
        /**
         * Return the energy production start and end dates of the site.
         */
        Client.prototype.fetchSiteDataPeriod = function (siteId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.api.call("/site/" + siteId + "/dataPeriod")];
                });
            });
        };
        // Return an async generator for the site energy measurements (in watt-hours).
        // Default timeUnit: `TimeUnit.Day`
        Client.prototype.fetchSiteEnergyGenerator = function (siteId, options) {
            var _a = options.timeUnit, timeUnit = _a === void 0 ? "DAY" /* Day */ : _a, dateRange = options.dateRange;
            // Usage limitation: This API is limited to one year when using timeUnit=DAY (i.e., daily resolution) and to one month when
            // using timeUnit=QUARTER_OF_AN_HOUR or timeUnit=HOUR. This means that the period between endTime and startTime
            // should not exceed one year or one month respectively. If the period is longer, the system will generate error 403 with
            // proper description.
            var periodDuration;
            switch (timeUnit) {
                case "QUARTER_OF_AN_HOUR" /* QuarterHour */:
                case "HOUR" /* Hour */:
                    periodDuration = { months: 1 };
                    break;
                default:
                    periodDuration = { years: 1 };
            }
            return this.api.callGenerator({
                apiPath: "/site/" + siteId + "/energy",
                timeUnit: timeUnit,
                dateRange: dateRange,
                interval: periodDuration,
                parser: Client.measurementsResponseParser,
            });
        };
        // Return an async generator for the site power measurements in 15 minutes resolution (in watts).
        Client.prototype.fetchSitePowerGenerator = function (siteId, options) {
            // Usage limitation: This API is limited to one-month period. This means that the period between endTime and startTime
            // should not exceed one month. If the period is longer, the system will generate error 403 with proper description.
            var periodDuration = { months: 1 };
            return this.api.callGenerator(__assign(__assign({}, options), { apiPath: "/site/" + siteId + "/power", interval: periodDuration, parser: Client.measurementsResponseParser }));
        };
        // Retrieves the current power flow between all elements of the site including PV array, storage (battery), loads
        // (consumption) and grid.
        // Note: Applies when export, import, and consumption can be measured.
        Client.prototype.fetchSiteCurrentPowerFlow = function (siteId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // TODO: Write return interface
                    return [2 /*return*/, this.api.call("/site/" + siteId + "/currentPowerFlow")];
                });
            });
        };
        // Get detailed storage information from batteries: the state of energy, power and lifetime energy.
        // Note: Applicable to systems with batteries.
        Client.prototype.fetchSiteStorageData = function (siteId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // TODO: Write return interface
                    return [2 /*return*/, this.api.call("/site/" + siteId + "/storageData")];
                });
            });
        };
        Client.prototype.fetchSiteEnvironmentalBenefits = function (siteId, metricUnits) {
            if (metricUnits === void 0) { metricUnits = false; }
            return __awaiter(this, void 0, void 0, function () {
                var params;
                return __generator(this, function (_a) {
                    params = {
                        systemUnits: metricUnits ? 'Metric' : 'Imperial',
                    };
                    return [2 /*return*/, this.api.call("/site/" + siteId + "/envBenefits", { params: params })];
                });
            });
        };
        Client.prototype.fetchSiteEquipmentList = function (siteId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.api.call("/equipment/" + siteId + "/list")];
                });
            });
        };
        Client.prototype.fetchSiteEquipmentChangeLog = function (siteId, equipmentId) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.api.call("/equipment/" + siteId + "/" + equipmentId + "/changeLog")];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, data.list];
                    }
                });
            });
        };
        Client.prototype.fetchInverterTelemetryGenerator = function (siteId, inverterId, options) {
            // Usage limitation: This API is limited to a one week period.
            var interval = { months: 1 };
            return this.api.callGenerator(__assign(__assign({}, options), { interval: interval, apiPath: "/equipment/" + siteId + "/" + inverterId + "/data", parser: function (data) { return data.telemetries; } }));
        };
        // ***************************************************************************
        //    EQUIPMENT-RELATED METHODS
        // ***************************************************************************
        Client.measurementsResponseParser = function (_a) {
            var values = _a.values, metadata = __rest(_a, ["values"]);
            return values.map(function (measurement) { return (__assign(__assign({}, metadata), measurement)); });
        };
        return Client;
    }());

    exports.SolaredgeClient = Client;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=solaredge-client.js.map
