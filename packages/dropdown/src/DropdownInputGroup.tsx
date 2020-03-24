import React from 'react';
import { Label } from '@entur/typography';
import { Tooltip } from '@entur/tooltip';
import { QuestionIcon } from '@entur/icons';
import { FeedbackText, VariantType, VariantProvider } from '@entur/form';
import { useDownshift } from './DownshiftProvider';

export type DropdownInputGroupProps = {
  label?: string;
  labelTooltip?: string;
  feedback?: string;
  variant?: VariantType;
  className?: string;
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
}) => {
  const { getLabelProps } = useDownshift();
  return (
    <VariantProvider variant={variant}>
      <div className={className} style={style}>
        {label && (
          <Label {...getLabelProps()} style={{ display: 'flex' }}>
            {label}
            {labelTooltip && (
              <Tooltip content={labelTooltip} placement="right">
                <span className="eds-input-group__label-tooltip-icon">
                  <QuestionIcon />
                </span>
              </Tooltip>
            )}
          </Label>
        )}
        {children}
        {feedback && variant && (
          <FeedbackText variant={variant}>{feedback}</FeedbackText>
        )}
      </div>
    </VariantProvider>
  );
};
