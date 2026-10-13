import React from 'react';
import { Link, Paragraph } from '@entur/linje';

export const Default = () => <Link href="#">Se alle avganger</Link>;

export const InContext = () => (
  <Paragraph style={{ maxWidth: 480 }}>
    Har du spørsmål om billetten din? Les{' '}
    <Link href="#">ofte stilte spørsmål</Link> eller ta kontakt med{' '}
    <Link href="#">kundeservice</Link>.
  </Paragraph>
);

export const External = () => (
  <Link href="https://entur.no" external>
    Reiseplanleggeren på entur.no
  </Link>
);
