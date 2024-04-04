import React from 'react';
import {
  BaseFormControl,
  isFilled,
  useInputGroupContext,
  useVariant,
} from '@entur/form';
import { DateIcon } from '@entur/icons';
import { useOnMount, useRandomId, VariantType } from '@entur/utils';

/** @deprecated use variant="information" instead */
const info = 'info';
/** @deprecated use variant="negative" instead */
const error = 'error';

export type NativeDatePickerProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Label over NativeDatePicker */
  label: string;
  /** Varselmelding, som vil komme under NativeDatePicker */
  feedback?: string;
  /** Valideringsvariant  info og error er deprecated bruk information og negative istedenfor*/
  variant?: VariantType | typeof error | typeof info;
  /** Plasserer labelen statisk på toppen av inputfeltet
   * @default false
   */
  disableLabelAnimation?: boolean;
  /** Tekst eller ikon som kommer før inputfelter
   * @default <DateIcon />
   */
  prepend?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const NativeDatePicker = React.forwardRef<
  HTMLInputElement,
  NativeDatePickerProps
>(
  (
    {
      className,
      style,
      label,
      onChange,
      feedback,
      variant,
      disableLabelAnimation,
      prepend = <DateIcon inline />,
      ...rest
    },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const nativedatepickerId = useRandomId('eds-nativetimepicker');
    return (
      <BaseFormControl
        style={style}
        className={className}
        prepend={prepend}
        label={label}
        feedback={feedback}
        variant={variant}
        labelId={nativedatepickerId}
        disableLabelAnimation={disableLabelAnimation}
        isFilled
      >
        <NativeDatePickerBase
          onChange={onChange}
          aria-labelledby={nativedatepickerId}
          ref={ref}
          variant={variant}
          {...rest}
        />
      </BaseFormControl>
    );
  },
);

type NativeDatePickerBaseProps = {
  onChange?: any;
  variant?: VariantType | typeof error | typeof info;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const NativeDatePickerBase = React.forwardRef<
  HTMLInputElement,
  NativeDatePickerBaseProps
>(({ onChange, variant, value, ...rest }, ref) => {
  const contextVariant = useVariant();
  const currentVariant = variant || contextVariant;
  const { isFilled: isDatepickerFilled, setFilled: setFiller } =
    useInputGroupContext();

  useOnMount(() => {
    setFiller && !isDatepickerFilled && setFiller(true);
  });

  React.useEffect(() => {
    if (value) {
      setFiller && !isDatepickerFilled && setFiller(true);
    } else {
      setFiller && isDatepickerFilled && setFiller(false);
    }
  }, [value, setFiller, isDatepickerFilled]);

  const handleChange = (event: any) => {
    if (isFilled(event.target)) {
      setFiller && !isDatepickerFilled && setFiller(true);
    } else {
      setFiller && isDatepickerFilled && setFiller(false);
    }
    if (onChange) {
      onChange(event);
    }
  };
  return (
    <input
      ref={ref}
      aria-invalid={currentVariant === 'error'}
      type="date"
      className="eds-form-control eds-native-date-picker"
      onChange={handleChange}
      value={value}
      {...rest}
    />
  );
});
