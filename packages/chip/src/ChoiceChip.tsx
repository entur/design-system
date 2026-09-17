import React from 'react';
import cx from 'classnames';
import { useChoiceChipGroupContext } from './ChoiceChipGroupContext';
import './BaseChip.scss';
import './ChoiceChip.scss';

export type ChoiceChipProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Om Choicechip er deaktivert eller ikke
   * @default false
   */
  disabled?: boolean;
  /** Label til ChoiceChip */
  children?: React.ReactNode;
  /** Verdien til ChoiceChip */
  value: string;
  /** Størrelsen på chip
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
} & Omit<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  'value' | 'size'
>;

export const ChoiceChip = React.forwardRef<HTMLInputElement, ChoiceChipProps>(
  (
    {
      className,
      children,
      value,
      disabled = false,
      style,
      size = 'medium',
      ...rest
    },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const classList = cx(className, 'eds-chip', `eds-chip--size-${size}`, {
      'eds-chip--disabled': disabled,
    });
    const {
      name,
      value: selectedValue,
      onChange,
    } = useChoiceChipGroupContext();
    return (
      <label className="eds-choice-chip" style={style}>
        <input
          className="eds-choice-chip__input"
          type="radio"
          name={name}
          ref={ref}
          value={value}
          disabled={disabled}
          checked={selectedValue === value}
          onChange={onChange}
          aria-disabled={disabled}
          {...rest}
        />
        <div className={classList}>{children}</div>
      </label>
    );
  },
);
