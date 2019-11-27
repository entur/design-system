import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useCurrentDoc } from 'docz';
import { Location } from '@reach/router';
import ogImageSrc from './ogImage.jpg';

type SeoProps = {
  /** En beskrivelse av siden, maks 155 tegn */
  description?: string;
  /** URL til et bilde på siden */
  image?: string;
  /** Tittelen på siden */
  title?: string;
};

const SEO: React.FC<SeoProps> = props => {
  const currentDoc = useCurrentDoc() || {};
  const title = currentDoc.name || props.title || 'Entur Designsystem';
  const description =
    currentDoc.description ||
    props.description ||
    'Her finner du alt du trenger å vite om Entur sitt designsystem';
  const image = currentDoc.image || ogImageSrc;
  return (
    <Location>
      {({ location }) => (
        <Helmet>
          <html lang="nb-no" />
          <title>{currentDoc.name || title} | Entur Designsystem</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:type" content="website" />
          <meta
            property="og:url"
            content={`https://design.entur.org${location.pathname}`}
          />
          <meta
            property="og:image"
            content={`https://design.entur.org${image}`}
          />
          <meta property="og:description" content={description} />
          <meta property="og:locale" content="nb_NO" />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          {props.children}
        </Helmet>
      )}
    </Location>
  );
};

export default SEO;
