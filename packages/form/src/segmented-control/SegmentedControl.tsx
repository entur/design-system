import React from 'react';
import classNames from 'classnames';
import { useSegmentedGroupContext } from './SegmentedGroup';
import './SegmentedControl.scss';

export type SegmentedControlProps = {
  /** Verdien til Segmented Control
   * @default Verdien til children
   */
  value: string;
  /** Label for Segmented Control */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** */
  [key: string]: any;
};

export const SegmentedControl: React.RefForwardingComponent<
  HTMLInputElement,
  SegmentedControlProps
> = React.forwardRef(
  (
    { children, className, style, value, name, checked, ...rest },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const {
      name: selectedName,
      value: selectedValue,
      onChange,
      multiple,
    } = useSegmentedGroupContext();

    const isControlled = checked !== undefined;
    const isCheckbox = multiple;
    let isChecked;
    if (isCheckbox) {
      if (isControlled) {
        isChecked = checked;
      } else {
        isChecked = selectedValue![name];
      }
    } else {
      isChecked = selectedValue === value;
    }
    return (
      <label
        className={classNames('eds-segmented-control', className)}
        style={style}
      >
        <input
          type={multiple ? 'checkbox' : 'radio'}
          name={selectedName || name}
          checked={isChecked}
          value={value}
          onChange={onChange}
          ref={ref}
          {...rest}
        />
        <div className="eds-base-segmented">{children}</div>
      </label>
    );
  },
);
