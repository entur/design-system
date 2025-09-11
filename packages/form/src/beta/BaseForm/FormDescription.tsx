import React from 'react';
import classNames from 'classnames';
import { useFormFieldContext } from './FormFieldContext';
import { Text } from '@entur/typography/beta';

export interface FormDescriptionProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Description content */
  children: React.ReactNode;
  /** Custom required indicator to display with the description */
  requiredIndicator?: React.ReactNode;
  /** Custom className */
  className?: string;
}

export const FormDescription: React.FC<FormDescriptionProps> = ({
  children,
  requiredIndicator,
  className,
  ...rest
}) => {
  const { descriptionId, disabled } = useFormFieldContext();

  return (
    <Text
      as="p"
      variant="subparagraph"
      spacing="none"
      id={descriptionId}
      className={classNames(
        'eds-form-field__description',
        {
          'eds-form-field__description--disabled': disabled,
        },
        className,
      )}
      {...rest}
    >
      {children}
      {requiredIndicator && (
        <span className="eds-form-field__description-required">
          {requiredIndicator}
        </span>
      )}
    </Text>
  );
};

FormDescription.displayName = 'FormDescription';
