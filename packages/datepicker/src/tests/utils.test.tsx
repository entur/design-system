import {
  parseAbsolute,
  parseDate,
  parseDateTime,
  parseTime,
} from '@internationalized/date';
import {
  nativeDateToDateValue,
  nativeDateToTimeValue,
  timeOrDateValueToNativeDate,
} from '../shared';

// Locale is added on all tests to ensure a static testing basis
// Time zone is set globally for Jest as UTC in ~/jest.global.setup.js

test('Timezones should always be UTC', () => {
  expect(new Date().getTimezoneOffset()).toBe(0);
});

test('Util function correctly converts JS Date to Date- and TimeValues', () => {
  const dateObject = new Date(1997, 6, 10, 10, 0);
  const timeZone = 'America/Los_Angeles';
  const fourHoursExampleOffset = -14400000;

  const dateWithTimeZoneAndOffset = nativeDateToDateValue(
    dateObject,
    false,
    timeZone,
    fourHoursExampleOffset,
  );
  const dateWithTimeZoneOnly = nativeDateToDateValue(
    dateObject,
    false,
    timeZone,
  );
  const withTimeOnly = nativeDateToTimeValue(dateObject, true);
  const withDateOnly = nativeDateToDateValue(dateObject, true);
  const dateWithoutTimeZone = nativeDateToDateValue(dateObject);

  expect(dateWithTimeZoneAndOffset?.toString()).toEqual(
    '1997-07-10T10:00:00-04:00[America/Los_Angeles]',
  );
  expect(dateWithTimeZoneOnly?.toString()).toEqual(
    '1997-07-10T03:00:00-07:00[America/Los_Angeles]',
  );
  expect(withTimeOnly?.toString()).toEqual('10:00:00');
  expect(withDateOnly?.toString()).toEqual('1997-07-10');
  expect(dateWithoutTimeZone?.toString()).toEqual('1997-07-10T10:00:00');
});

test('util function correctly converts from any Date or TimeValue to JS Date', () => {
  const dateString = '1997-07-10';
  const timeString = '10:00:00';
  const timeZone = 'America/Los_Angeles';

  const zonedDateTime = parseAbsolute(`${dateString}T${timeString}Z`, timeZone);
  const calendarDateTime = parseDateTime(
    `${dateString}T${timeString.substring(0, 5)}`,
  );
  const time = parseTime(timeString.substring(0, 5));
  const calendarDate = parseDate(dateString);
  const nullValue = null;

  expect(timeOrDateValueToNativeDate(zonedDateTime)?.toISOString()).toEqual(
    '1997-07-10T10:00:00.000Z',
  );
  expect(timeOrDateValueToNativeDate(calendarDateTime)?.toISOString()).toEqual(
    '1997-07-10T10:00:00.000Z',
  );
  expect(
    timeOrDateValueToNativeDate(calendarDateTime, timeZone)?.toISOString(),
  ).toEqual('1997-07-10T17:00:00.000Z');
  expect(
    timeOrDateValueToNativeDate(time)?.toLocaleTimeString('no-NO'),
  ).toEqual('10:00:00');
  expect(timeOrDateValueToNativeDate(calendarDate)?.toISOString()).toEqual(
    '1997-07-10T00:00:00.000Z',
  );
  expect(timeOrDateValueToNativeDate(nullValue)).toEqual(nullValue);

  // timeZone should not impact result for ZonedDateTime and Time
  expect(
    timeOrDateValueToNativeDate(zonedDateTime, timeZone)?.toISOString(),
  ).toEqual('1997-07-10T10:00:00.000Z');
  expect(
    timeOrDateValueToNativeDate(time, timeZone)?.toLocaleTimeString('no-NO'),
  ).toEqual('10:00:00');
  expect(
    timeOrDateValueToNativeDate(calendarDate, timeZone)?.toLocaleDateString(
      'no-NO',
    ),
  ).toEqual('10.7.1997');
  expect(timeOrDateValueToNativeDate(nullValue, timeZone)).toEqual(nullValue);
});

test('util function converts from Date to TimeValue and back again correctly', () => {
  const dateObject = new Date(1997, 6, 10, 10, 0);
  const timeZone = 'America/Los_Angeles';

  expect(
    timeOrDateValueToNativeDate(
      nativeDateToDateValue(dateObject, false, timeZone),
    ),
  ).toEqual(dateObject);
  expect(
    timeOrDateValueToNativeDate(nativeDateToDateValue(dateObject)),
  ).toEqual(dateObject);
  expect(
    timeOrDateValueToNativeDate(
      nativeDateToTimeValue(dateObject, true),
    )?.toLocaleTimeString('no-NO'),
  ).toEqual(dateObject.toLocaleTimeString('no-NO'));
});
