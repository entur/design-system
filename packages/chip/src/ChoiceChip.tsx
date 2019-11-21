import React from 'react';
import cx from 'classnames';
import { useChoiceChipGroupContext } from './ChoiceChipGroupContext';
import './BaseChip.scss';
import './ChoiceChip.scss';

export type ChoiceChipProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Om Choicechip er deaktivert eller ikke */
  disabled?: boolean;
  /** Label til ChoiceChip */
  children?: React.ReactNode;
  /** Verdien til ChoiceChip */
  value: string;
  [key: string]: any;
};

export const ChoiceChip: React.RefForwardingComponent<
  HTMLInputElement,
  ChoiceChipProps
> = React.forwardRef(
  (
    { className, children, value, disabled = false, ...rest },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const classList = cx(className, 'eds-chip', {
      'eds-chip--disabled': disabled,
    });
    const {
      name,
      value: selectedValue,
      onChange,
    } = useChoiceChipGroupContext();
    return (
      <label className="eds-choice-chip">
        <input
          className="eds-choice-chip__input"
          type="radio"
          name={name}
          ref={ref}
          value={value}
          disabled={disabled}
          checked={selectedValue === value}
          onChange={onChange}
          {...rest}
        />
        <div className={classList}>{children}</div>
      </label>
    );
  },
);
