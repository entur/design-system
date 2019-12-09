import React from 'react';
import { Label } from '@entur/typography';
import { FeedbackText, VariantType, VariantProvider } from '@entur/form';
import { useDownshift } from './DownshiftProvider';

export type DropdownInputGroupProps = {
  label?: string;
  feedback?: string;
  variant?: VariantType;
};
export const DropdownInputGroup: React.FC<DropdownInputGroupProps> = ({
  children,
  label,
  feedback,
  variant,
}) => {
  const { getLabelProps } = useDownshift();
  return (
    <VariantProvider variant={variant}>
      {label && (
        <Label {...getLabelProps()} style={{ display: 'block' }}>
          {label}
        </Label>
      )}
      {children}
      {feedback && variant && (
        <FeedbackText variant={variant}>{feedback}</FeedbackText>
      )}
    </VariantProvider>
  );
};
