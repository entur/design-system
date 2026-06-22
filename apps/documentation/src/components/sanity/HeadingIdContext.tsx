import React, { createContext, useContext, useRef } from 'react';
import { sanitizeText } from 'src/utils/utils';

type HeadingIdContextType = {
  getUniqueId: (text: string) => string;
};

const HeadingIdContext = createContext<HeadingIdContextType>({
  getUniqueId: sanitizeText,
});

export const HeadingIdProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const seen = useRef(new Map<string, number>());

  const getUniqueId = (text: string) => {
    const base = sanitizeText(text);
    const count = seen.current.get(base) ?? 0;
    seen.current.set(base, count + 1);
    return count === 0 ? base : `${base}-${count + 1}`;
  };

  return (
    <HeadingIdContext.Provider value={{ getUniqueId }}>
      {children}
    </HeadingIdContext.Provider>
  );
};

export const useHeadingId = () => useContext(HeadingIdContext);
