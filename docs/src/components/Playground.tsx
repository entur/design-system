import React from 'react';
import classNames from 'classnames';
import { Language } from 'prism-react-renderer';
import { LiveProvider, LivePreview, LiveEditor } from 'react-live';
import copy from 'copy-text-to-clipboard';
import { ReportsIcon, SourceCodeIcon } from '@entur/icons';
import { SubLabel, Label } from '@entur/typography';
import ToggleSwitch from 'src/components/ToggleSwitch';
import prismTheme from 'src/components/prism-theme';
import './Playground.scss';

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
      <div
        className={classNames('playground', { 'entur-contrast': isContrast })}
      >
        <LivePreview />
      </div>
      <div className="playground__controls">
        {hideContrastOption ? (
          <div />
        ) : (
          <ToggleSwitch
            checked={isContrast}
            onChange={() => setContrast(prev => !prev)}
          >
            <Label as="span">Kontrast</Label>
          </ToggleSwitch>
        )}
        <div>
          <SubLabel
            className="playground__control"
            as="button"
            type="button"
            onClick={() => copy(__code)}
          >
            <ReportsIcon inline={true} /> Kopier kode
          </SubLabel>
          <SubLabel
            className="playground__control"
            as="button"
            type="button"
            onClick={() => setShowingEditor(prev => !prev)}
          >
            <SourceCodeIcon inline={true} /> {isShowingEditor ? 'Skjul' : 'Vis'}{' '}
            kode
          </SubLabel>
        </div>
      </div>
      {isShowingEditor && <LiveEditor className="playground__editor" />}
    </LiveProvider>
  );
};
