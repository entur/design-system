import React from 'react';

export type TabsContextValue = {
  selectedIndex: number;
  onSelect: (index: number) => void;
  tabsId: string;
};

export const TabsContext = React.createContext<TabsContextValue>({
  selectedIndex: 0,
  onSelect: () => {},
  tabsId: '',
});
