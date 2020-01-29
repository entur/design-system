import React from 'react';
import classNames from 'classnames';
import {
  useSegmentedGroup,
  SelectedValues,
  SelectedValue,
} from './SegmentedGroupContext';
import './SegmentedControl.scss';

export type SegmentedControlProps = {
  /** Verdien til Segmented Control
   */
  value: string;
  /** Innhold som beskriver valget */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** Callback som kalles når komponenten endres */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  [key: string]: any;
};

export const SegmentedControl: React.RefForwardingComponent<
  HTMLInputElement,
  SegmentedControlProps
> = React.forwardRef(
  (
    { children, className, style, value, name, onChange = () => {}, ...rest },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const {
      name: commonName,
      selectedValue,
      onChange: commonOnChange,
      multiple,
    } = useSegmentedGroup();

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
        className={classNames('eds-segmented-control', className)}
        style={style}
      >
        <input
          type={multiple ? 'checkbox' : 'radio'}
          name={name || multiple ? commonName : undefined}
          checked={isChecked}
          value={value}
          onChange={handleChange}
          ref={ref}
          {...rest}
        />
        <div className="eds-base-segmented">{children}</div>
      </label>
    );
  },
);
