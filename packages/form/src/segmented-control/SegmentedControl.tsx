import React from 'react';
import classNames from 'classnames';
import { useSegmentedGroupContext } from './SegmentedGroup';
import './SegmentedControl.scss';
import { SegmentedCheckbox } from './SegmentedCheckbox';
import { SegmentedRadio } from './SegmentedRadio';

export type SegmentedControlProps = {
  /** Verdien til Segmented Control
   * @default Verdien til children
   */
  value: string;
  /** Label for Segmented Control */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  [key: string]: any;
};

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  children,
  className,
  style,
  value,
  ...rest
}) => {
  const {
    name,
    value: selectedValue,
    onChange,
    multiple,
  } = useSegmentedGroupContext();
  const Element = multiple ? SegmentedCheckbox : SegmentedRadio;
  return (
    <label
      className={classNames('eds-base-segmented', className)}
      style={style}
    >
      <Element
        name={name}
        checked={selectedValue === value}
        value={value}
        onChange={onChange}
        {...rest}
      >
        {children}
      </Element>
    </label>
  );
};
