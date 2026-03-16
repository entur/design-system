import React from 'react';

export const SidebarContext = React.createContext<{
  isCollapsed: boolean;
}>({
  isCollapsed: false,
});

/** Hook to read the collapsed state of the nearest `Template.Portal.Sidebar`.
 *  Returns `{ isCollapsed: false }` when used outside a collapsible sidebar. */
export const useSidebarCollapsed: () => { isCollapsed: boolean } = () =>
  React.useContext(SidebarContext);
