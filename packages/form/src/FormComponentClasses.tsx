import cx from 'classnames';
import { useVariant } from './FormGroup';
import { VariantType } from './variants';
import './FormComponentClasses.scss';
import { ClassValue } from 'classnames/types';

type UseFormComponentClasses = {
  variant: VariantType;
  disabled?: boolean;
  className?: ClassValue;
  width?: string;
};

export function useFormComponentClasses({
  variant,
  disabled,
  className,
  width,
}: UseFormComponentClasses) {
  const formGroupVariant: any = useVariant();
  const prioritizedVariant: any =
    variant === 'none' ? formGroupVariant : variant;
  const classList = cx(
    `entur-form-component`,
    {
      [`entur-form-component--variant-${prioritizedVariant}`]: prioritizedVariant,
      [`entur-form-component--disabled`]: disabled,
      [`entur-form-component--width-${width}`]: width,
    },
    className,
  );

  return classList;
}
