import React from 'react';
import cx from 'classnames';
import {
  GenericFormComponent,
  GenericFormComponentProps,
} from './GenericFormComponent';
import './TextArea.scss';

type TextAreaPropsExtender = {
  resize: boolean;
};

type TextAreaProps = TextAreaPropsExtender &
  Omit<GenericFormComponentProps, 'fieldType' | 'componentName'>;

export const TextArea: React.RefForwardingComponent<
  HTMLAreaElement,
  TextAreaProps
> = React.forwardRef(
  (
    { variant, disabled = false, className, resize = false, ...rest },
    ref: React.Ref<HTMLAreaElement>,
  ) => {
    const classList = cx(className, {
      ['entur-form-component__textarea--resize']: resize,
    });
    return (
      <GenericFormComponent
        variant={variant}
        disabled={disabled}
        componentName="textarea"
        inputType="textarea"
        className={classList}
        ref={ref}
        {...rest}
      />
    );
  },
);
