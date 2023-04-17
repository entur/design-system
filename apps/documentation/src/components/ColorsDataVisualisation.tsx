import { Switch } from '@entur/form';
import { GridContainer } from '@entur/grid';
import { Contrast } from '@entur/layout';
import { colors, space } from '@entur/tokens';
import React from 'react';
import ColorSwatch from '~/components/ColorSwatch';
import { borderRadiuses } from '@entur/tokens';
import ex1 from './DataExamples/Eksempel1.png';
import ex1Contrast from './DataExamples/Eksempel1Contrast.png';
import ex2 from './DataExamples/Eksempel2.png';
import ex2Contrast from './DataExamples/Eksempel2Contrast.png';
import ex3 from './DataExamples/Eksempel3.png';
import ex3Contrast from './DataExamples/Eksempel3Contrast.png';
import ex4 from './DataExamples/Eksempel4.png';
import ex4Contrast from './DataExamples/Eksempel4Contrast.png';

const ColorsDataVisualisation: React.FC = () => {
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
            path={`data.${pathName}.blue`}
            title="Blue"
            topLabel="Farge 1"
          ></ColorSwatch>
          <ColorSwatch
            path={`data.${pathName}.coral`}
            title="Coral"
            topLabel="Farge 2"
          ></ColorSwatch>
          <ColorSwatch
            path={`data.${pathName}.jungle`}
            title="Jungle"
            topLabel="Farge 3"
          ></ColorSwatch>
          <ColorSwatch
            path={`data.${pathName}.azure`}
            title="Azure"
            topLabel="Farge 4"
          ></ColorSwatch>
          <ColorSwatch
            path={`data.${pathName}.lavender`}
            title="Lavender"
            topLabel="Farge 5"
          ></ColorSwatch>
          <ColorSwatch
            path={`data.${pathName}.peach`}
            title="Peach"
            topLabel="Farge 6"
          ></ColorSwatch>
          <ColorSwatch
            path={`data.${pathName}.spring`}
            title="Spring"
            topLabel="Farge 7"
          ></ColorSwatch>
          <ColorSwatch
            path={`data.${pathName}.lilac`}
            title="Lilac"
            topLabel="Farge 8"
          ></ColorSwatch>
        </GridContainer>
      </Wrapper>
    </>
  );
};

type DataIllustrationsProps = {
  illustration: '1' | '2' | '3' | '4';
};

export const DataIllustrations: React.FC<DataIllustrationsProps> = ({
  illustration,
}) => {
  const [isContrast, setContrast] = React.useState(false);
  const Wrapper = isContrast ? Contrast : 'div';

  return (
    <>
      <Switch
        aria-hidden="true"
        onChange={() => setContrast(prev => !prev)}
        checked={isContrast}
      >
        <span aria-hidden="true">Vis i Contrast</span>
      </Switch>
      <Wrapper
        style={{
          borderRadius: borderRadiuses.small,
          padding: space.extraLarge3,
        }}
      >
        {illustration === '1' && (
          <img src={isContrast ? ex1Contrast : ex1} alt="" width="100%" />
        )}
        {illustration === '2' && (
          <img src={isContrast ? ex2Contrast : ex2} alt="" width="100%" />
        )}
        {illustration === '3' && (
          <img src={isContrast ? ex3Contrast : ex3} alt="" width="100%" />
        )}
        {illustration === '4' && (
          <img src={isContrast ? ex4Contrast : ex4} alt="" width="100%" />
        )}
      </Wrapper>
    </>
  );
};

export default ColorsDataVisualisation;
