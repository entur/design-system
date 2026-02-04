import React from 'react';
import { CopyableText } from '@entur/alert';
import { CodeBlock } from '@components/Codeblock/CodeBlock';

type Props = {
  imports: string;
  packageName: string;
};

export const ImportStatement: React.FC<Props> = ({ imports, packageName }) => {
  const importText = `import { ${imports} } from '@entur/${packageName}';`;
  return (
    <CodeBlock language="jsx" hideLineNumbers copyable>
      {importText}
    </CodeBlock>
  );
};
