import React from 'react';
import { Text } from '@entur/typography/beta';
import { OverflowMenu, OverflowMenuItem } from '@entur/menu';
import { SmallAlertBox } from '@entur/alert';

import { useSettings } from '@providers/SettingsContext';

import { AllTokensTableProps } from './types';
import { DownArrowIcon } from '@entur/icons';

type TokenTableFormatInfoProps = {
  tokenKey: AllTokensTableProps['tokenKey'];
};

export const TokenFormatInfo: React.FC<TokenTableFormatInfoProps> = ({
  tokenKey,
}) => {
  const { variableFormat, setVariableFormat } = useSettings();

  return (
    <SmallAlertBox variant="information" className="token-table__format">
      <>
        Du viser nå{' '}
        <OverflowMenu
          className="token-table__format-menu"
          button={
            <span className="token-table__format-menu-button">
              <Text variant="code">
                {variableFormat.toUpperCase()}{' '}
                <DownArrowIcon inline style={{ top: '0.1rem' }} />
              </Text>
            </span>
          }
        >
          <OverflowMenuItem onClick={() => setVariableFormat('css')}>
            CSS
          </OverflowMenuItem>
          <OverflowMenuItem onClick={() => setVariableFormat('scss')}>
            SCSS
          </OverflowMenuItem>
          <OverflowMenuItem onClick={() => setVariableFormat('less')}>
            LESS
          </OverflowMenuItem>
          <OverflowMenuItem onClick={() => setVariableFormat('js')}>
            JS
          </OverflowMenuItem>
        </OverflowMenu>
        .
      </>

      {(tokenKey === 'base' ||
        tokenKey === 'componentVariables' ||
        tokenKey === 'componentColors') &&
        !['css', 'scss'].includes(variableFormat) && (
          <p>
            <Text variant="code">{tokenKey}</Text> støtter kun dynamisk farge-
            og skjermmoduser som CSS-variabler i <Text variant="code">CSS</Text>{' '}
            og <Text variant="code">SCSS</Text>. I{' '}
            <Text variant="code">JS</Text> vil verdien være statisk.
          </p>
        )}
    </SmallAlertBox>
  );
};
