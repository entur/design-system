import React from 'react';
import cx from 'classnames';
import { useVariant } from './FormGroup';
import { VariantType } from './variants';
import './GenericFormComponent.scss';

export type GenericFormComponentProps = {
  variant?: VariantType;
  disabled?: boolean;
  className?: string;
  width?: 'fluid';
  inputType: string | React.ElementType;
  [key: string]: any;
};

export const GenericFormComponent: React.FC<GenericFormComponentProps> = ({
  variant,
  disabled,
  className,
  inputType: Element,
  width,
  ...rest
}) => {
  const formGroupVariant: any = useVariant();
  const prioritizedVariant: any = variant || formGroupVariant;
  const classList = cx(
    `entur-form-component`,
    `entur-form-component__${Element as string}`,
    {
      [`entur-form-component--variant-${prioritizedVariant}`]: prioritizedVariant,
      [`entur-form-component--disabled`]: disabled,
      [`entur-form-component--width-${width}`]: width,
    },
    className,
  );
  return (
    <Element
      className={classList}
      disabled={disabled}
      aria-invalid={prioritizedVariant === 'error'}
      {...rest}
    />
  );
};
