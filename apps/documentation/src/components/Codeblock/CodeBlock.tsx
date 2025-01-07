import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { Language } from 'prism-react-renderer';
import { ExpandablePanel } from '@entur/expand';
import { SourceCodeIcon } from '@entur/icons';

// @ts-expect-error mangler typer for theme-fil
import theme from './themeForCodeBlock';

import './CodeBlock.scss';

export type codeBlockProps = {
  children: string;
  language?: Language;
  wrapLongLines?: boolean;
  hideLineNumbers?: boolean;
  asExpandable?: boolean;
  expandableLabel?: string;
  defaultOpen: boolean;
};

export const CodeBlock = ({
  children,
  language = 'jsx',
  hideLineNumbers = false,
  wrapLongLines = true,
  asExpandable = false,
  expandableLabel = '!!Mangler tittel!!',
  defaultOpen = false,
  ...rest
}: codeBlockProps) => {
  const ConditionalWrapper = ({ condition, wrapper, children }: any) =>
    condition ? wrapper(children) : <>{children}</>;

  return (
    <div className="code-block">
      <ConditionalWrapper
        condition={asExpandable}
        wrapper={(wrapChildren: React.ReactNode) => (
          <ExpandablePanel
            title={
              <>
                <SourceCodeIcon inline /> {expandableLabel}
              </>
            }
            defaultOpen={defaultOpen}
          >
            {wrapChildren}
          </ExpandablePanel>
        )}
      >
        <SyntaxHighlighter
          language={language}
          style={theme}
          wrapLongLines={wrapLongLines}
          showLineNumbers={!hideLineNumbers}
          customStyle={{
            marginTop: 0,
            zIndex: 0,
          }}
          {...rest}
        >
          {children}
        </SyntaxHighlighter>
      </ConditionalWrapper>
    </div>
  );
};
