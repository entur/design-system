import React, { useState } from 'react';
import { Language } from 'prism-react-renderer';
import { LiveEditor, LiveError, LivePreview, LiveProvider } from 'react-live';
import classNames from 'classnames';

import { IconButton } from '@entur/button';
import { BaseExpand } from '@entur/expand';
import { SegmentedChoice, SegmentedControl } from '@entur/form';
import { SourceCodeIcon } from '@entur/icons';
import { Contrast } from '@entur/layout';
import { Flex } from '@entur/layout/beta';
import { componentColors } from '@entur/tokens';
import { Heading5 } from '@entur/typography';
import { Heading } from '@entur/typography/beta';
import { ConditionalWrapper } from '@entur/utils';
import { useSettings } from '@providers/SettingsContext';

import {
  InitialAdvancedProp,
  useAdvancedPlaygroundCode,
  wrapCodeInFragmentIfNecessary,
} from './playground-utils';
import PropsList from './PropsList';
import theme from './themeForPlayground';
import { packages } from './packages-scope';
import { documentationComponents } from './documentation-scope';

import './Playground.scss';

type PlaygroundProps = {
  children?: React.ReactNode;
  language?: Language;
  props?: InitialAdvancedProp[];
  style?: React.CSSProperties;
  title?: string;
  defaultContrast?: boolean;
  defaultDarkMode?: boolean;
  defaultShowEditor?: boolean;
  hideColorModeOption?: boolean;
  hideCode?: boolean;
  code: string;
  scope?: Record<string, any>;
  /** Render the preview scaled down inside a 16:9 frame. E.g. 0.5 = half size. */
  previewScale?: number;
  /** Additional CSS properties applied to the live-preview container element. */
  containerStyle?: React.CSSProperties;
};

const Playground: React.FC<PlaygroundProps> = ({
  code,
  scope = {},
  language = 'jsx',
  props,
  style,
  title,
  defaultContrast = false,
  defaultDarkMode = false,
  defaultShowEditor = false,
  hideColorModeOption = false,
  hideCode = false,
  previewScale,
  containerStyle,
}) => {
  const { resolvedColorMode } = useSettings();
  const initialColorMode = defaultContrast
    ? 'contrast'
    : defaultDarkMode
    ? 'dark'
    : resolvedColorMode;
  const [colorMode, setColorMode] = useState<'light' | 'dark' | 'contrast'>(
    initialColorMode,
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

  const finalScope = { ...packages, ...documentationComponents, ...scope };

  const scaledPreviewStyle: React.CSSProperties | undefined = previewScale
    ? {
        position: 'absolute',
        top: 0,
        left: 0,
        width: `${100 / previewScale}%`,
        height: `${100 / previewScale}%`,
        transform: `scale(${previewScale})`,
        transformOrigin: 'top left',
        padding: 0,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        overflow: 'hidden',
      }
    : undefined;

  return (
    <LiveProvider
      code={codeWithUpdatedProps}
      scope={finalScope}
      language={language}
      transformCode={wrapCodeInFragmentIfNecessary}
      theme={theme}
    >
      <div className="playground__header">
        <Flex direction="column" gap="none" justify="center">
          {title && (
            <Heading as="h3" size="lg" spacing="none">
              {title}
            </Heading>
          )}
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
        </Flex>
        {!hideCode && !defaultShowEditor && (
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
            'playground__live-preview-container--scaled': previewScale,
          })}
          style={{
            ...(hideColorModeOption
              ? undefined
              : {
                  background:
                    colorMode === 'dark'
                      ? componentColors.dark.designentur.playground.background
                      : colorMode === 'light'
                      ? componentColors.light.designentur.playground.background
                      : 'revert-layer',
                }),
            ...containerStyle,
          }}
          data-color-mode={
            hideColorModeOption
              ? undefined
              : colorMode === 'dark'
              ? 'dark'
              : 'light'
          }
        >
          <LivePreview
            className="playground__live-preview"
            style={scaledPreviewStyle ?? style}
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
