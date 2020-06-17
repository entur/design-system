import React from 'react';
import classNames from 'classnames';
import {
  useSegmentedContext,
  SelectedValues,
  SelectedValue,
} from './SegmentedContext';
import './SegmentedChoice.scss';

export type SegmentedChoiceProps = {
  /** Verdien til valget */
  value: string;
  /** Innhold som beskriver valget */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** Callback som kalles når komponenten endres */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  [key: string]: any;
};

export const SegmentedChoice = React.forwardRef<
  HTMLInputElement,
  SegmentedChoiceProps
>(
  (
    { children, className, style, value, name, onChange = () => {}, ...rest },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const {
      name: commonName,
      selectedValue,
      onChange: commonOnChange,
      multiple,
      size,
    } = useSegmentedContext();

    const isChecked = multiple
      ? (selectedValue as SelectedValues)[value]
      : (selectedValue as SelectedValue) === value;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e);
      if (multiple) {
        commonOnChange({
          ...(selectedValue as SelectedValues),
          [value]: e.target.checked,
        } as any);
      } else if (e.target.checked) {
        commonOnChange(value as any);
      }
    };

    return (
      <label
        className={classNames('eds-segmented-choice', className, {
          'eds-segmented-choide--large': size === 'large',
        })}
        style={style}
      >
        <input
          type={multiple ? 'checkbox' : 'radio'}
          name={name || commonName}
          checked={isChecked}
          value={value}
          onChange={handleChange}
          ref={ref}
          {...rest}
        />
        <div
          className={classNames('eds-base-segmented', {
            'eds-base-segmented--large': size === 'large',
          })}
        >
          {children}
        </div>
      </label>
    );
  },
);
