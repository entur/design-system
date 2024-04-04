import React from 'react';

/** @deprecated use variant="information" instead */
const info = 'info';
/** @deprecated use variant="negative" instead */
const error = 'error';

export type VariantType =
  | 'success'
  | 'negative'
  | 'warning'
  | 'information'
  | typeof error
  | typeof info;

const VariantContext = React.createContext<VariantType | null>(null);

export type VariantProviderProps = {
  variant?: VariantType;
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

export const useVariant: () => VariantType | null = () => {
  const context = React.useContext(VariantContext);
  return context;
};
