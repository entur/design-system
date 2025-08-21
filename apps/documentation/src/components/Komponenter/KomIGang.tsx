import React from 'react';
import { useSettings } from '@providers/SettingsContext';
import { Heading2, Paragraph } from '@entur/typography';
import { CopyableText } from '@entur/alert';

type KomIGangProps = {
  npmPackage?: string;
};

const KomIGang: React.FC<KomIGangProps> = ({ npmPackage }) => {
  const { packageManager } = useSettings();

  if (!npmPackage) return null;

  const installText =
    packageManager === 'yarn'
      ? `yarn add @entur/${npmPackage}`
      : `npm install @entur/${npmPackage}`;
  const cssImport = `@import '@entur/${npmPackage}/dist/styles.css';`;

  return (
    <>
      <Heading2>Kom i gang</Heading2>
      <Paragraph>hei</Paragraph>
      <div className="page-header__import-wrapper">
        <CopyableText
          successMessage="Innstalleringstekst ble kopiert til utklippstavla."
          className="page-header__import-wrapper__copy-button"
        >
          {installText}
        </CopyableText>
        <CopyableText
          successMessage="CSS-importen ble kopiert til utklippstavla."
          className="page-header__import-wrapper__copy-button"
        >
          {cssImport}
        </CopyableText>
      </div>
    </>
  );
};

export default KomIGang;
