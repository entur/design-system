import { GridContainer } from '@entur/grid';
import { CheckIcon, CloseIcon } from '@entur/icons';
import { Drawer } from '@entur/modal';
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
  Heading2,
  Heading4,
  Label,
  Link as LinkText,
  Paragraph,
  Heading3,
} from '@entur/typography';
import { Link } from 'docz';
import React from 'react';
import { hex } from 'wcag-contrast';
import ColorSwatch from './ColorSwatch';
import { CopyablePreformattedText } from './CopyablePreformattedText';
import TransportColors from './TransportColors';
import convert from 'color-convert';

type ColorObject = {
  name: string;
  rgb: string;
  variable: string;
  hex: string;
};

const ColorsContext = React.createContext<{
  setChosenColor?: React.Dispatch<React.SetStateAction<ColorObject>>;
}>({});

export const useColorContext = () => React.useContext(ColorsContext);

const Colors = () => {
  const [chosenColor, setChosenColor] = React.useState<ColorObject>({
    name: '',
    rgb: '',
    variable: '',
    hex: '',
  });
  return (
    <ColorsContext.Provider value={{ setChosenColor }}>
      <div>
        <Drawer
          title={chosenColor.name}
          open={chosenColor.name !== ''}
          onDismiss={() =>
            setChosenColor({ name: '', rgb: '', variable: '', hex: '' })
          }
        >
          <ColorDrawer color={chosenColor}></ColorDrawer>
        </Drawer>
        <Heading2>Profilfarger</Heading2>
        <GridContainer spacing="large">
          <ColorSwatch type="Profil" path="brand.blue">
            Blue
          </ColorSwatch>
          <ColorSwatch type="Profil" path="brand.lavender">
            Lavender
          </ColorSwatch>
          <ColorSwatch type="Profil" path="brand.coral">
            Coral
          </ColorSwatch>
          <ColorSwatch type="Profil" path="brand.peach">
            Peach
          </ColorSwatch>
          <ColorSwatch
            type="Profil"
            path="brand.white"
            style={{ border: '0.125rem solid #e9e9e9' }}
          >
            White
          </ColorSwatch>
        </GridContainer>
        <Heading2>Systemfarger</Heading2>
        <Paragraph>
          Systemfargene er ikke direkte knyttet til identiteten til Entur, men
          brukes hovedsakelig som UI-farger for spesifikke funksjoner i
          systemet. Systemfarger kan for eksempel brukes til varselmeldinger og
          validering i skjemaelementer i grensesnittet. Disse fargene er ikke
          ment som dekorasjon, og skal derfor kun brukes der de gir verdi.
        </Paragraph>
        <Heading3>Infomelding farger</Heading3>
        <GridContainer spacing="large" style={{ marginBottom: '3rem' }}>
          <ColorSwatch type="UX" path="validation.sky">
            Sky
          </ColorSwatch>
          <ColorSwatch type="UX" path="validation.skyContrast">
            Sky Contrast
          </ColorSwatch>
          <ColorSwatch type="UX" path="validation.skyTint">
            Sky Tint
          </ColorSwatch>
        </GridContainer>
        <Heading3>Suksessmelding farger</Heading3>
        <GridContainer spacing="large">
          <ColorSwatch type="UX" path="validation.mint">
            Mint
          </ColorSwatch>
          <ColorSwatch type="UX" path="validation.mintContrast">
            Mint Contrast
          </ColorSwatch>
          <ColorSwatch type="UX" path="validation.mintTint">
            Mint Tint
          </ColorSwatch>
        </GridContainer>
        <Heading3>Feilmelding farger</Heading3>
        <GridContainer spacing="large">
          <ColorSwatch type="UX" path="validation.lava">
            Lava
          </ColorSwatch>
          <ColorSwatch type="UX" path="validation.lavaContrast">
            Lava Contrast
          </ColorSwatch>
          <ColorSwatch type="UX" path="validation.lavaTint">
            Lava Tint
          </ColorSwatch>
        </GridContainer>
        <Heading3>Advarsel- og avviksmelding farge</Heading3>
        <GridContainer spacing="large">
          <ColorSwatch type="UX" path="validation.canary">
            Canary
          </ColorSwatch>
        </GridContainer>
        <Heading2>Blåtoner</Heading2>
        <Paragraph>
          Disse blå fargenyansene brukes hovedsakelig som bakgrunnsfarger for
          Contrast seksjoner og enkelte elementer i designet som for eksempel
          borders og dividers.
        </Paragraph>
        <GridContainer style={{ marginBottom: '3rem' }}>
          <React.Fragment>
            {Object.keys(colors.blues).map(color => (
              <ColorSwatch type="UX" key={color} path={`blues.${color}`}>
                {color}
              </ColorSwatch>
            ))}
          </React.Fragment>
        </GridContainer>
        <Heading2>Gråtoner</Heading2>
        <Paragraph>
          Gråtonene symboliserer det tekniske og robuste i plattformen vår.
          Brukes hovedsakelig som bakgrunnsfarger for å få frem det lyse og
          luftige ved layouten i designet.
        </Paragraph>
        <GridContainer style={{ marginBottom: '3rem' }}>
          {Object.keys(colors.greys).map(color => (
            <ColorSwatch type="UX" key={color} path={`greys.${color}`}>
              {color}
            </ColorSwatch>
          ))}
        </GridContainer>
        <TransportColors />
      </div>
    </ColorsContext.Provider>
  );
};

const ColorDrawer: React.FC<{ color: ColorObject; description?: string }> = ({
  color,
  description,
}) => {
  return (
    <div>
      <div
        style={{ background: color.hex, width: '100%', height: '160px' }}
      ></div>
      {description && <div>{description}</div>}
      <Heading4>Fargerverdier</Heading4>
      <Label>Variabel</Label>
      <CopyablePreformattedText successMessage={`Kopiert til utklippstavle`}>
        {color.variable}
      </CopyablePreformattedText>
      <Label>Hex</Label>
      <CopyablePreformattedText successMessage={'Kopiert til utklippstavle'}>
        {color.hex}
      </CopyablePreformattedText>
      <Label>RGB</Label>
      <CopyablePreformattedText successMessage={'Kopiert til utklippstavle'}>
        {color.rgb}
      </CopyablePreformattedText>
      <Label>CMYK</Label>
      <CopyablePreformattedText successMessage={'Kopiert til utklippstavle'}>
        {convert.hex.cmyk(color.hex).toString()}
      </CopyablePreformattedText>

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
            <HeaderCell>Farge</HeaderCell>
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
            testColor={colors.greys.grey10}
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
  console.log(color, testColor);

  const contrastScore = score(testColor);
  console.log(contrastScore);

  return (
    <TableRow>
      <DataCell>
        <div style={{ background: testColor, height: '100%' }}></div>
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
  return <CheckIcon inline style={{ color: colors.validation.mint }} />;
}

function Uttafor() {
  return <CloseIcon inline style={{ color: colors.validation.lava }} />;
}

export default Colors;
