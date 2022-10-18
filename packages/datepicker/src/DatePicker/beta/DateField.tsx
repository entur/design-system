import React, { useRef } from 'react';

import { useDateFieldState } from '@react-stately/datepicker';
import { useDateField } from '@react-aria/datepicker';
import { I18nProvider, useLocale } from '@react-aria/i18n';
import classNames from 'classnames';

import type {
  SpectrumDateFieldProps,
  DateValue,
} from '@react-types/datepicker';

import { BaseFormControl, VariantType } from '@entur/form';
import { mergeRefs, useRandomId } from '@entur/utils';

import { FieldSegment } from '../../shared/FieldSegment';
import { createCalendar } from '../../shared/utils';

import './DateField.scss';

export type DateFieldProps = {
  /** Den valgte tiden. Tid i '@internationalized/date'-pakkens format */
  selectedDate: DateValue | null;
  /** Kalles når tiden endres. Tid i '@internationalized/date'-pakkens format */
  onChange: (value: DateValue) => void;
  /** Label til TimePicker */
  label: string;
  /** BCP47-språkkoden til locale-en du ønsker å bruke.
   * @default Brukerenhetens selvvalgte locale
   */
  locale?: string;
  /** Viser den gjeldende tidssonen hvis en er valgt
   * @default false
   */
  showTimeZone?: boolean;
  showTime?: boolean;
  /** Varselmelding, som vil komme under TimePicker */
  feedback?: string;
  /** Valideringsvariant */
  variant?: VariantType;
  labelTooltip?: React.ReactNode;
  disabled?: boolean;
  /** Ekstra klassenavn */
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
} & Omit<
  SpectrumDateFieldProps<DateValue>,
  'onChange' | 'label' | 'hideTimeZone' | 'placeholder'
>;

export const DateField = React.forwardRef<HTMLDivElement, DateFieldProps>(
  (
    {
      selectedDate,
      onChange,
      label,
      locale: customLocale,
      showTimeZone,
      showTime,
      granularity = 'day',
      disabled,
      variant,
      feedback,
      labelTooltip,
      style,
      className,
      labelProps: labelDritt,
      append,
      ...rest
    },
    ref,
  ) => {
    let { locale } = useLocale();
    if (customLocale) locale = customLocale;

    const state = useDateFieldState({
      value: selectedDate === null ? undefined : selectedDate,
      onChange,
      locale,
      createCalendar: () => createCalendar('gregory'),
      hideTimeZone: !showTimeZone,
      granularity: showTime ? 'minute' : granularity,
      label: label,
      isDisabled: disabled,
      ...rest,
    });

    const dateFieldRef = useRef(null);
    const { labelProps, fieldProps } = useDateField(
      { ...rest, label: label },
      state,
      dateFieldRef,
    );

    const id = useRandomId('datefield');

    return (
      <I18nProvider locale={locale}>
        <div className="eds-datefield__wrapper">
          <BaseFormControl
            style={style}
            className={classNames('eds-datefield', className)}
            labelId={id}
            label={label}
            labelProps={{ ...labelDritt, ...labelProps }}
            ref={mergeRefs(dateFieldRef, ref)}
            disabled={disabled}
            disableLabelAnimation
            labelTooltip={labelTooltip}
            {...fieldProps}
            variant={variant}
            feedback={feedback}
            append={append}
          >
            {state.segments.map((segment, i) => (
              <FieldSegment segment={segment} state={state} key={i} />
            ))}
          </BaseFormControl>
        </div>
      </I18nProvider>
    );
  },
);
