import React from 'react';
import { Link } from 'docz';
import { hex } from 'wcag-contrast';

import { CopyableText } from '@entur/alert';
import { GridContainer } from '@entur/grid';
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
import {
  Heading3,
  Heading4,
  Label,
  Link as LinkText,
  Paragraph,
} from '@entur/typography';

import ColorSwatch from './ColorSwatch';
import TransportColors from './ColorsTransport';
import ColorsDataVisualisation from './ColorsDataVisualisation';

import './Colors.scss';

const Colors: React.FC<{
  colorType: 'brand' | 'blues' | 'greys' | 'validation' | 'transport' | 'data';
}> = ({ colorType }) => {
  return (
    <div>
      {colorType === 'brand' && (
        <GridContainer
          className="eds-colors-group__large-space"
          spacing="large"
        >
          <ColorSwatch title="Blue" path="brand.blue" cmyk="100, 95, 0, 45">
            Blue er primær fargen til Entur og skal være gjennomgående i vår
            visuelle profil. Den varme, mørkeblå fargen hentyder til den
            statlige, trygge aktøren. Brukes i logo, typografi, bakgrunn
            (contrast tema) og enkelte elementer som bærer av vår identitet.
          </ColorSwatch>
          <ColorSwatch
            title="Lavender"
            cmyk="23, 19, 0, 11"
            path="brand.lavender"
          >
            Lavender brukes som støttefarge for å gi et mykere og varmere
            uttrykk. En mer subtil og nøytral blåfarge som skaper en visuell
            harmoni i layouten.
          </ColorSwatch>
          <ColorSwatch title="Coral" path="brand.coral" cmyk="0, 80, 60, 0">
            Coral er Enturs aksentfarge. Fargen er vektet lavt, men er viktig og
            brukes ofte til mindre detaljer. Den korallrøde står for
            effektiviteten, tydeligheten og den lille detaljen som binder det
            hele sammen.
          </ColorSwatch>
          <ColorSwatch title="Peach" path="brand.peach" cmyk="0, 30, 40, 0">
            Peach brukes for å få et ekstra lekent uttrykk. I likhet med coral
            skal også denne fargen vektes lavt, og brukes minimalt i designet.
          </ColorSwatch>
          <ColorSwatch
            path="brand.white"
            cmyk="0, 0, 0, 0"
            style={{ border: '0.125rem solid #e9e9e9' }}
            title="White"
          >
            White brukes ofte som standard bakgrunnsfarge og typografi for
            ‘Contrast’. Bruken av mye hvitt og whitespace i tillegg til de andre
            fargene gjør at profilen fremstår lys, luftig og dynamisk.
          </ColorSwatch>
        </GridContainer>
      )}

      {colorType === 'validation' && (
        <>
          <Heading3>Infomelding farger</Heading3>
          <GridContainer
            spacing="large"
            style={{ marginBottom: '3rem' }}
            className="eds-colors-small-space"
          >
            <ColorSwatch title="Sky" path="validation.sky"></ColorSwatch>
            <ColorSwatch
              title="Sky Contrast"
              path="validation.skyContrast"
            ></ColorSwatch>
            <ColorSwatch
              title="Sky Tint"
              path="validation.skyTint"
            ></ColorSwatch>
          </GridContainer>
          <Heading3>Suksessmelding farger</Heading3>
          <GridContainer
            spacing="large"
            className="eds-colors-group__small-space"
          >
            <ColorSwatch title="Mint" path="validation.mint"></ColorSwatch>
            <ColorSwatch
              title="Mint Contrast"
              path="validation.mintContrast"
            ></ColorSwatch>
            <ColorSwatch
              title="Mint Tint"
              path="validation.mintTint"
            ></ColorSwatch>
          </GridContainer>
          <Heading3>Feilmelding farger</Heading3>
          <GridContainer
            spacing="large"
            className="eds-colors-group__small-space"
          >
            <ColorSwatch title="Lava" path="validation.lava"></ColorSwatch>
            <ColorSwatch
              title="Lava Contrast"
              path="validation.lavaContrast"
            ></ColorSwatch>
            <ColorSwatch
              title="Lava Tint"
              path="validation.lavaTint"
            ></ColorSwatch>
          </GridContainer>
          <Heading3 className="eds-color-list__normal-margin-h3">
            Advarsel- og avviksmelding farge
          </Heading3>
          <GridContainer
            spacing="large"
            className="eds-colors-group__large-space"
          >
            <ColorSwatch title="Canary" path="validation.canary"></ColorSwatch>
            <ColorSwatch
              title="Canary Contrast"
              path="validation.canaryContrast"
            ></ColorSwatch>
            <ColorSwatch
              title="Canary Tint"
              path="validation.canaryTint"
            ></ColorSwatch>
          </GridContainer>
        </>
      )}
      {colorType === 'blues' && (
        <GridContainer
          spacing="large"
          className="eds-colors-group__large-space"
        >
          <React.Fragment>
            {Object.keys(colors.blues).map(color => (
              <ColorSwatch
                key={color}
                title={color}
                path={`blues.${color}`}
              ></ColorSwatch>
            ))}
          </React.Fragment>
        </GridContainer>
      )}
      {colorType === 'greys' && (
        <GridContainer
          spacing="large"
          className="eds-colors-group__large-space"
        >
          {Object.keys(colors.greys).map(color => (
            <ColorSwatch
              key={color}
              title={color}
              path={`greys.${color}`}
            ></ColorSwatch>
          ))}
        </GridContainer>
      )}
      {colorType === 'transport' && <TransportColors />}
      {colorType === 'data' && <ColorsDataVisualisation />}
    </div>
  );
};

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
      <Heading4>Fargerverdier</Heading4>
      <Label>Variabel</Label>
      <CopyableText successMessage={`Kopiert til utklippstavle`}>
        {color.variable}
      </CopyableText>
      <Label>Hex</Label>
      <CopyableText
        textToCopy={color.hex.replace('#', '')}
        successMessage={'Kopiert til utklippstavle'}
      >
        {color.hex}
      </CopyableText>
      <Label>RGB</Label>
      <CopyableText successMessage={'Kopiert til utklippstavle'}>
        {color.rgb}
      </CopyableText>
      {color.cmyk && (
        <>
          <Label>CMYK</Label>
          <CopyableText successMessage={'Kopiert til utklippstavle'}>
            {color.cmyk}
          </CopyableText>
        </>
      )}

      <Heading4>Kontrast</Heading4>
      <Paragraph>
        Lær mer om{' '}
        <LinkText as={Link} to="/universell-utforming/kontrast-sjekker">
          kontrastkrav for farger.
        </LinkText>
      </Paragraph>
      <Table>
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
          style={{ background: testColor, height: '100%' }}
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
      style={{ color: colors.validation.mint }}
      aria-label="Innfrir kontrastkravet"
    />
  );
}

function Uttafor() {
  return (
    <CloseIcon
      inline
      style={{ color: colors.validation.lava }}
      aria-label="Bryter kontrastkravet"
    />
  );
}

export default Colors;
