import { warnAboutMissingStyles } from '@entur/utils';
import './index.scss';
warnAboutMissingStyles('tooltip');

export {
  Popover,
  PopoverTrigger,
  PopoverCloseButton,
  PopoverContent,
} from './Popover';
export { Tooltip } from './Tooltip';
export { standardisePlacement } from './utils';

export type {
  PopoverProps,
  PopoverTriggerProps,
  PopoverCloseButtonProps,
  PopoverContentProps,
} from './Popover';
export type { TooltipProps } from './Tooltip';
export type { Placement } from './utils';
