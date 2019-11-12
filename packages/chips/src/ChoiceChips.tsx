import React from 'react';
import cx from 'classnames';
import './BaseChips.scss';
import './ChoiceChips.scss';

type ChoiceChipProps = {
  /** Ekstra klassenavn */
  className?: string;
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
    { className, children, value, ...rest },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const classList = cx(className, 'entur-chip', 'entur-choice-chip');
    // const { name, value: selectedValue, onChange } = false;
    return (
      <label className="entur-choice-chip">
        <input
          type="radio"
          name={name}
          ref={ref}
          value={value}
          //   checked={selectedValue === value}
          //   onChange={onChange}
          {...rest}
        />
        <div className={classList}>{children}</div>
      </label>
    );
  },
);
