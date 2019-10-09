import React from 'react';
import { colors } from '@entur/tokens';
import { Paragraph, StrongText } from '@entur/typography';
import { Contrast } from '@entur/layout';
import ColorSwatch from 'src/components/ColorSwatch';
import ToggleSwitch from 'src/components/ToggleSwitch';

const TransportColors: React.FC = () => {
  const [isContrast, setContrast] = React.useState(false);
  const pathName = isContrast ? 'contrast' : 'default';
  const Wrapper = isContrast ? Contrast : 'div';
  return (
    <Wrapper
      style={{
        boxShadow: isContrast ? `0 0 0 1rem ${colors.brand.blue}` : 'none',
      }}
    >
      <ToggleSwitch
        onChange={() => setContrast(prev => !prev)}
        checked={isContrast}
      >
        Vis kontrastfarger
      </ToggleSwitch>
      <Paragraph>
        <StrongText>Metro</StrongText>-fargen brukes for t-bane
      </Paragraph>
      <ColorSwatch path={`transport.${pathName}.metro`}>Metro</ColorSwatch>
      <Paragraph>
        <StrongText>Bus</StrongText>-fargen brukes for alle typer buss-transport
      </Paragraph>
      <ColorSwatch path={`transport.${pathName}.bus`}>Bus</ColorSwatch>
      <Paragraph>
        <StrongText>Plane</StrongText> er basert på Avinor sin profilfarge, og
        brukes på fly og helikopter
      </Paragraph>
      <ColorSwatch path={`transport.${pathName}.plane`}>Plane</ColorSwatch>
      <ColorSwatch path={`transport.${pathName}.helicopter`}>
        Helicopter
      </ColorSwatch>
      <Paragraph>
        <StrongText>Tram</StrongText> brukes for trikk, Fløibanen, Ulriken osv.
      </Paragraph>
      <ColorSwatch path={`transport.${pathName}.tram`}>Tram</ColorSwatch>
      <ColorSwatch path={`transport.${pathName}.funicular`}>
        Funicular
      </ColorSwatch>
      <ColorSwatch path={`transport.${pathName}.cableway`}>
        Cableway
      </ColorSwatch>
      <Paragraph>
        <StrongText>Blue</StrongText> brukes for taxi, sykkel og gange
      </Paragraph>
      <ColorSwatch path={`transport.${pathName}.taxi`}>Taxi</ColorSwatch>
      <ColorSwatch path={`transport.${pathName}.bicycle`}>Bicycle</ColorSwatch>
      <ColorSwatch path={`transport.${pathName}.walk`}>Walk</ColorSwatch>
      <Paragraph>
        <StrongText>Train</StrongText> er basert på Bane NOR sin profilfarge, og
        brukes på tog
      </Paragraph>
      <ColorSwatch path={`transport.${pathName}.train`}>Train</ColorSwatch>
      <Paragraph>
        <StrongText>Ferry</StrongText> brukes for vanngående transport, som
        ferjer, bilferjer, skip og cruise
      </Paragraph>
      <ColorSwatch path={`transport.${pathName}.ferry`}>Ferry</ColorSwatch>
      <ColorSwatch path={`transport.${pathName}.carferry`}>
        Carferry
      </ColorSwatch>
      <Paragraph>
        <StrongText>Mobility</StrongText> er fargen som brukes for
        mobilitetsløsninger, slik som bysykler og sparkesykler
      </Paragraph>
      <ColorSwatch path={`transport.${pathName}.mobility`}>
        Mobility
      </ColorSwatch>
    </Wrapper>
  );
};

export default TransportColors;
