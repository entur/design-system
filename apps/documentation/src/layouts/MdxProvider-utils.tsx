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
  Heading,
  Text,
  Link,
  UnorderedList,
  NumberedList,
  ListItem,
} from '@entur/typography/beta';
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
import { CodeBlock } from '@components/Codeblock/CodeBlock';

const preToCodeBlock = (preProps: any) => {
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
  // DS components - using new beta components
  h1: (props: any) => <Heading as="h1" variant="title-1" {...props} />,
  h2: (props: any) => <Heading as="h2" variant="title-2" {...props} />,
  h3: (props: any) => <Heading as="h3" variant="subtitle-1" {...props} />,
  h4: (props: any) => <Heading as="h4" variant="subtitle-2" {...props} />,
  h5: (props: any) => <Heading as="h5" variant="section-1" {...props} />,
  h6: (props: any) => <Heading as="h6" variant="section-2" {...props} />,
  p: (props: any) => <Text variant="paragraph" {...props} />,
  a: (props: any) => <Link {...props} />,
  strong: (props: any) => (
    <Text as="strong" variant="emphasized" weight="semibold" {...props} />
  ),
  inlineCode: (props: any) => <Text as="code" variant="code" {...props} />,
  ul: (props: any) => <UnorderedList {...props} />,
  li: (props: any) => <ListItem {...props} />,
  ol: (props: any) => <NumberedList {...props} />,
  // Individual component mappings
  Paragraph: (props: any) => <Text variant="paragraph" {...props} />,
  StrongText: (props: any) => (
    <Text as="strong" variant="emphasized" weight="semibold" {...props} />
  ),
  EmphasizedText: (props: any) => <Text variant="emphasized" {...props} />,
  UnorderedList: (props: any) => <UnorderedList {...props} />,
  ListItem: (props: any) => <ListItem {...props} />,
  NumberedList: (props: any) => <NumberedList {...props} />,
  GridContainer,
  GridItem,
  Heading1: (props: any) => <Heading as="h1" variant="title-1" {...props} />,
  Heading2: (props: any) => <Heading as="h2" variant="title-2" {...props} />,
  Heading3: (props: any) => <Heading as="h3" variant="subtitle-1" {...props} />,
  Heading4: (props: any) => <Heading as="h4" variant="subtitle-2" {...props} />,
  Heading5: (props: any) => <Heading as="h5" variant="section-1" {...props} />,
  Heading6: (props: any) => <Heading as="h6" variant="section-2" {...props} />,
  LinkText: (props: any) => <Link {...props} />,
  LeadParagraph: (props: any) => <Text variant="lead" {...props} />,
  SubParagraph: (props: any) => <Text variant="small" {...props} />,
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
  Label: (props: any) => <Text variant="label" {...props} />,
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
  CodeText: (props: any) => <Text as="code" variant="code-text" {...props} />,
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
  pre: (preProps: any) => {
    const props = preToCodeBlock(preProps);
    if (props) {
      if (props.language === 'jsx') {
        return <Playground code={props.codeString} language={props.language} />;
      } else {
        return <Text as="pre" variant="preformatted-text" {...preProps} />;
      }
    }
    return <Text as="pre" variant="preformatted-text" {...preProps} />;
  },
  code: (props: any) => {
    const { className } = props;
    if (className) {
      return <code {...props} />;
    }
    return <Text as="code" variant="code-text" {...props} />;
  },
  CodeBlock,
};

export default components;
