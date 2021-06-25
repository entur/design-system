import { FeedbackText, VariantProvider, VariantType } from '@entur/form';
import React from 'react';

export type DropdownInputGroupProps = {
  feedback?: string;
  variant?: VariantType;
  className?: string;
  style?: { [key: string]: any };
};
export const DropdownInputGroup: React.FC<DropdownInputGroupProps> = ({
  children,
  feedback,
  variant,
  className,
  style,
}) => {
  return (
    <VariantProvider variant={variant}>
      <div className={className} style={style}>
        {children}
        {feedback && variant && (
          <FeedbackText variant={variant}>{feedback}</FeedbackText>
        )}
      </div>
    </VariantProvider>
  );
};
