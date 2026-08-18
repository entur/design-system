import React from 'react';

import { ItemKind } from './indexedItems';

export type TabsContextValue = {
  selectedIndex: number;
  onSelect: (index: number) => void;
  tabsId: string;
  /** Lets Tabs compare the indices the tabs and the panels ended up with */
  reportIndices: (kind: ItemKind, indices: number[]) => void;
};

export const TabsContext = React.createContext<TabsContextValue>({
  selectedIndex: 0,
  onSelect: () => undefined,
  tabsId: '',
  reportIndices: () => undefined,
});
