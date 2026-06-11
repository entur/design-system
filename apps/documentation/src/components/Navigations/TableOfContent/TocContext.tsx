import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { TocHeading } from './TableOfContent';

interface TocContextValue {
  headings: TocHeading[] | null;
  setHeadings: (headings: TocHeading[] | null) => void;
}

const TocContext = createContext<TocContextValue>({
  headings: null,
  setHeadings: () => {},
});

export const TocProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [headings, setHeadings] = useState<TocHeading[] | null>(null);
  const value = useMemo(() => ({ headings, setHeadings }), [headings]);
  return <TocContext.Provider value={value}>{children}</TocContext.Provider>;
};

export const useTocHeadings = () => useContext(TocContext);

export const useSetTocHeadings = (headings: TocHeading[]) => {
  const { setHeadings } = useTocHeadings();
  useEffect(() => {
    setHeadings(headings);
    return () => setHeadings(null);
  }, [headings, setHeadings]);
};
