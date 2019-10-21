import cx from 'classnames';
import { useVariant } from './FormGroup';
import { VariantType } from './variants';
import './GenericFormComponent.scss';

export function useFormComponent(
  variant?: VariantType,
  disabled?: boolean,
  className?: string,
  width?: string,
) {
  const formGroupVariant: any = useVariant();
  const prioritizedVariant: any = variant || formGroupVariant;
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
