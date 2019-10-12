import React from 'react';
import { theme, ComponentsProvider } from 'docz';
import * as typography from '@entur/typography';
import Menu from './UI/Menu';
import { SettingsProvider } from 'src/components/SettingsContext';

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
};

const themeConfig = {
  showPlaygroundEditor: false,
};

export default theme(themeConfig)(({ children }) => (
  <SettingsProvider>
    <div>
      <Menu />
      <main className="site-content">
        <ComponentsProvider components={componentMap}>
          {children}
        </ComponentsProvider>
      </main>
    </div>
  </SettingsProvider>
));
