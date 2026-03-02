import React from 'react';

export type TabsContextValue = {
  selectedIndex: number;
  onSelect: (index: number) => void;
  tabsId: string;
};

// Default values are provided so components work even without a Tabs parent,
// though in practice Tab/TabPanel are always rendered inside Tabs.
export const TabsContext = React.createContext<TabsContextValue>({
  selectedIndex: 0,
  onSelect: () => undefined,
  tabsId: '',
});
