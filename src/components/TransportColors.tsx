import React from 'react';
import { colors } from '@entur/tokens';
import { Contrast } from '@entur/layout';
import {
  Table,
  TableHead,
  TableRow,
  HeaderCell,
  TableBody,
} from '@entur/table';
import ColorSwatch from '~/components/ColorSwatch';
import { Switch } from '@entur/form';
import { GridContainer } from '@entur/grid';

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
      <Switch onChange={() => setContrast(prev => !prev)} checked={isContrast}>
        Vis kontrastfarger
      </Switch>
      <GridContainer>
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
  );
};

export default TransportColors;
