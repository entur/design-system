import React from 'react';
import { CopyableText } from '@entur/alert';
import { Heading3 } from '@entur/typography';
import { CodeBlock } from '@components/Codeblock/CodeBlock';
import Playground from '@components/Playground/Playground';

// Import all props files dynamically
import * as buttonProps from '@data/props/button-props';
import * as feedbackProps from '@data/props/feedback-props';
import * as layoutProps from '@data/props/layout-props';
import * as navigationProps from '@data/props/navigation-props';
import * as skjemaProps from '@data/props/skjema-props';
import * as travelProps from '@data/props/travel-props';

type CopyableTextField = {
  text: string;
  successMessage?: string;
};

type CodeContentField =
  | {
      code: string;
      language?: string;
    }
  | string;

type CodeExampleType = {
  title?: string;
  codeDisplayType: 'playground' | 'plain' | 'copyable';
  playgroundCode?: CodeContentField;
  playgroundProps?: string;
  plainCode?: CodeContentField;
  codeLanguage?: string;
  componentName?: string;
  copyableText?: CopyableTextField;
};

// Props mapping object
const propsMapping: Record<string, any> = {
  standardknapper: buttonProps.standardknapper,
  flytendeknapper: buttonProps.flytendeknapper,
  banner: feedbackProps.banner,
  badgeprops: feedbackProps.badgeprops,
  cards: layoutProps.cards,
  topnavigation: navigationProps.topnavigation,
  textfield: skjemaProps.textfield,
  textarea: skjemaProps.textarea,
  inputpanel: skjemaProps.inputpanel,
  traveltag: travelProps.traveltag,
  travelswitch: travelProps.travelswitch,
  travelleg: travelProps.travelleg,
  travelheader: travelProps.travelheader,
};

type Props = {
  value: CodeExampleType;
};

export const CodeExampleResolver = ({ value }: Props) => {
  const {
    title,
    codeDisplayType,
    playgroundCode,
    playgroundProps,
    plainCode,
    codeLanguage,
    componentName = 'Component',
    copyableText,
  } = value;

  // Get the correct props based on playgroundProps field
  // If playgroundProps is empty string or undefined, pass undefined (no props)
  const selectedProps =
    playgroundProps && playgroundProps !== ''
      ? propsMapping[playgroundProps]
      : undefined;

  const fallbackSnippet = `<${componentName}></${componentName}>`;

  const resolvedPlaygroundCode =
    typeof playgroundCode === 'string'
      ? playgroundCode || fallbackSnippet
      : playgroundCode?.code || fallbackSnippet;

  const resolvedPlainCode =
    typeof plainCode === 'string'
      ? plainCode || fallbackSnippet
      : plainCode?.code || fallbackSnippet;

  const resolvedLanguage =
    typeof plainCode === 'string'
      ? codeLanguage || 'jsx'
      : plainCode?.language || codeLanguage || 'jsx';

  return (
    <div style={{ margin: '2rem 0' }}>
      {title && <Heading3>{title}</Heading3>}

      {codeDisplayType === 'playground' ? (
        <Playground
          props={selectedProps as any}
          code={resolvedPlaygroundCode}
        />
      ) : codeDisplayType === 'copyable' && copyableText ? (
        <CopyableText
          textToCopy={copyableText.text}
          successMessage={copyableText.successMessage}
        >
          {copyableText.text}
        </CopyableText>
      ) : (
        <CodeBlock language={resolvedLanguage} wrapLongLines>
          {resolvedPlainCode}
        </CodeBlock>
      )}
    </div>
  );
};
