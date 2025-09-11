// Base form field states following design system patterns
export type FormFieldVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'negative'
  | 'info';

// Size variants for form components
export type FormFieldSize = 'small' | 'medium' | 'large';

// Form field status for validation and feedback
export type FormFieldStatus = {
  variant?: FormFieldVariant;
  message?: string;
};

// Hook return type for form field management
export interface UseFormFieldReturn {
  fieldId: string;
  labelId: string;
  feedbackId: string;
  descriptionId: string;
  ariaDescribedBy?: string;
  ariaInvalid?: boolean;
  ariaRequired?: boolean;
}

// Form field context for sharing state between components
export interface FormFieldContextValue {
  fieldId: string;
  labelId: string;
  feedbackId: string;
  descriptionId: string;
  ariaDescribedBy?: string;
  ariaInvalid?: boolean;
  ariaRequired?: boolean;
  variant?: FormFieldVariant;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  size?: FormFieldSize;
  isFilled?: boolean;
  setIsFilled?: (filled: boolean) => void;
  isFocused?: boolean;
  setIsFocused?: (focused: boolean) => void;
  handleFocus?: () => void;
  handleBlur?: () => void;
}
