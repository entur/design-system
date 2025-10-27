import classNames from 'classnames';
import React from 'react';
import { useInputGroupContext } from './InputGroupContext';
import './InputGroupLabel.scss';

export type InputGroupLabelProps = {
  label?: React.ReactNode;
  required?: boolean;
  labelTooltip?: string;
  labelId: string;
  isFilled?: boolean;
  staticAnimation?: boolean;
} & React.DetailedHTMLProps<
  React.LabelHTMLAttributes<HTMLLabelElement>,
  HTMLLabelElement
>;

export const InputGroupLabel: React.FC<InputGroupLabelProps> = ({
  label,
  required,
  labelId,
  staticAnimation = false,
  className,
  isFilled: forceIsFilled,
  ...rest
}) => {
  const { isFilled } = useInputGroupContext();
  const filler = staticAnimation || (forceIsFilled ?? isFilled);
  return (
    <label
      className={classNames(className, {
        'eds-input-group-label-wrapper--filled': filler,
        'eds-input-group-label-wrapper--controlled-label-position':
          forceIsFilled !== undefined,
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
