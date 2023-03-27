import React from 'react';
import { useRadioGroupContext } from '../RadioGroupContext';
import { InputPanelBase } from './InputPanelBase';

export type RadioPanelProps = {
  /** Verdien til radio-panelet */
  value: string;
  /** Hovedtittelen til radio-panelet */
  title: React.ReactNode;
  /** Ektstra label som står høyrestilt, til venstre for radio-button-en */
  secondaryLabel?: React.ReactNode;
  /** Ekstra informasjon som legges nederst i radio-panelet */
  children?: React.ReactNode;
  /** Størrelse på radio-panelet
   * @default "medium"
   */
  size?: 'medium' | 'large';
  /**Skjuler radio-button-en i radio-panelet
   * @default false
   */
  hideRadioButton?: boolean;
  /** Ekstra klassenavn */
  className?: string;
  /** Om radio-panelet er deaktivert eller ikke
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

export const RadioPanel = React.forwardRef<HTMLInputElement, RadioPanelProps>(
  (
    {
      className,
      children,
      value,
      title,
      secondaryLabel,
      size = 'medium',
      hideRadioButton = false,
      style,
      id,
      disabled = false,
      ...rest
    },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const { name, value: selected, onChange } = useRadioGroupContext();

    return (
      <InputPanelBase
        type="radio"
        name={name}
        title={title}
        value={value}
        checked={selected === value}
        onChange={onChange}
        className={className}
        secondaryLabel={secondaryLabel}
        size={size}
        hideSelectionIndicator={hideRadioButton}
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
