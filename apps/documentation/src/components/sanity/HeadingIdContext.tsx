import React, { createContext, useContext, useRef } from 'react';
import { sanitizeText } from 'src/utils/utils';

export const getUniqueId = (
  text: string,
  seen: Map<string, number>,
): string => {
  const base = sanitizeText(text);
  const count = seen.get(base) ?? 0;
  seen.set(base, count + 1);
  return count === 0 ? base : `${base}-${count + 1}`;
};

type HeadingIdContextType = {
  getId: (text: string) => string;
};

const HeadingIdContext = createContext<HeadingIdContextType>({
  getId: sanitizeText,
});

export const HeadingIdProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const seen = useRef(new Map<string, number>());
  const getId = (text: string) => getUniqueId(text, seen.current);

  return (
    <HeadingIdContext.Provider value={{ getId }}>
      {children}
    </HeadingIdContext.Provider>
  );
};

export const useHeadingId = () => useContext(HeadingIdContext);
