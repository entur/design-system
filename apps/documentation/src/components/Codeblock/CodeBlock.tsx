import React, { CSSProperties } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { Language } from 'prism-react-renderer';
import { useToast } from '@entur/alert';
import { ActionChip } from '@entur/chip';
import { ExpandablePanel } from '@entur/expand';
import { CopyIcon, SourceCodeIcon } from '@entur/icons';
import copy from 'copy-text-to-clipboard';

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
  defaultOpen?: boolean;
  style?: CSSProperties;
  copyable?: boolean;
};

export const CodeBlock = ({
  children,
  language = 'jsx',
  hideLineNumbers = false,
  wrapLongLines = true,
  asExpandable = false,
  expandableLabel = '!!Mangler tittel!!',
  defaultOpen = false,
  copyable = false,
  ...rest
}: codeBlockProps) => {
  const { addToast } = useToast();

  const ConditionalWrapper = ({ condition, wrapper, children }: any) =>
    condition ? wrapper(children) : <>{children}</>;

  return (
    <div className="code-block" style={rest.style}>
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
        {copyable && (
          <ActionChip
            data-color-mode="dark"
            className="code-block__copy"
            size="small"
            type="button"
            onClick={() => {
              copy(children);
              addToast({
                title: 'Innhold kopiert!',
                content: '',
              });
            }}
          >
            Kopier <CopyIcon aria-hidden />
          </ActionChip>
        )}
        <SyntaxHighlighter
          language={language}
          style={theme}
          wrapLongLines={wrapLongLines}
          showLineNumbers={!hideLineNumbers}
          customStyle={{
            marginTop: 0,
            zIndex: 0,
            paddingBlock: 8,
          }}
          {...rest}
        >
          {children}
        </SyntaxHighlighter>
      </ConditionalWrapper>
    </div>
  );
};
