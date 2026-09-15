import React, { createContext, useContext, useMemo } from 'react';
import { buildHeadingIdMap } from 'src/utils/headingIds';

/** _key -> heading id, derived once from the content by buildHeadingIdMap. */
type HeadingIdMap = Map<string, string>;

const HeadingIdContext = createContext<HeadingIdMap | null>(null);

export const HeadingIdProvider: React.FC<{
  content: any;
  children: React.ReactNode;
}> = ({ content, children }) => {
  const inherited = useContext(HeadingIdContext);
  const ids = useMemo(
    () => (inherited ? null : buildHeadingIdMap(content)),
    [inherited, content],
  );

  // Nested content shares the outermost map, so ids stay unique across the
  // whole document instead of restarting per subtree.
  if (!ids) return <>{children}</>;

  return (
    <HeadingIdContext.Provider value={ids}>
      {children}
    </HeadingIdContext.Provider>
  );
};

export const useHeadingIds = () => useContext(HeadingIdContext);
