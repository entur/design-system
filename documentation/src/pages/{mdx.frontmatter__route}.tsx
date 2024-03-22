import * as React from 'react';
import { graphql } from 'gatsby';
import DocLayout from '../layouts/DocLayout';
import { SEO } from '../components/seo/SEO';
import { SettingsProvider, useSettings } from '../contexts/SettingsContext';
import { useEffect } from 'react';
import { MediaContextProvider } from '../contexts/MediaBreakpoint';

interface DocsRouteProps {
  children: React.ReactNode;
  data: {
    mdx: {
      frontmatter: {
        title: string;
      };
    };
  };
}

const DocsRouteContent: React.FC<DocsRouteProps> = ({ data, children }) => {
  const { frontmatter } = data.mdx;
  const { colorMode } = useSettings();

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-color-mode',
      colorMode ?? 'dark',
    );
  }, [colorMode]);

  return <DocLayout pageTitle={frontmatter.title}>{children}</DocLayout>;
};

// TODO Fix errors on SettingsProvider and MediaContextProvider
const DocsRoute: React.FC<DocsRouteProps> = props => (
  <SettingsProvider>
    <MediaContextProvider>
      <DocsRouteContent {...props} />
    </MediaContextProvider>
  </SettingsProvider>
);

export const query = graphql`
  query ($id: String) {
    mdx(id: { eq: $id }) {
      frontmatter {
        title
      }
    }
  }
`;

// TODO SEO
interface HeadProps {
  data: {
    mdx: {
      frontmatter: {
        title: string;
      };
    };
  };
}

export const Head: React.FC<HeadProps> = ({ data }: HeadProps) => {
  const { frontmatter } = data.mdx;
  return <SEO title={frontmatter.title} />;
};

export default DocsRoute;
