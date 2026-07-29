import React from 'react';
import { VariantType } from '@entur/utils';

/** @deprecated use variant="information" instead */
const info = 'info';
/** @deprecated use variant="negative" instead */
const error = 'error';

const VariantContext = React.createContext<
  VariantType | typeof error | typeof info | null
>(null);

export type VariantProviderProps = {
  children: React.ReactNode;
  variant?: VariantType | typeof error | typeof info;
};
export const VariantProvider = ({
  children,
  variant = null,
}: VariantProviderProps) => {
  return (
    <VariantContext.Provider value={variant}>
      {children}
    </VariantContext.Provider>
  );
};

export const useVariant: () =>
  | VariantType
  | typeof error
  | typeof info
  | null = () => {
  const context = React.useContext(VariantContext);
  return context;
};
