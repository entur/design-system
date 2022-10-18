import {
  ZonedDateTime,
  CalendarDateTime,
  Time,
  parseAbsolute,
} from '@internationalized/date';
import { TimeValue } from '@react-types/datepicker';
import { Calendar, GregorianCalendar } from '@internationalized/date';

/**
 * Tar inn et JS Date-objekt og returnerer et av TimeValue-objektene fra @internationalized/date-pakken
 * @param {Date} date JS Date-objekt som ønskes konvertert til et TimeValue-objekt
 * @param {boolean} noDateOnlyTime Hvis datoen er irrelevant kan denne settes til true, da får man et Time-objekt uten dato tilbake
 * @param {string} timeZone Tidssonen på IANA-formatet som tidpunktet skal konverteres til. Utelates denne får man et tidspunkt uten tidssone. Kan brukes med og uten en UTC-offset Vær obs på annen oppførsel med offset, les mer på beskrivelsen av offset
 * @param {number} offset UTC-offset i millisekunder, må brukes med en tidssone. Ved å legge på en offset lager du en variant av en tidssone. Det betyr at tidspunktet ikke endres (time, minutt, sekund uendret), men tidssonen, med tilhørende offset, tidspunktet er i endres.
 * @returns {Time | CalendarDateTime | ZonedDateTime} et av TimeValue-objektene med verdier fra date
 */
export const nativeDateToTimeValue = (
  date: Date,
  noDateOnlyTime = false,
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
  if (noDateOnlyTime)
    return new Time(date.getHours(), date.getMinutes(), date.getSeconds(), 0);
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
 * Tar inn et av TimeValue-objektene fra @internationalized/date-pakken og returnerer et JS Date-objekt
 * @param {TimeValue} time Et tidspunkt på TimeValue-formatet som ønsket konvertert til et JS Date-objekt
 * @param {string} timeZoneForCalendarDateTime Tidssonen time er i. Fungerer kun med typen er CalendarDateTime
 * @returns {Date} et Date-objekt med verdier fra time
 */
// This function uses a lot of @ts-expect-error to make it work with all TimeValue types. Sorry ...
export const timeValueToNativeDate = (
  time: TimeValue,
  timeZoneForCalendarDateTime?: string,
): Date => {
  // @ts-expect-error .day does not exist on Time-object
  if (!time.day) {
    // type is Time
    const date = new Date();
    date.setHours(time.hour);
    date.setMinutes(time.minute);
    date.setSeconds(time.second);
    return date;
  }

  // @ts-expect-error .timeZone does not exist in type Time and CalendarDateTime
  if (!time.timeZone) {
    // type is CalendarDateTime
    if (timeZoneForCalendarDateTime)
      // @ts-expect-error .toDate(timeZone) does not exist in type Time
      return time.toDate(timeZoneForCalendarDateTime);

    return new Date(
      // @ts-expect-error not in type Time
      time.year,
      // @ts-expect-error not in type Time
      time.month - 1,
      // @ts-expect-error not in type Time
      time.day,
      time.hour,
      time.minute,
      time.second,
    );
  }

  // @ts-expect-error .toDate() does not exist in type Time or CalendarDateTime
  return time.toDate();
};

export const createCalendar = (identifier: string): Calendar => {
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
  if (locale !== 'no-NO') return propsCollection['aria-label'];
  return norwegianAriaLabel;
};
