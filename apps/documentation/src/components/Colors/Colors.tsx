import React from 'react';
import { Link } from 'gatsby';
import { hex } from 'wcag-contrast';

import { CopyableText } from '@entur/alert';
import { CheckIcon, CloseIcon } from '@entur/icons';
import {
  DataCell,
  HeaderCell,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from '@entur/table';
import { colors } from '@entur/tokens';
import { Heading, Link as LinkText, Text } from '@entur/typography/beta';
import './Colors.scss';

export const ColorDrawer: React.FC<{
  color: ColorObject;
  description?: React.ReactNode;
}> = ({ color, description }) => {
  return (
    <div>
      <div
        style={{ background: color.hex, width: '100%', height: '160px' }}
      ></div>
      {description && <div style={{ marginTop: '1.5rem' }}>{description}</div>}
      <Heading
        as="h4"
        variant="subtitle-2"
        spacing={{ top: 'xl', bottom: 'xs' }}
      >
        Fargerverdier
      </Heading>
      <Text variant="label">Variabel</Text>
      <CopyableText
        className="eds-colors-group__copy-color-button"
        successMessage={`Kopiert til utklippstavle`}
      >
        {color.variable}
      </CopyableText>
      <Text variant="label">Hex</Text>
      <CopyableText
        className="eds-colors-group__copy-color-button"
        textToCopy={color.hex.replace('#', '')}
        successMessage={'Kopiert til utklippstavle'}
      >
        {color.hex}
      </CopyableText>
      <Text variant="label">RGB</Text>
      <CopyableText
        className="eds-colors-group__copy-color-button"
        successMessage={'Kopiert til utklippstavle'}
      >
        {color.rgb}
      </CopyableText>
      {color.cmyk && (
        <>
          <Text variant="label">CMYK</Text>
          <CopyableText
            className="eds-colors-group__copy-color-button"
            successMessage={'Kopiert til utklippstavle'}
          >
            {color.cmyk}
          </CopyableText>
        </>
      )}

      <Heading
        as="h4"
        variant="subtitle-2"
        spacing={{ top: 'xl', bottom: 'xs' }}
      >
        Kontrast
      </Heading>
      <Text spacing={{ bottom: 'm' }}>
        Lær mer om{' '}
        <LinkText as={Link} to="/universell-utforming/kontrastsjekker">
          kontrastkrav for farger.
        </LinkText>
      </Text>
      <Table className="eds-colors-group__contrast-table">
        <TableHead>
          <TableRow>
            <HeaderCell>Bakgrunn</HeaderCell>
            <HeaderCell>Kontrast</HeaderCell>
            <HeaderCell>AA</HeaderCell>
            <HeaderCell>AAA</HeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <ContrastRow
            testColor={colors.brand.blue}
            color={color.hex}
          ></ContrastRow>
          <ContrastRow
            testColor={colors.brand.white}
            color={color.hex}
          ></ContrastRow>
          <ContrastRow
            testColor={colors.greys.grey60}
            color={color.hex}
          ></ContrastRow>
        </TableBody>
      </Table>
    </div>
  );
};

const ContrastRow = ({ color, testColor }) => {
  function score(testColor) {
    return Number(hex(color, testColor)).toFixed(1).toString();
  }
  const contrastScore = score(testColor);

  return (
    <TableRow>
      <DataCell>
        <div
          role="img"
          style={{
            background: testColor,
            height: '100%',
            border: 'solid 1px var(--basecolors-stroke-subdued)',
          }}
          aria-label={'Farge: ' + testColor}
        />
      </DataCell>
      <DataCell>{contrastScore}:1</DataCell>
      <DataCell>
        {WCAGTest(contrastScore, 'aasmall') ? <Innafor /> : <Uttafor />}
      </DataCell>
      <DataCell>
        {WCAGTest(contrastScore, 'aaalarge') ? <Innafor /> : <Uttafor />}
      </DataCell>
    </TableRow>
  );
};

function WCAGTest(score: any, wcagType: string) {
  switch (wcagType) {
    case 'aasmall':
      return Number(score) >= 4.5;
    case 'aalarge':
      return Number(score) >= 3;
    case 'aaalarge':
      return Number(score) >= 4.5;
    case 'aaasmall':
      return Number(score) >= 7;
    case 'graphic':
      return Number(score) >= 3;
  }
}
function Innafor() {
  return (
    <CheckIcon
      inline
      aria-label="Innfrir kontrastkravet"
      className="eds-colors-group__validation-icon--valid"
    />
  );
}

function Uttafor() {
  return (
    <CloseIcon
      inline
      aria-label="Bryter kontrastkravet"
      className="eds-colors-group__validation-icon--invalid"
    />
  );
}
