import classNames from 'classnames';
import React from 'react';
import { useInputGroupContext } from './InputGroupContext';
import './InputGroupLabel.scss';

export const InputGroupLabel: React.FC<
  {
    label?: React.ReactNode;
    required?: boolean;
    labelTooltip?: string;
    labelId: string;
    staticAnimation?: boolean;
  } & React.DetailedHTMLProps<
    React.LabelHTMLAttributes<HTMLLabelElement>,
    HTMLLabelElement
  >
> = ({ label, required, labelId, staticAnimation = false, ...rest }) => {
  const { isFilled } = useInputGroupContext();
  const filler = staticAnimation || isFilled;
  return (
    <label
      className={classNames(rest.className, {
        'eds-input-group-label-wrapper--filled': filler,
      })}
      id={labelId}
      {...rest}
    >
      <span
        className={classNames('eds-input-group__label', {
          'eds-input-group__label--filled': filler,
        })}
      >
        {label} {required && <span>*</span>}
      </span>
    </label>
  );
};
