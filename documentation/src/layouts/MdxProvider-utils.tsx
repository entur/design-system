import * as React from 'react';
import Playground from '../components/Playground/Playground';

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

// These components are used in the MDXProvider in the DocLayout file.
// We will not have to import these components in every MDX file.

const components = {
  pre: preProps => {
    const props = preToCodeBlock(preProps);
    if (props) {
      return <Playground code={props.codeString} language={props.language} />;
    } else {
      return <pre {...preProps} />;
    }
  },

  Playground,
};
export default components;
