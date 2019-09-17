import React from 'react';
import { theme, ComponentsProvider } from 'docz';
import * as typography from '@entur/typography';
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
};

export default theme({})(({ children }) => (
  <div>
    <div className="components-provider-wrapper">
      <Menu />
      <div className="content-wrapper">
        <ComponentsProvider components={componentMap}>
          <div className="content-container">{children}</div>
        </ComponentsProvider>
      </div>
    </div>
  </div>
));
