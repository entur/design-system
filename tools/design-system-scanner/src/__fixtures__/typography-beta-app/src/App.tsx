import * as React from 'react';
import { Heading, Text } from '@entur/typography/beta';
import { Heading1 } from '@entur/typography';
import fontUrl from '@entur/typography/fonts/Entur-Nationale-Medium.woff2?url';

export const App = () => (
  <div style={{ ['--font-url' as string]: fontUrl }}>
    <Heading as="h1" variant="title-1">
      New typography
    </Heading>
    <Text variant="paragraph">Body copy on the new component.</Text>
    <Text variant="paragraph">A second paragraph.</Text>
    <Heading1>Still on the old component</Heading1>
    <p className="eds-h2 custom-heading">Hand-written internal class</p>
  </div>
);
