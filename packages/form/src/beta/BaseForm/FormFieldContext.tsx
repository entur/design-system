import { createContext, useContext } from 'react';
import { FormFieldContextValue } from '../types';

const FormFieldContext = createContext<FormFieldContextValue | null>(null);

export const FormFieldProvider = FormFieldContext.Provider;

export const useFormFieldContext = () => {
  const context = useContext(FormFieldContext);
  if (!context) {
    throw new Error(
      'useFormFieldContext must be used within a FormFieldProvider',
    );
  }
  return context;
};

export const useFormFieldContextOptional = () => {
  return useContext(FormFieldContext);
};
