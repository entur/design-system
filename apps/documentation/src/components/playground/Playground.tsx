import React from 'react';
import { Language } from 'prism-react-renderer';
import { LiveProvider, LivePreview, LiveEditor } from 'react-live';
import classNames from 'classnames';

import { Label } from '@entur/typography';
import { Switch } from '@entur/form';
import { Contrast } from '@entur/layout';
import { SecondarySquareButton } from '@entur/button';
import { BaseExpand } from '@entur/expand';
import { SourceCodeIcon } from '@entur/icons';

import { AdvancedPlayground } from './AdvancedPlayground';
import {
  AdvancedProps,
  wrapCodeInFragmentIfNecessary,
} from './playground-utils';
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
  __code,
  __scope,
  language = 'jsx',
  props,
  style,
  defaultContrast = false,
  defaultShowEditor = false,
  hideContrastOption = false,
}) => {
  const [isContrast, setContrast] = React.useState(defaultContrast);
  const [isShowingEditor, setShowingEditor] = React.useState(defaultShowEditor);

  const Element = isContrast ? Contrast : 'div';

  if (props) {
    return (
      <AdvancedPlayground
        code={__code}
        scope={__scope}
        props={props}
        style={style}
      />
    );
  }
  return (
    <LiveProvider
      code={__code}
      scope={__scope}
      language={language}
      transformCode={wrapCodeInFragmentIfNecessary}
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
};
