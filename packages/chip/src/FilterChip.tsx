import React from 'react';
import cx from 'classnames';
import './BaseChip.scss';
import './FilterChip.scss';

export type FilterChipProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Label til FilterChip */
  children?: React.ReactNode;
  /** Verdien til FilterChip */
  value: string;
  [key: string]: any;
};

export const FilterChip = React.forwardRef<HTMLInputElement, FilterChipProps>(
  (
    { className, children, value, disabled = false, name, style, ...rest },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const classList = cx(className, 'eds-chip', 'eds-filter-chip');

    return (
      <label className={classList} style={style}>
        <input
          className="eds-filter-chip__input"
          type="checkbox"
          name={name}
          ref={ref}
          value={value}
          {...rest}
        />
        <span className="eds-filter-chip__icon">
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
      className="eds-filter-chip-icon"
      width="11px"
      height="9px"
      viewBox="6 11 37 33"
    >
      <path
        className="eds-filter-chip-icon__path"
        d="M14.1 27.2l7.1 7.2 14.6-14.8"
        fill="none"
      />
    </svg>
  );
};
