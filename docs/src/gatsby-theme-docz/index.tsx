import React from 'react';
import { theme, ComponentsProvider, useCurrentDoc } from 'docz';
import * as typography from '@entur/typography';
import Menu from './UI/Menu';
import { SettingsProvider } from 'src/components/SettingsContext';

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

const { Link } = typography;

export default theme(themeConfig)(({ children }) => {
  const { filepath } = useCurrentDoc();
  return (
    <SettingsProvider>
      <Menu />
      <div className="site-content">
        <ComponentsProvider components={componentMap}>
          <main>{children}</main>
          <footer className="site-footer">
            <Divider />
            Kontakt oss på{' '}
            <Link href="https://entur.slack.com/messages/C899QSPB7">
              #talk-designsystem
            </Link>{' '}
            i Slack, eller send oss en{' '}
            <Link href="mailto:nicolai.fredriksen@entur.org">mail</Link>.{' '}
            <Link
              href={`https://bitbucket.org/enturas/design-system/src/master/docs/${filepath}?mode=edit&spa=0&at=master&fileviewer=file-view-default`}
            >
              Endre siden
            </Link>
          </footer>
        </ComponentsProvider>
      </div>
    </SettingsProvider>
  );
});
