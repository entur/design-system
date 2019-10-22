import React from 'react';
import { ComponentsProvider, theme } from 'docz';
import * as typography from '@entur/typography';
import { ToastProvider } from '@entur/alert';
import SiteFooter from 'src/components/SiteFooter';
import { SettingsProvider } from 'src/components/SettingsContext';
import SettingsPanel from 'src/components/SettingsPanel';
import Props from 'src/components/Props';
import Menu from './UI/Menu';

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
  inlineCode: typography.CodeText,
  props: Props,
};

const App: React.FC = ({ children }) => {
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
        <SettingsPanel />
      </ToastProvider>
    </SettingsProvider>
  );
};
export default theme({})(App);
