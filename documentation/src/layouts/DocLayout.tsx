import * as React from 'react';
import classNames from 'classnames';
import { graphql, useStaticQuery } from 'gatsby';
import { MenuItem } from '../components/Navigations/SideNavigation/utils';
import { SideNavigation } from '../components/Navigations/SideNavigation/SideNavigation';
import { MobileSideNavigation } from '../components/Navigations/SideNavigation/MobileSideNavigation';
import { TableOfContent } from '../components/Navigations/TableOfContent/TableOfContent';
import { Media } from '../contexts/MediaBreakpoint';
import TopNavigationLayout from './TopNavigationLayout';

import { MDXProvider } from '@mdx-js/react';
import { Playground } from '../components/Playground/Playground';

const preToCodeBlock = preProps => {
  console.log('preProps:', preProps); // Log the full preProps to inspect

  if (
    preProps.children &&
    typeof preProps.children === 'object' &&
    preProps.children.props &&
    preProps.children.type === 'code'
  ) {
    const { children: codeString, props = {} } = preProps.children || {};

    if (!codeString || typeof codeString !== 'string') {
      console.warn('Unexpected structure:', preProps.children);
      return undefined;
    }

    const { className } = props;

    return {
      codeString: codeString.trim(),
      language: className ? className.split('-')[1] : '',
      ...props,
    };
  }
  return undefined;
};

const components = {
  pre: preProps => {
    console.log('preProps:', preProps); // Log the incoming preProps to inspect

    const props = preToCodeBlock(preProps); // Call preToCodeBlock

    console.log('Processed props:', props); // Log what preToCodeBlock returns

    // Check if props were successfully extracted
    if (props) {
      console.log('Rendering Playground with props:', props);
      return <Playground {...props} />;
    } else {
      // If no valid props, render the default <pre> block
      console.log('Rendering default <pre> block:', preProps);
      return <pre {...preProps} />;
    }
  },
};

interface LayoutProps {
  pageTitle: string;
  children: React.ReactNode;
}
//TODO graphql query kan flyttes til pages mdx.frontmatter__route.tsx?
const DocLayout: React.FC<LayoutProps> = ({
  pageTitle,
  children,
}: LayoutProps) => {
  const data = useStaticQuery(graphql`
    query {
      allMdx {
        nodes {
          frontmatter {
            title
            route
            parent
            menu
            order
            hide
          }
          id
        }
      }
    }
  `);
  const menuItems: MenuItem[] = data.allMdx.nodes;

  const [openSidebar, setOpenSidebar] = React.useState(false);

  return (
    <div className="page">
      <TopNavigationLayout />
      <Media greaterThanOrEqual="desktop">
        <SideNavigation menuItems={menuItems} />
      </Media>
      <Media at="mobile">
        <MobileSideNavigation
          menuItems={menuItems}
          openSidebar={openSidebar}
          setOpenSidebar={setOpenSidebar}
        />
      </Media>

      <div
        className={classNames('site-content', {
          'site-content--hidden': openSidebar,
        })}
      >
        <main id="site-content">
          {' '}
          <MDXProvider components={components}>{children}</MDXProvider>
        </main>
        <TableOfContent />
      </div>
    </div>
  );
};

export default DocLayout;
