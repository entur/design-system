import React from 'react';
import { ComponentsProvider, theme, useCurrentDoc } from 'docz';
import * as typography from '@entur/typography';
import { ToastProvider } from '@entur/alert';
import { SkipToContent } from '@entur/a11y';
import SiteFooter from '~/components/SiteFooter';
import FrontPageFooter from '~/components/FrontPageFooter';
import { SettingsProvider } from '~/components/SettingsContext';
import SettingsPanel from '~/components/SettingsPanel';
import SEO from '~/gatsby-theme-docz/base/Seo';
import Props from '~/components/Props';
import Menu from './UI/Menu';
import FrontPageMenu from './UI/FrontPageMenu';

import './index.scss';

const componentMap = {
  h1: typography.Heading1,
  h2: typography.Heading2,
  h3: typography.Heading3,
  h4: typography.Heading4,
  h5: typography.Heading5,
  h6: typography.Heading6,
  p: typography.Paragraph,
  a: typography.Link,
  pre: typography.PreformattedText,
  strong: typography.StrongText,
  inlineCode: typography.CodeText,
  props: Props,
};

const App: React.FC = ({ children }) => {
  const isFrontPage = useCurrentDoc().frontpage;
  return (
    <SettingsProvider>
      <ToastProvider>
        <ComponentsProvider components={componentMap}>
          <SkipToContent mainId="site-content">
            Gå til hovedinnhold
          </SkipToContent>
          {isFrontPage ? (
            <>
              <SEO title="Velkommen" />
              <FrontPageMenu />
              <div className="blueback">
                <div className="oi" />
                <main id="site-content" className="frontpage-site-content">
                  {children}
                </main>
              </div>
              <FrontPageFooter />
            </>
          ) : (
            <>
              <SEO />
              <Menu />
              <div className="site-content">
                <main id="site-content">{children}</main>
                <SiteFooter />
              </div>
            </>
          )}
          <SettingsPanel />
        </ComponentsProvider>
      </ToastProvider>
    </SettingsProvider>
  );
};
export default theme({})(App);
