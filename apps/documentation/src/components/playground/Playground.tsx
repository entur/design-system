import React from 'react';
import { Language } from 'prism-react-renderer';
import { LiveProvider, LivePreview, LiveEditor } from 'react-live';
import classNames from 'classnames';

import { Label } from '@entur/typography';
import { Switch } from '@entur/form';
import { Contrast } from '@entur/layout';
import { SecondarySquareButton } from '@entur/button';
import { BaseExpand } from '@entur/expand/src';
import { SourceCodeIcon } from '@entur/icons/dist';

import theme from './themeForPlayground';
import { AdvancedPlayground } from './AdvancedPlayground';

import './Playground.scss';

type PlaygroundProps = {
  defaultContrast?: boolean;
  defaultShowEditor?: boolean;
  hideContrastOption?: boolean;
  children: React.ReactNode;
  language?: Language;
  style?: React.CSSProperties;
  // These props are injected by MDX
  __code: string;
  __scope: Record<string, any>;
  [key: string]: any;
};

export const Playground: React.FC<PlaygroundProps> = ({
  defaultContrast = false,
  defaultShowEditor = false,
  hideContrastOption = false,
  style,
  __code,
  __scope,
  language = 'jsx',
  advanced = false,
  props,
}) => {
  const [isContrast, setContrast] = React.useState(defaultContrast);
  const [isShowingEditor, setShowingEditor] = React.useState(defaultShowEditor);

  // Borrowed from docz
  const transformCode = (codeToTransform: string) => {
    if (codeToTransform.startsWith('()') || codeToTransform.startsWith('class'))
      return codeToTransform;
    return `<React.Fragment>${codeToTransform}</React.Fragment>`;
  };

  const Element = isContrast ? Contrast : 'div';

  if (!advanced) {
    return (
      <LiveProvider
        code={__code}
        scope={__scope}
        language={language}
        transformCode={transformCode}
        theme={theme}
      >
        <div style={{ display: 'flex', marginTop: '1rem' }}>
          {!hideContrastOption && (
            <div className="playground__contrast-switch">
              <Label as="span">Kontrast</Label>
              <Switch
                checked={isContrast}
                onChange={() => setContrast(prev => !prev)}
              ></Switch>
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
        <Element
          className={classNames('playground', {
            'playground--open': isShowingEditor,
          })}
        >
          <LivePreview style={{ ...style }} />
        </Element>
        <BaseExpand open={isShowingEditor}>
          <LiveEditor
            style={{ overflowX: 'scroll' }}
            className="playground__editor"
          />
        </BaseExpand>
      </LiveProvider>
    );
  } else {
    return (
      <AdvancedPlayground
        code={__code}
        scope={__scope}
        props={props}
        style={style}
      />
    );
  }
};
