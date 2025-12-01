import React from 'react';
import { CodeText } from '@entur/typography';
import { CopyableText, SmallAlertBox } from '@entur/alert';
import { space } from '@entur/tokens';

import { useSettings } from '@providers/SettingsContext';

import { AllTokensTableProps } from './types';

type PrimitiveSizeImportInstructionsProps = {
  tokenKey: AllTokensTableProps['tokenKey'];
};

export const TokenImportInstructions: React.FC<
  PrimitiveSizeImportInstructionsProps
> = ({ tokenKey }) => {
  const { variableFormat } = useSettings();

  const getImportText = () => {
    switch (variableFormat) {
      case 'js':
        return `import { ${tokenKeyMapping[tokenKey]} } from '@entur/tokens'`;
      case 'scss':
        return `@use "@entur/tokens/dist/${tokenKeyMapping[tokenKey]}.scss" as ${tokenKeyMapping[tokenKey]}`;
      case 'css':
        return `@import "@entur/tokens/dist/${tokenKeyMapping[tokenKey]}.css"`;
      case 'less':
        return `@import "@entur/tokens/dist/${tokenKeyMapping[tokenKey]}.less"`;
      default:
        return '';
    }
  };

  return (
    <div style={{ marginTop: space.large }}>
      For å bruke <CodeText>{tokenKeyMapping[tokenKey]}</CodeText> tokens
      importer du dem slik:{' '}
      <CopyableText style={{ width: 'fit-content', marginTop: space.small }}>
        {getImportText()}
      </CopyableText>
      {variableFormat === 'css' && (
        <SmallAlertBox variant="information">
          Bruker du komponenter fra designsystemet er CSS-variablene allerede
          importert for deg!
        </SmallAlertBox>
      )}
    </div>
  );
};

const tokenKeyMapping: Partial<
  Record<AllTokensTableProps['tokenKey'], string>
> = {
  primitive: 'primitive',
  primitiveSize: 'primitive',
  semantic: 'semantic',
  base: 'base',
};
