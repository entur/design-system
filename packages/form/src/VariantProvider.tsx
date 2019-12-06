import React from 'react';

export type VariantType = 'success' | 'error' | 'warning' | 'info';

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

export const useVariant = () => {
  const context = React.useContext(VariantContext);
  return context;
};
