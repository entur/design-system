import React from 'react';
import { Language } from 'prism-react-renderer';
import { LiveProvider, LivePreview, LiveEditor } from 'react-live';
import { Label } from '@entur/typography';
import { Switch } from '@entur/form';
import { BaseCard, Contrast } from '@entur/layout';
import prismTheme from '~/components/prism-theme';
import './Playground.scss';
import { BaseExpand } from '@entur/expand/src';
import { AdvancedPlayground } from './AdvancedPlayground';
import { Button } from '@entur/button';
import { SourceCodeIcon } from '@entur/icons/dist';

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

  const ConditionalWrapper = ({ condition, wrapper, children }: any) =>
    condition ? (
      wrapper(children)
    ) : (
      <div className="playground">{children}</div>
    );

  if (!advanced) {
    return (
      <LiveProvider
        code={__code}
        scope={__scope}
        language={language}
        transformCode={transformCode}
        theme={prismTheme}
      >
        <ConditionalWrapper
          condition={isContrast}
          wrapper={(children: React.ReactNode) => (
            <Contrast className="playground">{children}</Contrast>
          )}
        >
          {hideContrastOption ? (
            <div />
          ) : (
            <Switch
              checked={isContrast}
              onChange={() => setContrast(prev => !prev)}
              className="playground__contrast-switch"
            >
              <Label as="span">Kontrast</Label>
            </Switch>
          )}
          <LivePreview style={{ ...style }} />
        </ConditionalWrapper>
        <div className="playground__controls">
          <BaseCard
            className="playground__controls__card-button"
            onClick={() => setShowingEditor(prev => !prev)}
            as="button"
          >
            <SourceCodeIcon className="playground__controls__card-button-icon" />
            Vis kode
          </BaseCard>
        </div>
        <BaseExpand open={isShowingEditor}>
          <LiveEditor className="playground__editor" />
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
      >
        <Button></Button>
      </AdvancedPlayground>
    );
  }
};
