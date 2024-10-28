import * as React from 'react';
import Props from '../components/Props/Props';
import Playground from '../components/Playground/Playground';

import {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Paragraph,
  PreformattedText,
  StrongText,
  CodeText,
  UnorderedList,
  ListItem,
  NumberedList,
  Link as LinkText,
} from '@entur/typography';

const preToCodeBlock = preProps => {
  if (
    preProps.children &&
    typeof preProps.children === 'object' &&
    preProps.children.props &&
    preProps.children.type === 'code'
  ) {
    const codeString = Array.isArray(preProps.children.props.children)
      ? preProps.children.props.children.join('')
      : preProps.children.props.children;

    if (!codeString || typeof codeString !== 'string') {
      console.warn('Unexpected code block structure:', preProps.children);
      return undefined;
    }

    const { className = '' } = preProps.children.props;

    return {
      codeString: codeString.trim(),
      language: className.split('-')[1] || '',
    };
  }

  return undefined;
};

// Mapping styles and global import components for MDX-files
// components are used in the MDXProvider in the DocLayout file.
const components = {
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
  Playground,
  Props,
  pre: preProps => {
    const props = preToCodeBlock(preProps);
    if (props) {
      return <Playground code={props.codeString} language={props.language} />;
    } else {
      return <PreformattedText {...preProps} />;
    }
  },
};

export default components;
