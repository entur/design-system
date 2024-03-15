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
} & React.InputHTMLAttributes<HTMLInputElement>;

export const FilterChip = React.forwardRef<HTMLInputElement, FilterChipProps>(
  (
    { className, children, value, disabled = false, name, style, ...rest },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const classList = cx(className, 'eds-filter-chip');

    return (
      <label className={classList} style={style}>
        <input
          className="eds-filter-chip__input"
          type="checkbox"
          name={name}
          ref={ref}
          value={value}
          disabled={disabled}
          {...rest}
        />
        <div className="eds-chip">
          <span className="eds-filter-chip__icon">
            <CheckboxIcon />
          </span>
          {children}
        </div>
      </label>
    );
  },
);

const CheckboxIcon: React.FC = () => {
  return (
    <svg
      className="eds-filter-chip-icon"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="eds-filter-chip-icon__path"
        d="M1.71283 7.10801L5.6464 11.1377C5.84098 11.3371 6.16095 11.339 6.35786 11.1419L14.2916 3.20325"
        stroke="#181C56"
        strokeWidth="2"
      />
    </svg>
  );
};
