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
  [key: string]: any;
};

export const ChoiceChip = React.forwardRef<HTMLInputElement, ChoiceChipProps>(
  (
    { className, children, value, disabled = false, style, ...rest },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const childrenArray = React.Children.toArray(children);
    const hasLeadingIcon =
      childrenArray.length > 1 && typeof childrenArray[0] !== 'string';
    const hasTrailingIcon =
      childrenArray.length > 1 &&
      typeof childrenArray[childrenArray.length - 1] !== 'string';

    const classList = cx(className, 'eds-chip', {
      'eds-chip--disabled': disabled,
      'eds-chip--leading-icon': hasLeadingIcon,
      'eds-chip--trailing-icon': hasTrailingIcon,
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
          {...rest}
        />
        <div className={classList}>{children}</div>
      </label>
    );
  },
);
