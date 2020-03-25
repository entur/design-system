import React from 'react';
import { Language } from 'prism-react-renderer';
import { LiveProvider, LivePreview, LiveEditor } from 'react-live';
import { Label } from '@entur/typography';
import { Switch } from '@entur/form';
import { Contrast } from '@entur/layout';
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

  const ConditionalWrapper = ({ condition, wrapper, children }: any) =>
    condition ? (
      wrapper(children)
    ) : (
      <div className="playground">{children}</div>
    );

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
        <LivePreview />
      </ConditionalWrapper>
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
            onToggle={() => setShowingEditor(prev => !prev)}
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
