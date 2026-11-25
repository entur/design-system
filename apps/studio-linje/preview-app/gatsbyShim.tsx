// Stands in for `gatsby` when the docs components render in the Studio preview
import React from 'react';

const SITE = 'https://linje.entur.no';

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

// The preview is not the site, so internal links open the published page
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ to, children, ...rest }, ref) => (
    <a ref={ref} href={SITE + to} target="_blank" rel="noreferrer" {...rest}>
      {children}
    </a>
  ),
);

export const graphql = () => null;
export const navigate = (to: string) => window.open(SITE + to, '_blank');
export const useStaticQuery = () => ({});
