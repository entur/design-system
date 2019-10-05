import React from 'react';
import classNames from 'classnames';
import { LiveProvider, LivePreview, LiveEditor } from 'react-live';
import ToggleSwitch from './ToggleSwitch';
import './Playground.scss';
import { Language } from 'prism-react-renderer';
import copy from 'copy-text-to-clipboard';
import prismTheme from './prism-theme';
import { SubLabel } from '@entur/typography';
import { ReportsIcon } from '@entur/icons';
import SourceCodeIcon from './SourceCodeIcon';

type PlaygroundProps = {
  defaultContrast?: boolean;
  defaultShowEditor?: boolean;
  hideContrastOption?: boolean;
  children: React.ReactNode;
  language?: Language;
  // These three props are injected by MDX and required by DoczPlayground
  __code: string;
  __position: number;
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
        {!hideContrastOption && (
          <ToggleSwitch
            checked={isContrast}
            onChange={() => setContrast(prev => !prev)}
          >
            Kontrast
          </ToggleSwitch>
        )}
        <div>
          <SubLabel
            className="playground__control"
            as="button"
            type="button"
            onClick={() => copy(__code)}
          >
            <ReportsIcon /> Kopier kode
          </SubLabel>
          <SubLabel
            className="playground__control"
            as="button"
            type="button"
            onClick={() => setShowingEditor(prev => !prev)}
          >
            <SourceCodeIcon /> {isShowingEditor ? 'Skjul' : 'Vis'} kode
          </SubLabel>
        </div>
      </div>
      {isShowingEditor && <LiveEditor className="playground__editor" />}
    </LiveProvider>
  );
};
