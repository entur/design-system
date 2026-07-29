import React from 'react';

export type TabsContextValue = {
  selectedIndex: number;
  onSelect: (index: number) => void;
  tabsId: string;
};

export const TabsContext = React.createContext<TabsContextValue>({
  selectedIndex: 0,
  onSelect: () => undefined,
  tabsId: '',
});

export type TabItemContextValue = {
  tabIndex: number;
  tabId: string;
  panelId: string;
};

export const TabItemContext = React.createContext<TabItemContextValue | null>(
  null,
);

export type TabPanelItemContextValue = {
  tabIndex: number;
  tabId: string;
  panelId: string;
  keepMounted: boolean;
};

export const TabPanelItemContext =
  React.createContext<TabPanelItemContextValue | null>(null);
