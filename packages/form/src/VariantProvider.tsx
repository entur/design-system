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
  variant?: VariantType | typeof error | typeof info;
};
export const VariantProvider: React.FC<VariantProviderProps> = ({
  children,
  variant = null,
}) => {
  return (
    <VariantContext.Provider value={variant}>
      {children}
    </VariantContext.Provider>
  );
};

export const useVariant: () => VariantType | typeof error | typeof info | null =
  () => {
    const context = React.useContext(VariantContext);
    return context;
  };
