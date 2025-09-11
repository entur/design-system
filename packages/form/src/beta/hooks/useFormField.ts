import { useMemo } from 'react';
import { useRandomId } from '@entur/utils';
import { UseFormFieldReturn } from '../types';

/**
 * Hook for managing form field IDs and accessibility attributes
 * Following patterns from Chakra UI and Mantine
 */
export const useFormField = (options?: {
  id?: string;
  labelId?: string;
  feedbackId?: string;
  descriptionId?: string;
  variant?: 'default' | 'success' | 'warning' | 'negative' | 'info';
  required?: boolean;
}): UseFormFieldReturn => {
  const generatedId = useRandomId('eds-form-field');
  const fieldId = options?.id || generatedId;

  return useMemo(() => {
    const labelId = options?.labelId || `${fieldId}-label`;
    const feedbackId = options?.feedbackId || `${fieldId}-feedback`;
    const descriptionId = options?.descriptionId || `${fieldId}-description`;

    // Build aria-describedby string for accessibility
    const describedBy = [
      options?.descriptionId && descriptionId,
      options?.feedbackId && feedbackId,
    ].filter(Boolean);

    return {
      fieldId,
      labelId,
      feedbackId,
      descriptionId,
      ariaDescribedBy:
        describedBy.length > 0 ? describedBy.join(' ') : undefined,
      ariaInvalid: options?.variant === 'negative',
      ariaRequired: options?.required,
    };
  }, [fieldId, options]);
};
