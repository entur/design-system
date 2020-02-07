import React from 'react';
import cx from 'classnames';
import './BaseChip.scss';
import './SelectorChip.scss';

export type SelectorChipProps = {
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

export const SelectorChip: React.RefForwardingComponent<
  HTMLInputElement,
  SelectorChipProps
> = React.forwardRef(
  (
    { className, children, value, disabled = false, name, style, ...rest },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const classList = cx(className, 'eds-chip', 'eds-selector-chip');

    return (
      <label className={classList} style={style}>
        <input
          className="eds-selector-chip__input"
          type="checkbox"
          name={name}
          ref={ref}
          value={value}
          {...rest}
        />
        <span className="eds-selector-chip__icon">
          <CheckboxIcon />
        </span>
        {children}
      </label>
    );
  },
);

const CheckboxIcon: React.FC = () => {
  return (
    <svg
      className="eds-selector-chip-icon"
      width="11px"
      height="9px"
      viewBox="6 11 37 33"
    >
      <path
        className="eds-selector-chip-icon__path"
        d="M14.1 27.2l7.1 7.2 14.6-14.8"
        fill="none"
      />
    </svg>
  );
};
