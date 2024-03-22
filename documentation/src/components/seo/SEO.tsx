import React from 'react';
import { useSiteMetadata } from '../../hooks/use-site-metadata';

interface SeoProps {
  title?: string;
  description?: string;
  pathname?: string;
  children?: React.ReactNode;
}

export const SEO: React.FC<SeoProps> = ({
  title,
  description,
  pathname,
  children,
}) => {
  const {
    title: defaultTitle,
    description: defaultDescription,
    image,
    url,
  } = useSiteMetadata();

  const SEO = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    image: `${url}${image}`,
    url: `${url}${pathname || ``}`,
  };
  return (
    <>
      <title>
        {SEO.title} | {defaultTitle}
      </title>
      <meta name="description" content={SEO.description} />
      <meta name="image" content={SEO.image} />
      <link
        rel="icon"
        type="image/png"
        href="../images/EN-app-logo-512x512.png"
      />
      {children}
    </>
  );
};
