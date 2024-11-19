import React from 'react';
import { useSiteMetadata } from '../../hooks/use-site-metadata';
import { useStaticQuery, graphql } from 'gatsby';

export type SEOProps = {
  title?: string;
  description?: string;
  image?: string;
  pathname?: string;
  children?: React.ReactNode;
};

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  image,
  pathname,
  children,
}) => {
  const {
    title: defaultTitle,
    description: defaultDescription,
    siteUrl,
  } = useSiteMetadata();

  const { seoImage, seoFavicon } = useStaticQuery(graphql`
    query {
      seoImage: file(relativePath: { eq: "images/seo/City.png" }) {
        publicURL
      }
      seoFavicon: file(relativePath: { eq: "images/seo/favicon.ico" }) {
        publicURL
      }
    }
  `);

  const seoImageUrl = seoImage.publicURL;
  const seoFaviconUrl = seoFavicon.publicURL;

  const SEO = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    image: `${siteUrl}${image || seoImageUrl}`,
    url: `${siteUrl}${pathname || ``}`,
  };

  return (
    <>
      <html lang="nb" />
      <title>
        {SEO.title} | {defaultTitle}
      </title>
      <meta name="description" content={SEO.description} />
      <meta name="image" content={SEO.image} />
      <meta property="og:url" content={SEO.url} />
      <meta property="og:title" content={SEO.title} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="nb_NO" />
      <link rel="shortcut icon" type="image/png" href={seoFaviconUrl} />
      {children}
    </>
  );
};
