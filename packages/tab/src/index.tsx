import { warnAboutMissingStyles } from '@entur/utils';
import './index.scss';
warnAboutMissingStyles('tab');

export { Tab } from './Tab';
export { TabList } from './TabList';
export { TabPanel } from './TabPanel';
export { TabPanels } from './TabPanels';
export { Tabs } from './Tabs';

export type { TabProps } from './Tab';
export type { TabListProps } from './TabList';
export type { TabPanelProps } from './TabPanel';
export type { TabPanelsProps } from './TabPanels';
export type { TabsProps } from './Tabs';
