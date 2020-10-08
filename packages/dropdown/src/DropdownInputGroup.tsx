import {
  FeedbackText,
  InputGroupLabel,
  VariantProvider,
  VariantType,
} from '@entur/form';
import React from 'react';
import classNames from 'classnames';
import { useDownshift } from './DownshiftProvider';

export type DropdownInputGroupProps = {
  label?: string;
  labelTooltip?: string;
  feedback?: string;
  variant?: VariantType;
  className?: string;
  labelId: string;
  style?: { [key: string]: any };
};
export const DropdownInputGroup: React.FC<DropdownInputGroupProps> = ({
  children,
  label,
  labelTooltip,
  feedback,
  variant,
  className,
  style,
  labelId,
}) => {
  const { getLabelProps } = useDownshift();
  return (
    <VariantProvider variant={variant}>
      <div
        className={classNames('eds-form-control-wrappe', className)}
        style={style}
      >
        {label && (
          <InputGroupLabel
            label={label}
            labelTooltip={labelTooltip}
            labelId={labelId}
            {...getLabelProps}
          />
        )}
        {children}
        {feedback && variant && (
          <FeedbackText variant={variant}>{feedback}</FeedbackText>
        )}
      </div>
    </VariantProvider>
  );
};
