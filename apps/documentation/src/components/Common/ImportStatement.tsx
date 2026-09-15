import React from 'react';
import { CodeBlock } from '@components/Codeblock/CodeBlock';
import { sanitizeEnturPackageName } from 'src/utils/utils';

type Props = {
  imports: string;
  packageName?: string;
};

export const ImportStatement: React.FC<Props> = ({ imports, packageName }) => {
  // Older documents store the scoped name, newer ones just the key.
  const importText = `import { ${imports} } from '@entur/${sanitizeEnturPackageName(
    packageName,
  )}';`;
  return (
    <CodeBlock language="jsx" hideLineNumbers copyable>
      {importText}
    </CodeBlock>
  );
};
