import { Portal } from './portal';
import type {
  PortalComponent,
  PortalMainProps,
  PortalProps,
  PortalStatusBarProps,
} from './portal';
import type {
  SidebarComponent,
  SidebarProps,
  SidebarSectionProps,
} from './Sidebar';

export type TemplateComponent = {
  Portal: PortalComponent;
};

export const Template: TemplateComponent = {
  Portal,
};

export type {
  PortalComponent,
  PortalMainProps,
  PortalProps,
  PortalStatusBarProps,
  SidebarComponent,
  SidebarProps,
  SidebarSectionProps,
};
