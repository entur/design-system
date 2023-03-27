import React from 'react';
import { InputPanelBase } from './InputPanelBase';

export type CheckboxPanelProps = {
  /** Verdien til CheckboxPanel */
  value: string;
  /** Om checkbox-panelet skal være valgt eller ikke */
  checked?: boolean;
  /** Hovedtittelen til CheckboxPanel */
  title: React.ReactNode;
  /** Ektstra label som står høyrestilt mot Checkboxen */
  secondaryLabel?: React.ReactNode;
  /** Ekstra informasjon som legges nederst i CheckboxPanel */
  children?: React.ReactNode;
  /** Størrelse på CheckboxPanel
   * @default "medium"
   */
  size?: 'medium' | 'large';
  /**Skjuler checkbox-en i CheckboxPanel
   * @default false
   */
  hideCheckbox?: boolean;
  /** Ekstra klassenavn */
  className?: string;
  /** Om CheckboxPanel er deaktivert eller ikke
   * @default false
   */
  disabled?: boolean;
  /** */
  style?: React.CSSProperties;
} & Omit<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  'title' | 'size'
>;

export const CheckboxPanel = React.forwardRef<
  HTMLInputElement,
  CheckboxPanelProps
>(
  (
    {
      name,
      checked,
      onChange,
      className,
      children,
      value,
      title,
      secondaryLabel,
      size = 'medium',
      hideCheckbox = false,
      style,
      id,
      disabled = false,
      ...rest
    },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    return (
      <InputPanelBase
        type="checkbox"
        name={name}
        title={title}
        value={value}
        checked={checked}
        onChange={onChange}
        className={className}
        secondaryLabel={secondaryLabel}
        size={size}
        hideSelectionIndicator={hideCheckbox}
        style={style}
        id={id}
        disabled={disabled}
        {...rest}
        ref={ref}
      >
        {children}
      </InputPanelBase>
    );
  },
);
