import React from 'react';
import { Heading2, Paragraph } from '@entur/typography';
import { GridContainer } from '@entur/grid';
import ColorSwatch from './ColorSwatch';
import { borderWidths, colors } from '@entur/tokens';
import TransportColors from './TransportColors';
import { Drawer } from '@entur/modal';

const Colors = () => {
  const [openDrawer, setOpenDrawer] = React.useState(false);
  return (
    <div>
      <Drawer
        title="Litt mer informasjon"
        open={openDrawer}
        onDismiss={() => setOpenDrawer(false)}
      >
        <Paragraph>
          Denne drawer-komponenten skal i hovedsak kun brukes til å gi mer
          informasjon - litt som et mer avansert tooltip. Et eksempel kan være å
          vise flere detaljer om et valgt produkt, reise eller lignende. Du kan
          lenke til mer funksjonalitet om ønskelig.
        </Paragraph>
        <Paragraph>
          Man skal aldri plassere tekstfelt, radioknapper og lignende i drawers.
          Lenk heller til egne views for å endre dette - eller tilby disse
          kontrollene kontekstuelt.
        </Paragraph>
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
      <GridContainer style={{ marginBottom: '3rem' }}>
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
      <GridContainer>
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
      <GridContainer>
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
      <GridContainer>
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
      <GridContainer style={{ marginBottom: '3rem' }}>
        {Object.keys(colors.greys).map(color => (
          <ColorSwatch type="UX" key={color} path={`greys.${color}`}>
            {color}
          </ColorSwatch>
        ))}
      </GridContainer>

      <TransportColors />
    </div>
  );
};

export default Colors;
