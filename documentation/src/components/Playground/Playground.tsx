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
import { componentColors } from '@entur/tokens';
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

import theme from './themeForPlayground';

import './Playground.scss';

type PlaygroundProps = {
  children: React.ReactNode;
  language?: Language;
  props?: AdvancedProps[];
  style?: React.CSSProperties;
  defaultContrast?: boolean;
  defaultDarkMode?: boolean;
  defaultShowEditor?: boolean;
  hideContrastOption?: boolean;
  code: string;
  scope: Record<string, any>;
};

export const Playground: React.FC<PlaygroundProps> = ({
  code,
  scope,
  language = 'jsx',
  props,
  style,
  defaultContrast = false,
  defaultDarkMode = false,
  defaultShowEditor = false,
  hideContrastOption = false,
}) => {
  const [isContrast, setContrast] = useState(defaultContrast);
  const [darkMode, setDarkMode] = useState(defaultDarkMode);
  const [isShowingEditor, setShowingEditor] = useState(defaultShowEditor);

  const {
    codeWithUpdatedProps,
    setCodeWithUpdatedProps,
    propsState,
    updatePropState,
    componentName,
  } = useAdvancedPlaygroundCode(code, props);

  // TODO Gatsby 5- sjekk om darkmode fungerer når vi har lagt inn alle fargevariabler
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleContrast = () => {
    setContrast(!isContrast);
  };

  const Element = isContrast ? Contrast : 'div';

  // Icons need to be included in scope to be accessible in LivePreview
  const icons = { AdjustmentsIcon, BellIcon, DestinationIcon };
  const finalScope = { ...scope, ...icons };

  return (
    <LiveProvider
      code={codeWithUpdatedProps}
      scope={finalScope}
      language={language}
      transformCode={wrapCodeInFragmentIfNecessary}
      // @ts-expect-error No types for theme exists
      theme={theme}
      className="playground"
    >
      <div className="playground__header">
        {!hideContrastOption && (
          <div className="playground__contrast-switch">
            <Label>Velg color-mode:</Label>
            <div className="playground__contrast-switch-container">
              <Switch checked={isContrast} onChange={toggleContrast}>
                Kontrast
              </Switch>
              <Switch checked={darkMode} onChange={toggleDarkMode}>
                Dark
              </Switch>
            </div>
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
          style={{
            background: !isContrast
              ? darkMode
                ? componentColors.dark.designentur.playground.background
                : componentColors.light.designentur.playground.background
              : 'revert-layer',
          }}
          data-color-mode={darkMode ? 'dark' : 'light'}
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
