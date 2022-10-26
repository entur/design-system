import React, { ReactNode, useRef } from 'react';

import { useDateFieldState } from '@react-stately/datepicker';
import { useDateField } from '@react-aria/datepicker';
import { I18nProvider, useLocale } from '@react-aria/i18n';
import classNames from 'classnames';

import type {
  SpectrumDateFieldProps,
  DateValue,
} from '@react-types/datepicker';

import { BaseFormControl, VariantType } from '@entur/form';
import { ConditionalWrapper, mergeRefs, useRandomId } from '@entur/utils';

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
      selectedDate: value,
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
      labelProps: parentLabelProps,
      append,
      ...rest
    },
    ref,
  ) => {
    const { locale } = useLocale();

    const state = useDateFieldState({
      ...rest,
      locale: customLocale ?? locale,
      createCalendar: createCalendar,
      value: value === null ? undefined : value,
      hideTimeZone: !showTimeZone,
      granularity: showTime ? 'minute' : granularity,
    });

    const dateFieldRef = useRef(null);
    const { labelProps, fieldProps } = useDateField(
      { ...rest, label: label, isDisabled: disabled || rest.isDisabled },
      state,
      dateFieldRef,
    );

    const id = useRandomId('datefield');

    return (
      <ConditionalWrapper
        condition={customLocale !== undefined}
        wrapper={(child: ReactNode) => (
          <I18nProvider locale={customLocale}>{child}</I18nProvider>
        )}
      >
        <BaseFormControl
          style={style}
          className={classNames('eds-datefield', className)}
          labelId={id}
          ref={mergeRefs(dateFieldRef, ref)}
          disabled={state.isDisabled}
          disableLabelAnimation
          label={label}
          labelTooltip={labelTooltip}
          labelProps={parentLabelProps ?? labelProps}
          {...fieldProps}
          variant={variant}
          feedback={feedback}
          append={append}
        >
          {state.segments.map((segment, i) => (
            <FieldSegment segment={segment} state={state} key={i} />
          ))}
        </BaseFormControl>
      </ConditionalWrapper>
    );
  },
);
