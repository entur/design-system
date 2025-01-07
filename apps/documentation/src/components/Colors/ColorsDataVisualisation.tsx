import { Switch } from '@entur/form';
import { GridContainer } from '@entur/grid';
import { Contrast } from '@entur/layout';
import { colors, space } from '@entur/tokens';
import React from 'react';
import ColorSwatch from './ColorSwatch';
import { borderRadiuses } from '@entur/tokens';
import { graphql, useStaticQuery } from 'gatsby';
import { GatsbyImage, getImage, IGatsbyImageData } from 'gatsby-plugin-image';

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
          padding: '1rem',
          borderRadius: borderRadiuses.large,
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

  // Fetch images
  const data = useStaticQuery(graphql`
    query illustrationQuery {
      files: allFile(
        filter: {
          sourceInstanceName: { eq: "media" }
          relativeDirectory: {
            glob: "images/identitet/verktoykassen/datavisualisering"
          }
          extension: { eq: "png" }
        }
      ) {
        nodes {
          name
          childImageSharp {
            gatsbyImageData(layout: CONSTRAINED)
          }
        }
      }
    }
  `);
  const Wrapper = isContrast ? Contrast : 'div';

  const imageName = isContrast
    ? `Eksempel${illustration}Contrast`
    : `Eksempel${illustration}`;
  const image = data.files.nodes.find((node: any) => node.name === imageName);

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
          backgroundColor: isContrast ? '' : colors.greys.grey90,
        }}
      >
        {image && (
          <GatsbyImage
            image={
              getImage(
                image.childImageSharp.gatsbyImageData,
              ) as IGatsbyImageData
            }
            alt={`Illustration ${illustration}`}
            style={{ width: '100%' }}
          />
        )}
      </Wrapper>
    </>
  );
};

export default ColorsDataVisualisation;
