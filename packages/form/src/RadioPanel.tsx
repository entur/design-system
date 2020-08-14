import React from 'react';
import classNames from 'classnames';
import { useRadioGroupContext } from './RadioGroupContext';
import './RadioPanel.scss';

export type RadioPanelProps = {
  /** Verdien til RadioPanel */
  value: string;
  /** Hovedtittelen til RadioPanel */
  title: React.ReactNode;
  /** Ektstra label som står høyrestilt mot Checkboxen */
  secondaryLabel?: React.ReactNode;
  /** Ekstra informasjon som legges nederst i RadioPanel */
  children: React.ReactNode;
  /** Størrelse på RadioPanel
   * @default "medium"
   */
  size?: 'medium' | 'large';
  /**Skjuler checkbox-en i RadioPanel
   * @default false
   */
  hideCheckbox?: boolean;
  /** Ekstra klassenavn */
  className?: string;
  /** */
  style?: React.CSSProperties;
  [key: string]: any;
};

export const RadioPanel = React.forwardRef<HTMLInputElement, RadioPanelProps>(
  (
    {
      className,
      children,
      value,
      title,
      secondaryLabel,
      size = 'medium',
      hideCheckbox = false,
      style,
      ...rest
    },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const classList = classNames(
      className,
      'eds-radio-panel__container',
      `eds-radio-panel--${size}`,
    );

    const { name, value: selectedValue, onChange } = useRadioGroupContext();
    return (
      <label className="eds-radio-panel__wrapper">
        <input
          type="radio"
          name={name}
          ref={ref}
          value={value}
          checked={selectedValue === value}
          onChange={onChange}
          {...rest}
        />
        <div className={classList} style={style}>
          <div className="eds-radio-panel__title-wrapper">
            <div className="eds-radio-panel__title">{title}</div>
            <div className="eds-radio-panel__label">
              {secondaryLabel && <span>{secondaryLabel}</span>}
              {!hideCheckbox && (
                <span className="eds-radio-panel__check">
                  <RadioPanelCheck />
                </span>
              )}
            </div>
          </div>
          {children && (
            <div className="eds-radio-panel__additional-content">
              {children}
            </div>
          )}
        </div>
      </label>
    );
  },
);

const RadioPanelCheck: React.FC = () => {
  return (
    <svg
      className="eds-checkbox-icon"
      width="22px"
      height="16px"
      viewBox="6 11 37 33"
    >
      <path
        className="eds-checkbox-icon__path"
        d="M14.1 27.2l7.1 7.2 14.6-14.8"
        fill="none"
      />
    </svg>
  );
};
