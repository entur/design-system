import { warnAboutMissingStyles } from '@entur/utils';
import './index.scss';
warnAboutMissingStyles('a11y');

export { SkipToContent } from './SkipToContent';
export { VisuallyHidden } from './VisuallyHidden';

export type { SkipToContentProps } from './SkipToContent';
export type { VisuallyHiddenProps } from './VisuallyHidden';
