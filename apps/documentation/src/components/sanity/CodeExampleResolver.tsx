import React from 'react';
import { CopyableText } from '@entur/alert';
import { Heading3 } from '@entur/typography';
import { CodeBlock } from '@components/Codeblock/CodeBlock';
import Playground from '@components/Playground/Playground';
import { InitialAdvancedProp } from '@components/Playground/playground-utils';

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

type SanityPlaygroundProp = {
  name: string;
  type: 'icon' | 'boolean' | 'segmented' | 'string' | 'dropdown' | 'children';
  label?: string;
  defaultValue?: string;
  options?: string[];
};

type CodeExampleType = {
  title?: string;
  codeDisplayType: 'playground' | 'plain' | 'copyable';
  playgroundCode?: {
    code?: string;
    componentName?: string;
    props: SanityPlaygroundProp[];
    playgroundProps?: string;
    hideCode?: boolean;
  };
  playgroundProps?: string;
  plainCode?: CodeContentField;
  plainCodeCopyable?: boolean;
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

const convertSanityPropsToPlayground = (
  sanityProps: SanityPlaygroundProp[],
): InitialAdvancedProp[] => {
  return sanityProps.map(prop => {
    const getDefaultValue = () => {
      if (prop.type === 'boolean') {
        if (prop.defaultValue === 'false') return false;
        if (prop.defaultValue === 'true') return true;
      }

      return prop.defaultValue ?? '';
    };

    return {
      name: prop.name,
      type: prop.type,
      defaultValue: getDefaultValue(),
      label: prop.label,
      options: prop.options,
    };
  });
};

type CodeExampleProps = {
  value: CodeExampleType;
};

export const CodeExampleResolver = ({ value }: CodeExampleProps) => {
  const {
    title,
    codeDisplayType,
    playgroundCode,
    playgroundProps,
    plainCode,
    plainCodeCopyable,
    codeLanguage,
    componentName = 'Component',
    copyableText,
  } = value;

  // Determine which props to use: Sanity props take precedence over legacy props
  let selectedProps: InitialAdvancedProp[] | undefined;

  if (playgroundCode?.props && playgroundCode?.props?.length > 0) {
    selectedProps = convertSanityPropsToPlayground(playgroundCode.props);
  } else if (
    playgroundCode?.playgroundProps &&
    playgroundCode.playgroundProps !== ''
  ) {
    selectedProps = propsMapping[playgroundCode.playgroundProps];
  } else if (playgroundProps && playgroundProps !== '') {
    selectedProps = propsMapping[playgroundProps];
  }

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
    <div className="code-example">
      {title && codeDisplayType !== 'playground' && (
        <Heading3>{title}</Heading3>
      )}

      {codeDisplayType === 'playground' ? (
        <Playground
          props={selectedProps}
          code={resolvedPlaygroundCode}
          hideCode={playgroundCode?.hideCode}
          hideColorModeOption={(selectedProps?.length ?? 0) == 0}
          title={title}
        />
      ) : codeDisplayType === 'copyable' && copyableText ? (
        <CopyableText
          textToCopy={copyableText.text}
          successMessage={copyableText.successMessage}
        >
          {copyableText.text}
        </CopyableText>
      ) : (
        <CodeBlock
          language={resolvedLanguage}
          wrapLongLines
          copyable={plainCodeCopyable}
          hideLineNumbers
        >
          {resolvedPlainCode}
        </CodeBlock>
      )}
    </div>
  );
};
