import React, { useState } from 'react';
import { Language } from 'prism-react-renderer';
import { LiveProvider, LivePreview, LiveEditor, LiveError } from 'react-live';
import classNames from 'classnames';

import { IconButton } from '@entur/button';
import { BaseExpand } from '@entur/expand';
import { SegmentedChoice, SegmentedControl } from '@entur/form';
import { SourceCodeIcon } from '@entur/icons';
import { Contrast } from '@entur/layout';
import { componentColors } from '@entur/tokens';
import { Heading5 } from '@entur/typography';
import { ConditionalWrapper } from '@entur/utils';

import {
  AdvancedProps,
  useAdvancedPlaygroundCode,
  wrapCodeInFragmentIfNecessary,
} from './playground-utils';
import PropsList from './PropsList';
import theme from './themeForPlayground';
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
  hideColorModeOption?: boolean;
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
  hideColorModeOption = false,
}) => {
  const [colorMode, setColorMode] = useState<'light' | 'dark' | 'contrast'>(
    defaultContrast ? 'contrast' : defaultDarkMode ? 'dark' : 'light',
  );
  const [isShowingEditor, setShowingEditor] = useState(defaultShowEditor);

  const {
    codeWithUpdatedProps,
    setCodeWithUpdatedProps,
    propsState,
    updatePropState,
    componentName,
  } = useAdvancedPlaygroundCode(code, props);

  const Element = colorMode === 'contrast' ? Contrast : 'div';

  const finalScope = { ...packages, ...scope };

  return (
    <LiveProvider
      code={codeWithUpdatedProps}
      scope={finalScope}
      language={language}
      transformCode={wrapCodeInFragmentIfNecessary}
      theme={theme}
    >
      <div className="playground__header">
        {!hideColorModeOption && (
          <div className="playground__color-mode-select">
            <SegmentedControl
              label="Fargemodus"
              onChange={selectedValue =>
                setColorMode(selectedValue as 'light' | 'dark' | 'contrast')
              }
              selectedValue={colorMode}
            >
              <SegmentedChoice value="light">Standard</SegmentedChoice>
              <SegmentedChoice value="dark">Mørk</SegmentedChoice>
              <SegmentedChoice value="contrast">Kontrast</SegmentedChoice>
            </SegmentedControl>
          </div>
        )}
        {!defaultShowEditor && (
          <IconButton
            className="playground__code-button"
            onClick={() => setShowingEditor(prev => !prev)}
          >
            <SourceCodeIcon /> {isShowingEditor ? 'Skjul kode' : 'Vis kode'}
          </IconButton>
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
            background:
              colorMode === 'dark'
                ? componentColors.dark.designentur.playground.background
                : colorMode === 'light'
                ? componentColors.light.designentur.playground.background
                : 'revert-layer',
          }}
          data-color-mode={colorMode === 'dark' ? 'dark' : 'light'}
        >
          <LivePreview
            className="playground__live-preview"
            style={{ ...style }}
          />
          <LiveError className="playground__live-preview" />
        </Element>
        {propsState !== undefined && (
          <div className="playground__props-selector">
            <Heading5
              as="h2"
              margin="bottom"
              style={{
                height: '2rem',
                whiteSpace: 'nowrap',
              }}
            >
              {`${componentName}-props`}
            </Heading5>
            <PropsList
              propsState={propsState}
              updatePropState={updatePropState}
            />
          </div>
        )}
      </ConditionalWrapper>
      <BaseExpand open={isShowingEditor} className="playground__expandable">
        <LiveEditor
          className="playground__expandable__editor"
          onChange={updatedCode => setCodeWithUpdatedProps(updatedCode)}
          tabMode="focus"
        />
      </BaseExpand>
    </LiveProvider>
  );
};
export default Playground;
