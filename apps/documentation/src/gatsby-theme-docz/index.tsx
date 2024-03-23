import React from 'react';
import { ComponentsProvider, theme } from 'docz';
// import { ComponentsProvider, theme, useCurrentDoc } from 'docz';
// import classNames from 'classnames';
import * as typography from '@entur/typography';
import { ToastProvider } from '@entur/alert';
// import { SkipToContent } from '@entur/a11y';
import { ColorsProvider } from '~/components/Colors';
// import SiteFooter from '~/components/SiteFooter';
// import FrontPageFooter from '~/components/FrontPageFooter';
import { SettingsProvider } from '~/components/SettingsContext';
// import { TocNavigation } from '~/components/TocNavigation';
// import SEO from '~/gatsby-theme-docz/base/Seo';
import Props from '~/components/Props';
// import Menu from './UI/Menu';
// import FrontPageMenu from './UI/FrontPageMenu';
// import MobileMenu from './UI/MobileMenu';
import { MediaContextProvider } from '~/utils/MediaBreakpoint';
// import { MediaContextProvider, Media } from '~/utils/MediaBreakpoint';
import './index.scss';
import { Page } from './UI/Page';

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
  // const isFrontPage = useCurrentDoc().frontpage;
  // const [openMobileMenu, setOpenMobileMenu] = React.useState(false);
  return (
    <SettingsProvider>
      <ToastProvider>
        <MediaContextProvider>
          <ColorsProvider>
            <ComponentsProvider components={componentMap}>
              <Page>{children}</Page>
              {/* <SkipToContent mainId="site-content">
                Gå til hovedinnhold
              </SkipToContent>
              {isFrontPage ? (
                <>
                  <SEO title="Velkommen til Enturs designsystem" />
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
                    <main>{children}</main>
                    <FrontPageFooter />
                  </div>
                </>
              ) : (
                <>
                  <SEO />
                  <Media at="mobile">
                    <MobileMenu
                      className={classNames(
                        'ui-menu--mobile ui-menu--mobile-not-frontpage',
                        {
                          'ui-menu--mobile-open-sidemenu': openMobileMenu,
                        },
                      )}
                      openMenu={setOpenMobileMenu}
                    />
                  </Media>
                  <div className={'page'}>
                    <Media greaterThanOrEqual="desktop">
                      <Menu className="ui-menu--desktop" />
                    </Media>
                    <div
                      className={classNames('site-content', {
                        'site-content--hidden': openMobileMenu,
                      })}
                    >
                      <main id="site-content">{children}</main>
                      <TocNavigation />
                      <SiteFooter />
                    </div>
                  </div>
                </>
              )} */}
            </ComponentsProvider>
          </ColorsProvider>
        </MediaContextProvider>
      </ToastProvider>
    </SettingsProvider>
  );
};

export default theme({})(App);
