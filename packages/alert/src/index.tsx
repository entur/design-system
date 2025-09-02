import { warnAboutMissingStyles } from '@entur/utils';
import './index.scss';
warnAboutMissingStyles('alert', 'icons');

export { BannerAlertBox } from './BannerAlertBox';
export { CopyableText } from './CopyableText';
export {
  SmallExpandableAlertBox,
  BannerExpandableAlertBox,
} from './ExpandableAlertBox';
export { SmallAlertBox } from './SmallAlertBox';
export { ToastAlertBox } from './ToastAlertBox';
export { ToastProvider, useToast } from './ToastProvider';

export type { BannerAlertBoxProps } from './BannerAlertBox';
export type { CopyableTextProps } from './CopyableText';
export type {
  SmallExpandableAlertBoxProps,
  BannerExpandableAlertBoxProps,
} from './ExpandableAlertBox';
export type { SmallAlertBoxProps } from './SmallAlertBox';
export type { ToastAlertBoxProps } from './ToastAlertBox';
export type {
  ToastVariants,
  AddToastPayload,
  ToastProviderProps,
} from './ToastProvider';
