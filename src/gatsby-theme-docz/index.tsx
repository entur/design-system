import React from 'react';
import { ComponentsProvider, theme, useCurrentDoc } from 'docz';
import * as typography from '@entur/typography';
import { ToastProvider } from '@entur/alert';
import { SkipToContent } from '@entur/a11y';
import SiteFooter from '~/components/SiteFooter';
import FrontPageFooter from '~/components/FrontPageFooter';
import { SettingsProvider } from '~/components/SettingsContext';
import SEO from '~/gatsby-theme-docz/base/Seo';
import Props from '~/components/Props';
import Menu from './UI/Menu';
import FrontPageMenu from './UI/FrontPageMenu';
import MobileMenu from './UI/MobileMenu';
import classNames from 'classnames';
import { createMedia } from '@artsy/fresnel';
import { breakpoints } from '@entur/tokens';
import './index.scss';

const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    mobile: 0,
    desktop: breakpoints.large,
  },
});

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
  ul: typography.UnorderedList,
  li: typography.ListItem,
  ol: typography.NumberedList,
  props: Props,
};

const App: React.FC = ({ children }) => {
  const isFrontPage = useCurrentDoc().frontpage;
  const [openMobileMenu, setOpenMobileMenu] = React.useState(false);
  return (
    <SettingsProvider>
      <ToastProvider>
        <MediaContextProvider>
          <ComponentsProvider components={componentMap}>
            <SkipToContent mainId="site-content">
              Gå til hovedinnhold
            </SkipToContent>
            {isFrontPage ? (
              <>
                <SEO title="Velkommen" />
                <Media at="mobile">
                  <MobileMenu
                    className="ui-menu--mobile"
                    openMenu={setOpenMobileMenu}
                    frontPage
                  />
                </Media>
                <Media greaterThanOrEqual="desktop">
                  <FrontPageMenu className="ui-menu--desktop" />
                </Media>
                <div
                  className={classNames('frontpage__site-content-wrapper', {
                    'frontpage__site-content-wrapper--hidden': openMobileMenu,
                  })}
                >
                  <div className="frontpage-blue-backer" />
                  <main id="site-content" className="frontpage-site-content">
                    {children}
                  </main>
                  <FrontPageFooter />
                </div>
              </>
            ) : (
              <>
                <SEO />
                <Media at="mobile">
                  <MobileMenu
                    className="ui-menu--mobile"
                    openMenu={setOpenMobileMenu}
                  />
                </Media>
                <Media greaterThanOrEqual="desktop">
                  <Menu className="ui-menu--desktop" />
                </Media>
                <div
                  className={classNames('site-content', {
                    'site-content--hidden': openMobileMenu,
                  })}
                >
                  <main id="site-content">{children}</main>
                  <SiteFooter />
                </div>
              </>
            )}
          </ComponentsProvider>
        </MediaContextProvider>
      </ToastProvider>
    </SettingsProvider>
  );
};
export default theme({})(App);
