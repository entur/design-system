import {
  ZonedDateTime,
  CalendarDateTime,
  Time,
  parseAbsolute,
  DateValue,
  getLocalTimeZone,
  CalendarDate,
} from '@internationalized/date';
import { TimeValue } from '@react-types/datepicker';
import { Calendar, GregorianCalendar } from '@internationalized/date';

/**
 * Tar inn et JS Date-objekt og returnerer et av Date- eller TimeValue-objektene fra @internationalized/date-pakken
 * @param {Date} date JS Date-objekt som ønskes konvertert til et Date- eller TimeValue-objekt
 * @param {boolean} noDateOnlyTime Hvis datoen er irrelevant kan denne settes til true, da får man et Time-objekt uten dato tilbake
 * @param {boolean} noTimeOnlyDate Hvis tidspunktet er irrelevant kan denne settes til true, da får man et CalendarDate-objekt uten tidspunkt tilbake
 * @param {string} timeZone Tidssonen på IANA-formatet som tidpunktet skal konverteres til. Utelates denne får man et tidspunkt uten tidssone. Kan brukes med og uten en UTC-offset Vær obs på annen oppførsel med offset, les mer på beskrivelsen av offset
 * @param {number} offset UTC-offset i millisekunder, må brukes med en tidssone. Ved å legge på en offset lager du en variant av en tidssone. Det betyr at tidspunktet ikke endres (time, minutt, sekund uendret), men tidssonen, med tilhørende offset, tidspunktet er i endres.
 * @returns {Time | CalendarDateTime | ZonedDateTime | CalendarDate} et av TimeValue-objektene med verdier fra date
 */
export const nativeDateToTimeOrDateValue = (
  date: Date,
  noDateOnlyTime = false,
  noTimeOnlyDate = false,
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
  if (noTimeOnlyDate)
    return new CalendarDate(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
    );
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
 * Tar inn et av Date- eller TimeValue-objektene fra @internationalized/date-pakken og returnerer et JS Date-objekt
 * @param {DateValue | TimeValue} value En dato eller et tidspunkt på Date- eller TimeValue-formatet som ønskes konvertert til et JS Date-objekt
 * @param {string} timeZoneForCalendarDateTime Tidssonen value er i. Fungerer kun med typen er CalendarDateTime
 * @returns {Date} et Date-objekt med verdier fra time
 */
// This function uses a lot of @ts-expect-error to make it work with all TimeValue types. Sorry ...
export const timeOrDateValueToNativeDate = (
  value: TimeValue | DateValue,
  timeZoneForCalendarDateTime?: string,
): Date => {
  // @ts-expect-error .day does not exist on Time-object
  if (!value.day) {
    // type is Time
    const date = new Date();
    // @ts-expect-error hour does not exist on CalendarDate
    date.setHours(value.hour);
    // @ts-expect-error minute does not exist on CalendarDate
    date.setMinutes(value.minute);
    // @ts-expect-error second does not exist on CalendarDate
    date.setSeconds(value.second);
    return date;
  }

  // @ts-expect-error .day does not exist on Time-object
  if (!value.hour) {
    // type is CalendarDate
    // @ts-expect-error .toDate(timeZone) does not exist in type Time
    return value.toDate(timeZoneForCalendarDateTime ?? getLocalTimeZone());
  }

  // @ts-expect-error .timeZone does not exist in type Time and CalendarDateTime
  if (!value.timeZone) {
    // type is CalendarDateTime
    if (timeZoneForCalendarDateTime)
      // @ts-expect-error .toDate(timeZone) does not exist in type Time
      return value.toDate(timeZoneForCalendarDateTime);

    return new Date(
      // @ts-expect-error not in type Time
      value.year,
      // @ts-expect-error not in type Time
      value.month - 1,
      // @ts-expect-error not in type Time
      value.day,
      // @ts-expect-error not in type CalendarDate
      value.hour,
      // @ts-expect-error not in type CalendarDate
      value.minute,
      // @ts-expect-error not in type CalendarDate
      value.second,
    );
  }

  // @ts-expect-error .toDate() does not exist in type Time or CalendarDateTime
  return value.toDate();
};

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
