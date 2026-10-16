// Beta typography components - experimental features
// These components may have breaking changes in future releases

import { warnAboutMissingStyles } from '@entur/utils';
import './index.scss';

// Beta still relies on the base typography styles, and Link uses an icon
warnAboutMissingStyles('typography', 'icons');

export { Heading } from './components/Heading';
export { Text } from './components/Text';
export { Link } from './components/Link';
export { Blockquote, BlockquoteFooter } from './components/Blockquote';
export { UnorderedList } from './components/UnorderedList';
export { NumberedList } from './components/NumberedList';
export { ListItem } from './components/ListItem';

export type {
  HeadingComponent,
  HeadingOwnProps,
  HeadingProps,
} from './components/Heading';
export type { TextComponent, TextOwnProps, TextProps } from './components/Text';
export type { LinkComponent, LinkOwnProps, LinkProps } from './components/Link';
export type { BlockquoteProps } from './components/Blockquote';
export type {
  UnorderedListComponent,
  UnorderedListOwnProps,
  UnorderedListProps,
} from './components/UnorderedList';
export type {
  NumberedListComponent,
  NumberedListOwnProps,
  NumberedListProps,
} from './components/NumberedList';
export type {
  ListItemComponent,
  ListItemOwnProps,
  ListItemProps,
} from './components/ListItem';

export type {
  TypographyHeadingVariant,
  TypographyTextVariant,
  TypographySize,
  TypographyWeight,
  TypographySpacing,
} from './types';
