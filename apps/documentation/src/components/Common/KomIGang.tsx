import React from 'react';
import { useSettings } from '@providers/SettingsContext';
import { CopyableText } from '@entur/alert';
import { Heading3 } from '@entur/typography';

type Props = {
  npmPackage: string;
};

export const KomIGang: React.FC<Props> = ({ npmPackage }) => {
  const { packageManager } = useSettings();

  const installCommand =
    packageManager === 'yarn'
      ? `yarn add @entur/${npmPackage}`
      : `npm install @entur/${npmPackage}`;

  const cssImport = `@import '@entur/${npmPackage}/dist/styles.css';`;

  return (
    <>
      <Heading3>Kom i gang</Heading3>

      <CopyableText
        textToCopy={installCommand}
        successMessage="Installasjonskommando ble kopiert til utklippstavla."
      >
        {installCommand}
      </CopyableText>

      <CopyableText
        textToCopy={cssImport}
        successMessage="CSS import ble kopiert til utklippstavla."
      >
        {cssImport}
      </CopyableText>
    </>
  );
};
