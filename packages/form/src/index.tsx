import { warnAboutMissingStyles } from '@entur/utils';
import './index.scss';
warnAboutMissingStyles('form', 'icons', 'typography');

export * from './inputPanel';
export * from './segmented-control';

export { BaseFormControl } from './BaseFormControl';
export { Checkbox } from './Checkbox';
export { FeedbackText } from './FeedbackText';
export { Fieldset } from './Fieldset';
export {
  InputGroupContextProvider,
  useInputGroupContext,
} from './InputGroupContext';
export { InputGroupLabel } from './InputGroupLabel';
export { Radio } from './Radio';
export { RadioGroup } from './RadioGroup';
export {
  RadioGroupContextProvider,
  useRadioGroupContext,
} from './RadioGroupContext';
export { Switch } from './Switch';
export { TextArea } from './TextArea';
export { TextField } from './TextField';
export { VariantProvider, useVariant } from './VariantProvider';
export { hasValue, isFilled } from './utils';

export type { BaseFormControlProps } from './BaseFormControl';
export type { CheckboxProps } from './Checkbox';
export type { FeedbackTextProps } from './FeedbackText';
export type { FieldsetProps } from './Fieldset';
export type { InputGroupLabelProps } from './InputGroupLabel';
export type { RadioProps } from './Radio';
export type { RadioGroupProps } from './RadioGroup';
export type { SwitchProps } from './Switch';
export type { TextAreaProps } from './TextArea';
export type { TextFieldProps } from './TextField';
export type { VariantProviderProps } from './VariantProvider';
export type { VariantType } from './variants';
