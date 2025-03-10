import { Switch } from '@entur/form';
import { GridContainer } from '@entur/grid';
import { Contrast } from '@entur/layout';
import { colors, space, borderRadiuses } from '@entur/tokens';
import React from 'react';
import ColorSwatch from './ColorSwatch';

const TransportColors: React.FC = () => {
  const [isContrast, setContrast] = React.useState(false);
  const pathName = isContrast ? 'contrast' : 'default';
  const Wrapper = isContrast ? Contrast : 'div';
  return (
    <>
      <Switch
        style={{ marginBottom: space.extraLarge }}
        onChange={() => setContrast(prev => !prev)}
        checked={isContrast}
      >
        Vis kontrastfarger
      </Switch>
      <Wrapper
        style={{
          boxShadow: isContrast ? `0 0 0 1rem ${colors.brand.blue}` : 'none',
          borderRadius: borderRadiuses.small,
        }}
      >
        <GridContainer spacing="large">
          <ColorSwatch
            path={`transport.${pathName}.metro`}
            title="Metro"
          ></ColorSwatch>
          <ColorSwatch
            path={`transport.${pathName}.bus`}
            title="Bus"
          ></ColorSwatch>
          <ColorSwatch
            path={`transport.${pathName}.plane`}
            title="Plane"
          ></ColorSwatch>
          <ColorSwatch
            path={`transport.${pathName}.helicopter`}
            title="Helicopter"
          ></ColorSwatch>
          <ColorSwatch
            path={`transport.${pathName}.tram`}
            title="Tram"
          ></ColorSwatch>
          <ColorSwatch
            path={`transport.${pathName}.funicular`}
            title="Funicular"
          ></ColorSwatch>
          <ColorSwatch
            path={`transport.${pathName}.cableway`}
            title="Cableway"
          ></ColorSwatch>
          <ColorSwatch
            path={`transport.${pathName}.taxi`}
            title="Taxi"
          ></ColorSwatch>
          <ColorSwatch
            path={`transport.${pathName}.bicycle`}
            title="Bicycle"
          ></ColorSwatch>
          <ColorSwatch
            path={`transport.${pathName}.walk`}
            title="Walk"
          ></ColorSwatch>
          <ColorSwatch
            path={`transport.${pathName}.train`}
            title="Train"
          ></ColorSwatch>
          <ColorSwatch
            path={`transport.${pathName}.ferry`}
            title="Ferry"
          ></ColorSwatch>
          <ColorSwatch
            path={`transport.${pathName}.carferry`}
            title="Carferry"
          ></ColorSwatch>

          <ColorSwatch
            path={`transport.${pathName}.mobility`}
            title="Mobility"
          ></ColorSwatch>
        </GridContainer>
      </Wrapper>
    </>
  );
};

export default TransportColors;
