import React from 'react';
import { CopyableText } from '@entur/alert';

type Props = {
  imports: string;
  packageName: string;
};

export const ImportStatement: React.FC<Props> = ({ imports, packageName }) => {
  const importText = `import { ${imports} } from '@entur/${packageName}';`;
  return (
    <CopyableText successMessage="Import-statementet ble kopiert til utklippstavla.">
      {importText}
    </CopyableText>
  );
};
