import React from 'react';
import { useCurrentDoc } from 'docz';
import { useSettings } from '~/utils/Providers/SettingsContext';
import { CopyableText } from '@entur/alert';

type Props = {
  imports: string;
  packageName?: string;
};

export const ImportStatement: React.FC<Props> = ({ imports, packageName }) => {
  const { npmPackage } = useCurrentDoc();
  const { userType } = useSettings();

  if (userType !== 'developer') {
    return null;
  }
  const importText = `import { ${imports} } from '@entur/${
    packageName || npmPackage
  }';`;
  return (
    <CopyableText successMessage="Import-statementet ble kopiert til utklippstavla.">
      {importText}
    </CopyableText>
  );
};
