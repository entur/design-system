import * as React from 'react';
import { Button } from '@entur/button';
import { Text } from '@entur/typography/beta';

export const App = ({ variant }: { variant: 'primary' | 'secondary' }) => (
  <>
    <Button variant="primary" size="medium" aria-label="Lagre" disabled>
      Lagre
    </Button>
    <Button variant={'primary'} size={`small`} loading={false}>
      Neste
    </Button>
    <Button variant="secondary" width={undefined}>
      Avbryt
    </Button>
    <Button variant={variant} title="Fri tekst">
      Dynamisk
    </Button>
    <Text variant="paragraph" size="m">
      Tekst
    </Text>
  </>
);
