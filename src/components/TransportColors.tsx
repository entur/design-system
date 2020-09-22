import { Switch } from '@entur/form';
import { GridContainer } from '@entur/grid';
import { Contrast } from '@entur/layout';
import { colors } from '@entur/tokens';
import { Heading2, Paragraph } from '@entur/typography';
import React from 'react';
import ColorSwatch from '~/components/ColorSwatch';

const TransportColors: React.FC = () => {
  const [isContrast, setContrast] = React.useState(false);
  const pathName = isContrast ? 'contrast' : 'default';
  const Wrapper = isContrast ? Contrast : 'div';
  return (
    <>
      <Heading2>Transportfarger</Heading2>
      <Paragraph>
        De ulike transportmidlene har hver sin representative farge for å skille
        de fra hverandre. Vanngående transport har for eksempel alltid lyseblå
        farge og er derfor også markert med den fargen på ikoner (ferje,
        bilferje, cruise osv.) og på reiselinjer. Transportmiddelfargene finnes
        også for Contrast seksjoner.
      </Paragraph>
      <Wrapper
        style={{
          boxShadow: isContrast ? `0 0 0 1rem ${colors.brand.blue}` : 'none',
        }}
      >
        <Switch
          onChange={() => setContrast(prev => !prev)}
          checked={isContrast}
        >
          Vis kontrastfarger
        </Switch>
        <GridContainer spacing="large">
          <ColorSwatch type="UX" path={`transport.${pathName}.metro`}>
            Metro
          </ColorSwatch>
          <ColorSwatch type="UX" path={`transport.${pathName}.bus`}>
            Bus
          </ColorSwatch>
          <ColorSwatch type="UX" path={`transport.${pathName}.plane`}>
            Plane
          </ColorSwatch>
          <ColorSwatch type="UX" path={`transport.${pathName}.helicopter`}>
            Helicopter
          </ColorSwatch>
          <ColorSwatch type="UX" path={`transport.${pathName}.tram`}>
            Tram
          </ColorSwatch>
          <ColorSwatch type="UX" path={`transport.${pathName}.funicular`}>
            Funicular
          </ColorSwatch>
          <ColorSwatch type="UX" path={`transport.${pathName}.cableway`}>
            Cableway
          </ColorSwatch>

          <ColorSwatch type="UX" path={`transport.${pathName}.taxi`}>
            Taxi
          </ColorSwatch>
          <ColorSwatch type="UX" path={`transport.${pathName}.bicycle`}>
            Bicycle
          </ColorSwatch>
          <ColorSwatch type="UX" path={`transport.${pathName}.walk`}>
            Walk
          </ColorSwatch>

          <ColorSwatch type="UX" path={`transport.${pathName}.train`}>
            Train
          </ColorSwatch>

          <ColorSwatch type="UX" path={`transport.${pathName}.ferry`}>
            Ferry
          </ColorSwatch>
          <ColorSwatch type="UX" path={`transport.${pathName}.carferry`}>
            Carferry
          </ColorSwatch>

          <ColorSwatch type="UX" path={`transport.${pathName}.mobility`}>
            Mobility
          </ColorSwatch>
        </GridContainer>
      </Wrapper>
    </>
  );
};

export default TransportColors;
