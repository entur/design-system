import React, { useEffect } from 'react';

import { useCurrentDoc } from 'docz';
import classNames from 'classnames';

import { SkipToContent } from '@entur/a11y';

import SEO from '~/gatsby-theme-docz/base/Seo';
import FrontPageFooter from '~/components/FrontPageFooter';
import SiteFooter from '~/components/SiteFooter';
import { TocNavigation } from '~/components/TocNavigation';
import { useSettings } from '~/utils/Providers/SettingsContext';
import { Media } from '~/utils/Providers/MediaBreakpoint';

import Menu from './Menu';
import MobileMenu from './MobileMenu';
import { Contrast } from '@entur/layout';

export const Page = ({ children }: { children: React.ReactNode }) => {
  const { colorMode } = useSettings();
  const isFrontPage = useCurrentDoc().frontpage;
  const [openMobileMenu, setOpenMobileMenu] = React.useState(false);

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-color-mode',
      colorMode ?? 'dark',
    );
  }, [colorMode]);

  return (
    <>
      <SkipToContent mainId="site-content">Gå til hovedinnhold</SkipToContent>
      <SEO />
      {isFrontPage ? (
        <>
          <Contrast>
            <Media at="mobile">
              <MobileMenu
                className="ui-menu--mobile"
                openMenu={setOpenMobileMenu}
                frontPage
              />
            </Media>
            <Media greaterThanOrEqual="desktop">
              <Menu className="ui-menu--desktop" />
            </Media>
          </Contrast>
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
      )}
    </>
  );
};
