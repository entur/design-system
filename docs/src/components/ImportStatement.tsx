import React from 'react';
import { useCurrentDoc } from 'docz';
import { CopyablePreformattedText } from 'src/components/CopyablePreformattedText';
import { useSettings } from 'src/components/SettingsContext';

type Props = {
  imports: string;
};

export const ImportStatement: React.FC<Props> = ({ imports }) => {
  const { npmPackage } = useCurrentDoc();
  const { userType } = useSettings();

  if (userType !== 'developer') {
    return null;
  }
  const importText = `import { ${imports} } from '@entur/${npmPackage}';`;
  return (
    <CopyablePreformattedText successMessage="Import-statementet ble kopiert til utklippstavla.">
      {importText}
    </CopyablePreformattedText>
  );
};
