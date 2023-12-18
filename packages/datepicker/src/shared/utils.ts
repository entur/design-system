import {
  ZonedDateTime,
  CalendarDateTime,
  Time,
  parseAbsolute,
  DateValue,
  getLocalTimeZone,
  CalendarDate,
  toCalendarDateTime,
  toCalendarDate,
  toZoned,
} from '@internationalized/date';
import { TimeValue } from '@react-types/datepicker';
import { Calendar, GregorianCalendar } from '@internationalized/date';

const nativeDateToDateTime = (
  date: Date,
  timeZone?: string,
  offset?: number,
) => {
  if (timeZone) {
    if (offset) {
      return new ZonedDateTime(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        timeZone,
        offset,
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
      );
    }
    return parseAbsolute(date.toISOString(), timeZone);
  }

  return new CalendarDateTime(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  );
};

/**
 * Tar inn et JS Date-objekt og returnerer et av DateValue-objektene fra @internationalized/date-pakken
 * @param {Date | null} date JS Date-objekt som ønskes konvertert til et DateValue-objekt
 * @param {boolean} noTimeOnlyDate Hvis tidspunktet er irrelevant kan denne settes til true, da får man et CalendarDate-objekt uten tidspunkt tilbake
 * @param {string} timeZone Tidssonen på IANA-formatet som tidpunktet skal konverteres til. Utelates denne får man et tidspunkt uten tidssone. Kan brukes med og uten en UTC-offset Vær obs på annen oppførsel med offset, les mer på beskrivelsen av offset
 * @param {number} offset UTC-offset i millisekunder, må brukes med en tidssone. Ved å legge på en offset lager du en variant av en tidssone. Det betyr at tidspunktet ikke endres (time, minutt, sekund uendret), men tidssonen, med tilhørende offset, tidspunktet er i endres.
 * @returns {CalendarDateTime | ZonedDateTime | CalendarDate | null} et av DateValue-objektene med verdier fra date eller null
 */
export function nativeDateToDateValue(
  date: Date | null,
  noTimeOnlyDate = false,
  timeZone?: string,
  offset?: number,
) {
  if (date === null) return null;

  if (noTimeOnlyDate)
    return new CalendarDate(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
    );

  return nativeDateToDateTime(date, timeZone, offset);
}

/**
 * Tar inn et JS Date-objekt og returnerer et av TimeValue-objektene fra @internationalized/date-pakken
 * @param {Date | null} date JS Date-objekt som ønskes konvertert til et TimeValue-objekt
 * @param {boolean} noDateOnlyTime Hvis datoen er irrelevant kan denne settes til true, da får man et Time-objekt uten dato tilbake
 * @param {string} timeZone Tidssonen på IANA-formatet som tidpunktet skal konverteres til. Utelates denne får man et tidspunkt uten tidssone. Kan brukes med og uten en UTC-offset Vær obs på annen oppførsel med offset, les mer på beskrivelsen av offset
 * @param {number} offset UTC-offset i millisekunder, må brukes med en tidssone. Ved å legge på en offset lager du en variant av en tidssone. Det betyr at tidspunktet ikke endres (time, minutt, sekund uendret), men tidssonen, med tilhørende offset, tidspunktet er i endres.
 * @returns {Time | CalendarDateTime | ZonedDateTime | null} et av TimeValue-objektene med verdier fra date eller null
 */
export function nativeDateToTimeValue(
  date: Date | null,
  noDateOnlyTime = false,
  timeZone?: string,
  offset?: number,
) {
  if (date === null) return null;

  if (noDateOnlyTime)
    return new Time(date.getHours(), date.getMinutes(), date.getSeconds(), 0);

  return nativeDateToDateTime(date, timeZone, offset);
}

/**
 * Tar inn et av Date- eller TimeValue-objektene fra \@internationalized/date-pakken og returnerer et JS Date-objekt
 * @param {DateValue | TimeValue | null} value En dato eller et tidspunkt på Date- eller TimeValue-formatet som ønskes konvertert til et JS Date-objekt
 * @param {string} timeZoneForCalendarDateTime Tidssonen value er i. Fungerer kun med typen er CalendarDateTime
 * @returns {Date | null} et Date-objekt med verdier fra time eller null
 */
export function timeOrDateValueToNativeDate(
  value: TimeValue | DateValue | null,
  timeZoneForCalendarDateTime?: string,
) {
  if (value === null) return null;

  // type is Time
  if (!('day' in value)) {
    const date = new Date();
    date.setHours(value.hour);
    date.setMinutes(value.minute);
    date.setSeconds(value.second);
    return date;
  }

  // type is CalendarDate
  if (!('hour' in value)) {
    return value.toDate(timeZoneForCalendarDateTime ?? getLocalTimeZone());
  }

  // type is CalendarDateTime
  if (!('timeZone' in value)) {
    if (timeZoneForCalendarDateTime)
      return value.toDate(timeZoneForCalendarDateTime);

    return new Date(
      value.year,
      value.month - 1,
      value.day,
      value.hour,
      value.minute,
      value.second,
    );
  }

  // type is ZonedDateTime
  return value.toDate();
}

export const createCalendar = (identifier = 'gregory'): Calendar => {
  switch (identifier) {
    case 'gregory':
      return new GregorianCalendar();
    default:
      throw new Error(`Unsupported calendar ${identifier}`);
  }
};

export const ariaLabelIfNorwegian = (
  norwegianAriaLabel: string,
  locale: string,
  propsCollection: any,
) => {
  if (locale.toLowerCase() !== 'no-no') return propsCollection['aria-label'];
  return norwegianAriaLabel;
};

export const lastMillisecondOfDay = (dateValue: DateValue) =>
  toCalendarDateTime(dateValue.add({ days: 1 })).add({
    milliseconds: -1,
  });

export const convertValueToType = ({
  value,
  type,
}: {
  value: DateValue | null;
  type: 'CalendarDate' | 'CalendarDateTime' | 'ZonedDateTime';
}) => {
  if (value === null) return null;
  switch (type) {
    case 'CalendarDate':
      return toCalendarDate(value);

    case 'CalendarDateTime':
      return toCalendarDateTime(value);

    case 'ZonedDateTime':
      return toZoned(value, 'Europe/Oslo');

    default:
      return value;
  }
};
