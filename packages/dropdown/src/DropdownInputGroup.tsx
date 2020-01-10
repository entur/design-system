import React from 'react';
import { Label } from '@entur/typography';
import { FeedbackText, VariantType, VariantProvider } from '@entur/form';
import { useDownshift } from './DownshiftProvider';
import classNames from 'classnames';

export type DropdownInputGroupProps = {
  label?: string;
  feedback?: string;
  variant?: VariantType;
  className?: string;
};
export const DropdownInputGroup: React.FC<DropdownInputGroupProps> = ({
  children,
  label,
  feedback,
  variant,
  className,
}) => {
  const { getLabelProps } = useDownshift();
  return (
    <VariantProvider variant={variant}>
      <div className={classNames(className)}>
        {label && (
          <Label {...getLabelProps()} style={{ display: 'block' }}>
            {label}
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
