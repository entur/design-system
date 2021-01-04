import classNames from 'classnames';
import React from 'react';
import { useInputGroupContext } from './InputGroupContext';
import './InputGroupLabel.scss';

export const InputGroupLabel: React.FC<{
  label?: React.ReactNode;
  required?: boolean;
  labelTooltip?: string;
  labelId: string;
}> = ({ label, required, labelId }) => {
  const { isFilled } = useInputGroupContext();
  return (
    <label
      className={classNames({
        'eds-input-group-label-wrapper--filled': isFilled,
      })}
      id={labelId}
    >
      <span
        className={classNames('eds-input-group__label', {
          'eds-input-group__label--filled': isFilled,
        })}
      >
        {label} {required && <span>*</span>}
      </span>
    </label>
  );
};
