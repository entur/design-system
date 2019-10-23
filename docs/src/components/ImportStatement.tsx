import React from 'react';
import { useCurrentDoc } from 'docz';
import { CopyablePreformattedText } from 'src/components/CopyablePreformattedText';

type Props = {
  imports: string;
};

export const ImportStatement: React.FC<Props> = ({ imports }) => {
  const { npmPackage } = useCurrentDoc();
  const importText = `import { ${imports} } from '@entur/${npmPackage}';`;
  return (
    <CopyablePreformattedText
      copiedToastMessage={{
        title: 'Kopiert!',
        content: 'Import-statementet ble kopiert til utklippstavla.',
      }}
    >
      {importText}
    </CopyablePreformattedText>
  );
};
