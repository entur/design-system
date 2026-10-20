import * as React from 'react';
import Props from '@components/Props/Props';
import Playground from '@components/Playground/Playground';
import { DoDontCard, DoDontGroup } from '@components/Cards/DoDont';
import BaseCardDesignEntur from '@components/Cards/BaseCardDesignEntur';
import { ImageDisplay } from '@components/Media/ImageDisplay';
import { ImportStatement } from '@components/Common/ImportStatement';
import { IconButton, PrimaryButton, SecondaryButton } from '@entur/button';
import {
  Checkbox,
  Radio,
  RadioGroup,
  SegmentedChoice,
  SegmentedControl,
  TextArea,
  TextField,
} from '@entur/form';
import {
  Heading,
  Label,
  Link,
  ListItem,
  NumberedList,
  Text,
  TextContainer,
  UnorderedList,
} from '@entur/typography/beta';
import { HeadingAnchor } from '@components/sanity/HeadingAnchor';
import { DocH2, DocH3, DocH4, DocH5 } from '@components/Common/DocHeadings';

import {
  DataCell,
  EditableCell,
  ExpandRowButton,
  ExpandableRow,
  HeaderCell,
  Table,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
} from '@entur/table';
import { VisuallyHidden } from '@entur/a11y';
import { ExpandablePanel } from '@entur/expand';
import { GridContainer, GridItem } from '@entur/grid';
import {
  BannerAlertBox,
  CopyableText,
  SmallAlertBox,
  SmallExpandableAlertBox,
  ToastAlertBox,
  ToastProvider,
} from '@entur/alert';
import {
  Badge,
  BulletBadge,
  NotificationBadge,
  StatusBadge,
} from '@entur/layout';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@entur/tab';
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
// oxlint-disable eslint-plugin-jsx-a11y(heading-has-content)
const components = {
  // MDX passes the page props to the wrapper; only the content goes in
  wrapper: ({ children }: any) => <TextContainer>{children}</TextContainer>,
  // DS components - using new beta components
  h1: (props: any) => <Heading as="h1" variant="title-1" {...props} />,
  h2: ({ id, children }: any) => (
    <HeadingAnchor headingId={id} HeadingComponent={DocH2}>
      {children}
    </HeadingAnchor>
  ),
  h3: ({ id, children }: any) => (
    <HeadingAnchor headingId={id} HeadingComponent={DocH3}>
      {children}
    </HeadingAnchor>
  ),
  h4: ({ id, children }: any) => (
    <HeadingAnchor headingId={id} HeadingComponent={DocH4}>
      {children}
    </HeadingAnchor>
  ),
  h5: ({ id, children }: any) => (
    <HeadingAnchor headingId={id} HeadingComponent={DocH5}>
      {children}
    </HeadingAnchor>
  ),
  h6: (props: any) => <Heading as="h6" variant="section-2" {...props} />,
  p: Text,
  a: Link,
  strong: (props: any) => <Text as="strong" weight="bold" {...props} />,
  ul: UnorderedList,
  li: ListItem,
  ol: NumberedList,
  // Typography for JSX in MDX
  Heading,
  Text,
  Link,
  Label,
  TextContainer,
  UnorderedList,
  ListItem,
  NumberedList,
  GridContainer,
  GridItem,
  BannerAlertBox: (props: any) => (
    <BannerAlertBox style={{ marginBlock: '2rem' }} {...props} />
  ),
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
  // Markdown/GFM table syntax renders these lowercase HTML tags — map them to
  // the same design system components used by the capitalized JSX above.
  table: Table,
  thead: TableHead,
  tbody: TableBody,
  tr: TableRow,
  th: HeaderCell,
  td: DataCell,
  ToastAlertBox,
  ToastProvider,
  SmallAlertBox: (props: any) => (
    <SmallAlertBox style={{ marginBlock: '2rem' }} {...props} />
  ),
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
  // Custom components
  Playground,
  Props,
  DoDontGroup,
  DoDontCard,
  BaseCardDesignEntur,
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
        return (
          <CodeBlock
            language={props.language ?? 'js'}
            hideLineNumbers
            wrapLongLines={false}
          >
            {props.codeString}
          </CodeBlock>
        );
      }
    }
    return <Text as="pre" variant="preformatted" {...preProps} />;
  },
  code: (props: any) => {
    const { className } = props;
    if (className) {
      return <code {...props} />;
    }
    return <Text variant="code" {...props} />;
  },
  CodeBlock,
};
// oxlint-enable eslint-plugin-jsx-a11y(heading-has-content)

export default components;
