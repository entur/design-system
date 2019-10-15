import React from 'react';
import { theme, ComponentsProvider, useCurrentDoc } from 'docz';
import * as typography from '@entur/typography';
import { ToastProvider } from '@entur/alert';
import SiteFooter from 'src/components/SiteFooter';
import { SettingsProvider } from 'src/components/SettingsContext';
import Menu from './UI/Menu';

import './index.scss';
import Divider from 'src/components/Divider';

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
};

const themeConfig = {
  showPlaygroundEditor: false,
};

export default theme(themeConfig)(({ children }) => {
  return (
    <SettingsProvider>
      <ToastProvider>
        <Menu />
        <div className="site-content">
          <ComponentsProvider components={componentMap}>
            <main>{children}</main>
            <SiteFooter />
          </ComponentsProvider>
        </div>
      </ToastProvider>
    </SettingsProvider>
  );
});
