import { warnAboutMissingStyles } from '@entur/utils';
import './index.scss';
warnAboutMissingStyles('typography');

export { BaseHeading } from './BaseHeading';
export { Blockquote, BlockquoteFooter } from './Blockquote';
export { CodeText } from './CodeText';
export { EmphasizedText } from './EmphasizedText';
export { Heading1 } from './Heading1';
export { Heading2 } from './Heading2';
export { Heading3 } from './Heading3';
export { Heading4 } from './Heading4';
export { Heading5 } from './Heading5';
export { Heading6 } from './Heading6';
export { Label } from './Label';
export { LeadParagraph } from './LeadParagraph';
export { Link } from './Link';
export { ListItem } from './ListItem';
export { NumberedList } from './NumberedList';
export { Paragraph } from './Paragraph';
export { PreformattedText } from './PreformattedText';
export { SmallText } from './SmallText';
export { StrongText } from './StrongText';
export { SubLabel } from './SubLabel';
export { SubParagraph } from './SubParagraph';
export { UnorderedList } from './UnorderedList';

export type { BaseHeadingProps } from './BaseHeading';
export type { CodeTextOwnProps, CodeTextProps } from './CodeText';
export type {
  EmphasizedTextOwnProps,
  EmphasizedTextProps,
} from './EmphasizedText';
export type { Heading1OwnProps, Heading1Props } from './Heading1';
export type { Heading2OwnProps, Heading2Props } from './Heading2';
export type { Heading3OwnProps, Heading3Props } from './Heading3';
export type { Heading4OwnProps, Heading4Props } from './Heading4';
export type { Heading5OwnProps, Heading5Props } from './Heading5';
export type { Heading6OwnProps, Heading6Props } from './Heading6';
export type { LabelOwnProps, LabelProps } from './Label';
export type {
  LeadParagraphOwnProps,
  LeadParagraphProps,
} from './LeadParagraph';
export type { LinkOwnProps, LinkProps } from './Link';
export type { ListItemProps } from './ListItem';
export type { NumberedListProps } from './NumberedList';
export type { ParagraphOwnProps, ParagraphProps } from './Paragraph';
export type {
  PreformattedTextOwnProps,
  PreformattedTextProps,
} from './PreformattedText';
export type { SmallTextOwnProps, SmallTextProps } from './SmallText';
export type { StrongTextOwnProps, StrongTextProps } from './StrongText';
export type { SubLabelOwnProps, SubLabelProps } from './SubLabel';
export type { SubParagraphOwnProps, SubParagraphProps } from './SubParagraph';
export type { UnorderedListProps } from './UnorderedList';
