import * as React from 'react';
import Props from '@components/Props/Props';
import Playground from '@components/Playground/Playground';
import { DoDontGroup, DoDontCard } from '@components/Cards/DoDont';
import BaseCardDesignEntur from '@components/Cards/BaseCardDesignEntur';
import PageHeader from '@components/PageHeader/PageHeader';
import { ImageDisplay } from '@components/Media/ImageDisplay';
import { ImportStatement } from '@components/Common/ImportStatement';
import { PrimaryButton, SecondaryButton, IconButton } from '@entur/button';
import {
  TextField,
  TextArea,
  Checkbox,
  Radio,
  RadioGroup,
  SegmentedChoice,
  SegmentedControl,
} from '@entur/form';
import {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  LeadParagraph,
  SubParagraph,
  Paragraph,
  PreformattedText,
  StrongText,
  CodeText,
  UnorderedList,
  ListItem,
  NumberedList,
  EmphasizedText,
  Label,
  Link as LinkText,
} from '@entur/typography';
import {
  Table,
  TableHead,
  TableBody,
  TableFooter,
  TableRow,
  HeaderCell,
  DataCell,
  EditableCell,
  ExpandableRow,
  ExpandRowButton,
} from '@entur/table';
import { VisuallyHidden } from '@entur/a11y';
import { ExpandablePanel } from '@entur/expand';
import { GridItem, GridContainer } from '@entur/grid';
import {
  BannerAlertBox,
  ToastAlertBox,
  ToastProvider,
  SmallAlertBox,
  SmallExpandableAlertBox,
  CopyableText,
} from '@entur/alert';
import {
  Badge,
  NotificationBadge,
  StatusBadge,
  BulletBadge,
} from '@entur/layout';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@entur/tab';

const preToCodeBlock = preProps => {
  if (
    preProps.children &&
    typeof preProps.children === 'object' &&
    preProps.children.props
  ) {
    const { className = '', children } = preProps.children.props;

    const codeString = Array.isArray(children) ? children.join('') : children;

    if (!codeString || typeof codeString !== 'string') {
      console.warn('Unexpected code block structure:', preProps.children);
      return undefined;
    }

    // Extract language, supporting both "language-jsx" and "jsx" formats
    const language = className.startsWith('language-')
      ? className.replace('language-', '')
      : className;

    return {
      codeString: codeString.trim(),
      language,
    };
  }

  return undefined;
};
// Mapping styles and global import components for MDX-files
// components are used in the MDXProvider in the DocLayout file.
const components = {
  // DS components
  h1: Heading1,
  h2: Heading2,
  h3: Heading3,
  h4: Heading4,
  h5: Heading5,
  h6: Heading6,
  p: Paragraph,
  a: LinkText,
  strong: StrongText,
  inlineCode: CodeText,
  ul: UnorderedList,
  li: ListItem,
  ol: NumberedList,
  Paragraph,
  StrongText,
  EmphasizedText,
  UnorderedList,
  ListItem,
  NumberedList,
  GridContainer,
  GridItem,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  LinkText,
  LeadParagraph,
  SubParagraph,
  BannerAlertBox,
  ExpandablePanel,
  VisuallyHidden,
  Table,
  TableHead,
  TableRow,
  HeaderCell,
  TableFooter,
  DataCell,
  TableBody,
  EditableCell,
  ExpandableRow,
  ExpandRowButton,
  Label,
  ToastAlertBox,
  ToastProvider,
  SmallAlertBox,
  SmallExpandableAlertBox,
  PrimaryButton,
  SecondaryButton,
  Badge,
  NotificationBadge,
  StatusBadge,
  BulletBadge,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  TextField,
  TextArea,
  CopyableText,
  CodeText,
  // Custom components
  Playground,
  Props,
  DoDontGroup,
  DoDontCard,
  BaseCardDesignEntur,
  PageHeader,
  ImageDisplay,
  Checkbox,
  Radio,
  RadioGroup,
  SegmentedChoice,
  SegmentedControl,
  IconButton,
  ImportStatement,
  pre: preProps => {
    const props = preToCodeBlock(preProps);
    if (props) {
      if (props.language === 'jsx') {
        return <Playground code={props.codeString} language={props.language} />;
      } else {
        return <PreformattedText {...preProps} />;
      }
    }
    return <PreformattedText {...preProps} />;
  },
  code: props => {
    const { className } = props;
    if (className) {
      return <code {...props} />;
    }
    return <CodeText {...props} />;
  },
};

export default components;
