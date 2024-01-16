import React, { useState } from 'react';
import { Language } from 'prism-react-renderer';
import { LiveProvider, LivePreview, LiveEditor, LiveError } from 'react-live';
import classNames from 'classnames';

import { Heading5, Label } from '@entur/typography';
import { Switch } from '@entur/form';
import { Contrast } from '@entur/layout';
import { SecondarySquareButton } from '@entur/button';
import { BaseExpand } from '@entur/expand';
import { ConditionalWrapper } from '@entur/utils';
import {
  AdjustmentsIcon,
  BellIcon,
  DestinationIcon,
  SourceCodeIcon,
} from '@entur/icons';

import {
  AdvancedProps,
  useAdvancedPlaygroundCode,
  wrapCodeInFragmentIfNecessary,
} from './playground-utils';
import { PropsList } from './PropsList';
// @ts-expect-error No types for theme exists
import theme from './themeForPlayground';

import './Playground.scss';

type PlaygroundProps = {
  children: React.ReactNode;
  language?: Language;
  props?: AdvancedProps[];
  style?: React.CSSProperties;
  defaultContrast?: boolean;
  defaultShowEditor?: boolean;
  hideContrastOption?: boolean;
  // These props are injected by MDX
  __code: string;
  __scope: Record<string, any>;
};

export const Playground: React.FC<PlaygroundProps> = ({
  __code: codeFromMDXInjection,
  __scope: scopeFromMDXInjection,
  language = 'jsx',
  props,
  style,
  defaultContrast = false,
  defaultShowEditor = false,
  hideContrastOption = false,
}) => {
  const [isContrast, setContrast] = useState(defaultContrast);
  const [isShowingEditor, setShowingEditor] = useState(defaultShowEditor);

  const {
    codeWithUpdatedProps,
    setCodeWithUpdatedProps,
    propsState,
    updatePropState,
    componentName,
  } = useAdvancedPlaygroundCode(codeFromMDXInjection, props);

  const Element = isContrast ? Contrast : 'div';

  // Icons need to be included in scope to be accessible in LivePreview
  const icons = { AdjustmentsIcon, BellIcon, DestinationIcon };

  // Different code and scope if props selector panel is available
  const code = codeWithUpdatedProps;
  const scope = propsState
    ? { ...scopeFromMDXInjection, ...icons }
    : scopeFromMDXInjection;

  return (
    <LiveProvider
      code={code}
      scope={scope}
      language={language}
      transformCode={wrapCodeInFragmentIfNecessary}
      theme={theme}
      className="playground"
    >
      <div className="playground__header">
        {!hideContrastOption && (
          <div className="playground__contrast-switch">
            <Label as="span">Kontrast</Label>
            <Switch
              checked={isContrast}
              onChange={() => setContrast(prev => !prev)}
            />
          </div>
        )}
        {!defaultShowEditor && (
          <SecondarySquareButton
            className="playground__code-button"
            onClick={() => setShowingEditor(prev => !prev)}
          >
            {isShowingEditor ? 'Skjul kode' : 'Vis kode'} <SourceCodeIcon />
          </SecondarySquareButton>
        )}
      </div>
      <ConditionalWrapper
        condition={propsState !== undefined}
        wrapper={(children: React.ReactNode) => (
          <div className="playground__live-preview-and-props-wrapper">
            {children}
          </div>
        )}
      >
        <Element
          className={classNames('playground__live-preview-container', {
            'playground__live-preview-container--code-closed': !isShowingEditor,
          })}
        >
          <LivePreview
            className="playground__live-preview"
            style={{ ...style }}
          />
          <LiveError className="playground__live-preview" />
        </Element>
        {propsState !== undefined && (
          <div className="playground__props-selector">
            <Heading5 as="h2" margin="bottom" style={{ height: '2rem' }}>
              {`${componentName}-props`}
            </Heading5>
            <PropsList
              propsState={propsState}
              updatePropState={updatePropState}
            />
          </div>
        )}
      </ConditionalWrapper>
      <BaseExpand open={isShowingEditor}>
        <LiveEditor
          className="playground__editor"
          onChange={updatedCode => setCodeWithUpdatedProps(updatedCode)}
          tabMode="focus"
        />
      </BaseExpand>
    </LiveProvider>
  );
};
