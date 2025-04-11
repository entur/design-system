import React from 'react';
import { GridContainer, GridItem } from '@entur/grid';
import { Heading3 } from '@entur/typography';
import './ColorCard.scss';

import { ColorCard } from './ColorCard';

const Colors: React.FC<{
  colorType: 'primary' | 'secondary';
}> = ({ colorType }) => {
  return (
    <div>
      {colorType === 'primary' && (
        <GridContainer
          className="eds-colors-group__large-space"
          spacing="large"
        >
          <GridItem small={12} medium={6} large={4}>
            <ColorCard
              colorTitle="Blue"
              hex="#181C56"
              rgb="24, 28, 86"
              cmyk="100, 95, 0, 45"
              pmsC="273"
            ></ColorCard>
          </GridItem>
          <GridItem small={12} medium={6} large={4}>
            <ColorCard
              colorTitle="Coral"
              hex="#ff5959"
              rgb="255, 89, 89"
              cmyk="0, 80, 60, 0"
              pmsC="178"
            ></ColorCard>
          </GridItem>
          <GridItem small={12} medium={6} large={4}>
            <ColorCard
              colorTitle="White"
              hex="#ffffff"
              rgb="255, 255, 255"
              cmyk="0, 0, 0, 0"
            ></ColorCard>
          </GridItem>
        </GridContainer>
      )}

      {colorType === 'secondary' && (
        <>
          <GridContainer
            className="eds-colors-group__large-space"
            spacing="large"
          >
            <GridItem small={12} medium={6} large={4}>
              <ColorCard
                colorTitle="Peach"
                hex="#ffbf9e"
                rgb="255, 191, 158"
                cmyk="0, 30, 40, 0"
                pmsC="162"
              ></ColorCard>
            </GridItem>
            <GridItem small={12} medium={6} large={4}>
              <ColorCard colorTitle="Lavender" hex="#aeb7e2"></ColorCard>
            </GridItem>
          </GridContainer>
        </>
      )}
    </div>
  );
};

export default Colors;
