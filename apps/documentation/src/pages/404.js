import * as React from 'react';
import { Link } from 'gatsby';
import { graphql } from 'gatsby';

import { Paragraph, Heading2, Link as TextLink } from '@entur/typography';
import { PrimaryButton } from '@entur/button';
import { ImageDisplay } from '@components/Media/ImageDisplay';
import { useSettings } from '@providers/SettingsContext';
import { useContrast } from '@entur/layout';

export const query = graphql`
  query NotFoundPage {
    imagefiles: allFile(
      filter: {
        sourceInstanceName: { eq: "media" }
        relativeDirectory: { glob: "images/404" }
        extension: { eq: "png" }
      }
    ) {
      images: nodes {
        name
        childImageSharp {
          gatsbyImageData(layout: CONSTRAINED)
        }
      }
    }
  }
`;

const NotFoundPage = ({ data }) => {
  const { colorMode } = useSettings();
  const isContrast = useContrast();
  const sheepImage = data.imagefiles.images.find(
    image => image.name === 'Sheep',
  )?.childImageSharp.gatsbyImageData;

  const sheepImageDark = data.imagefiles.images.find(
    image => image.name === 'Sheep-darkmode',
  )?.childImageSharp.gatsbyImageData;

  return (
    <div style={{ textAlign: 'center' }} data-is-404>
      {sheepImage && (
        <ImageDisplay
          style={{ paddingInline: '20%' }}
          imgSource={
            colorMode === 'dark' || isContrast ? sheepImageDark : sheepImage
          }
          alt="Bomstasjon som sperrer veien videre. Tegning"
        />
      )}
      <Heading2>Bomtur</Heading2>

      <Paragraph>
        Adressen du forsøkte å gå til finnes ikke
        <br />
        Eller så har siden blitt flyttet til et annet sted.
      </Paragraph>
      <TextLink as={Link} to="/">
        <PrimaryButton>Gå til forsiden</PrimaryButton>
      </TextLink>
    </div>
  );
};

NotFoundPage.is404 = true;

export default NotFoundPage;

export const Head = () => <title>Not found</title>;
