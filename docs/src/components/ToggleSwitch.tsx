import React from 'react';
import classNames from 'classnames';
import './ToggleSwitch.scss';

const ToggleSwitch: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  className,
  checked,
  children,
  onChange,
}) => (
  <label className={classNames('toggle-switch', className)}>
    <input type="checkbox" checked={checked} onChange={onChange} />
    <span className="toggle-switch__switch" />
    {children}
  </label>
);

export default ToggleSwitch;
