import React, { useState } from 'react';
import { Language } from 'prism-react-renderer';
import { LiveProvider, LivePreview, LiveEditor, LiveError } from 'react-live';

import classNames from 'classnames';

import {
  AdvancedProps,
  useAdvancedPlaygroundCode,
  wrapCodeInFragmentIfNecessary,
} from './playground-utils';
import PropsList from './PropsList';
import theme from './themeForPlayground';

import { Heading5, Label } from '@entur/typography';
import { Switch } from '@entur/form';
import { Contrast } from '@entur/layout';
import { SecondarySquareButton } from '@entur/button';
import { BaseExpand } from '@entur/expand';
import { ConditionalWrapper } from '@entur/utils';
import { componentColors } from '@entur/tokens';
import { SourceCodeIcon } from '@entur/icons';
import { packages } from './packages-scope';
import './Playground.scss';

type PlaygroundProps = {
  children?: React.ReactNode;
  language?: Language;
  props?: AdvancedProps[];
  style?: React.CSSProperties;
  defaultContrast?: boolean;
  defaultDarkMode?: boolean;
  defaultShowEditor?: boolean;
  hideContrastOption?: boolean;
  code: string;
  scope?: Record<string, any>;
};
const Playground: React.FC<PlaygroundProps> = ({
  code,
  scope = {},
  language = 'jsx',
  props,
  style,
  defaultContrast = false,
  defaultDarkMode = false,
  defaultShowEditor = false,
  hideContrastOption = false,
}) => {
  const [isContrast, setContrast] = useState(defaultContrast);
  const [darkMode, setdarkMode] = useState(defaultDarkMode);
  const [isShowingEditor, setShowingEditor] = useState(defaultShowEditor);

  const {
    codeWithUpdatedProps,
    setCodeWithUpdatedProps,
    propsState,
    updatePropState,
    componentName,
  } = useAdvancedPlaygroundCode(code, props);

  const toggledarkMode = () => {
    setdarkMode(!darkMode);
  };

  const toggleContrast = () => {
    setContrast(!isContrast);
  };

  const Element = isContrast ? Contrast : 'div';

  const finalScope = { ...packages, ...scope };

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
            <Label>Velg fargemode:</Label>
            <div className="playground__contrast-switch-container">
              <Switch checked={isContrast} onChange={toggleContrast}>
                Kontrast
              </Switch>
              <Switch checked={darkMode} onChange={toggledarkMode}>
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
export default Playground;
