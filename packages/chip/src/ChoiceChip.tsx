import React from 'react';
import cx from 'classnames';
import { useChoiceChipsGroupContext } from './ChoiceChipsGroupContext';
import './BaseChip.scss';
import './ChoiceChip.scss';

type ChoiceChipProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Om Choicechip er deaktivert eller ikke */
  disabled?: boolean;
  /** Label til choicechippen. */
  children?: React.ReactNode;
  /** Verdien til choice chippen */
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
    } = useChoiceChipsGroupContext();
    return (
      <label className="eds-choice-chip">
        <input
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
