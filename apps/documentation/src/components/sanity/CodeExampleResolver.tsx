import React from 'react';
import { Heading3, PreformattedText } from '@entur/typography';
import Playground from '@components/Playground/Playground';

// Import all props files dynamically
import * as buttonProps from '@data/props/button-props';
import * as feedbackProps from '@data/props/feedback-props';
import * as layoutProps from '@data/props/layout-props';
import * as navigationProps from '@data/props/navigation-props';
import * as skjemaProps from '@data/props/skjema-props';
import * as travelProps from '@data/props/travel-props';

type CodeExampleType = {
  title?: string;
  codeDisplayType: 'playground' | 'plain';
  playgroundCode?: string;
  playgroundProps?: string;
  plainCode?: string;
  codeLanguage?: string;
  componentName?: string;
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
    codeLanguage = 'jsx',
    componentName = 'Component',
  } = value;

  // Get the correct props based on playgroundProps field
  // If playgroundProps is empty string or undefined, pass undefined (no props)
  const selectedProps =
    playgroundProps && playgroundProps !== ''
      ? propsMapping[playgroundProps]
      : undefined;

  return (
    <div style={{ margin: '2rem 0' }}>
      {title && <Heading3>{title}</Heading3>}

      {codeDisplayType === 'playground' ? (
        <Playground
          props={selectedProps as any}
          code={playgroundCode ?? `<${componentName}></${componentName}>`}
        />
      ) : (
        <PreformattedText>
          {plainCode || `<${componentName}></${componentName}>`}
        </PreformattedText>
      )}
    </div>
  );
};
