import React from 'react';
import classNames from 'classnames';
import { Language } from 'prism-react-renderer';
import { LiveProvider, LivePreview, LiveEditor } from 'react-live';
import { Label } from '@entur/typography';
import { Switch } from '@entur/form';
import prismTheme from '~/components/prism-theme';
import './Playground.scss';
import { ExpandableTextButton, BaseExpand } from '@entur/expand/src';

type PlaygroundProps = {
  defaultContrast?: boolean;
  defaultShowEditor?: boolean;
  hideContrastOption?: boolean;
  children: React.ReactNode;
  language?: Language;
  // These props are injected by MDX
  __code: string;
  __scope: Record<string, any>;
  [key: string]: any;
};

export const Playground: React.FC<PlaygroundProps> = ({
  defaultContrast = false,
  defaultShowEditor = false,
  hideContrastOption = false,
  __code,
  __scope,
  language,
}) => {
  const [isContrast, setContrast] = React.useState(defaultContrast);
  const [isShowingEditor, setShowingEditor] = React.useState(defaultShowEditor);

  // Borrowed from docz
  const transformCode = (codeToTransform: string) => {
    if (codeToTransform.startsWith('()') || codeToTransform.startsWith('class'))
      return codeToTransform;
    return `<React.Fragment>${codeToTransform}</React.Fragment>`;
  };

  return (
    <LiveProvider
      code={__code}
      scope={__scope}
      language={language}
      transformCode={transformCode}
      theme={prismTheme}
    >
      <div className={classNames('playground', { 'eds-contrast': isContrast })}>
        <LivePreview />
      </div>
      <div className="playground__controls">
        {hideContrastOption ? (
          <div />
        ) : (
          <Switch
            checked={isContrast}
            onChange={() => setContrast(prev => !prev)}
          >
            <Label as="span">Kontrast</Label>
          </Switch>
        )}
        <div>
          {/* <SubLabel
            className="playground__control"
            as="button"
            type="button"
            onClick={() => setShowingEditor(prev => !prev)}
          >
            <SourceCodeIcon inline={true} /> {isShowingEditor ? 'Skjul' : 'Vis'}{' '}
            kode
          </SubLabel> */}
          <ExpandableTextButton
            open={isShowingEditor}
            onClick={() => setShowingEditor(prev => !prev)}
          >
            Kode
          </ExpandableTextButton>
        </div>
      </div>
      <BaseExpand open={isShowingEditor}>
        <LiveEditor className="playground__editor" />
      </BaseExpand>
    </LiveProvider>
  );
};
