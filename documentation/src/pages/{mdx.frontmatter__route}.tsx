import * as React from 'react';
import { useEffect } from 'react';
import DocLayout from '../layouts/DocLayout';
import { useSettings } from '../providers/SettingsContext';

interface DocsRouteProps {
  children: React.ReactNode;
  data?: {
    mdx: {
      frontmatter: {
        title: string;
        description: string;
      };
    };
  };
}

const DocsRouteContent: React.FC<DocsRouteProps> = ({ children }) => {
  const { colorMode } = useSettings();

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-color-mode',
      colorMode ?? 'dark',
    );
  }, [colorMode]);

  return <DocLayout>{children}</DocLayout>;
};

const DocsRoute: React.FC<DocsRouteProps> = props => (
  <DocsRouteContent {...props} />
);

export default DocsRoute;
