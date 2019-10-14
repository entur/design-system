import React from 'react';
import classNames from 'classnames';
import { Label } from '@entur/typography';
import './ToggleSwitch.scss';

type Props = {
  className?: string;
  checked?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  [key: string]: any;
};

const ToggleSwitch: React.FC<Props> = ({ className, children, ...rest }) => (
  <label className={classNames('toggle-switch', className)}>
    <input type="checkbox" {...rest} />
    <span className="toggle-switch__switch" />
    <Label as="span">{children}</Label>
  </label>
);

export default ToggleSwitch;
