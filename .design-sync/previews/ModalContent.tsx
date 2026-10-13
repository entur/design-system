import React from 'react';
import {
  ModalContent,
  Paragraph,
  PrimaryButton,
  SecondaryButton,
  ButtonGroup,
} from '@entur/linje';

// ModalContent is the styled panel inside Modal; shown inline here (no overlay).

export const Small = () => (
  <ModalContent size="small" title="Kansellere billetten?">
    <Paragraph>
      649 kr refunderes til kortet ditt innen fem virkedager.
    </Paragraph>
    <ButtonGroup>
      <PrimaryButton>Kanseller</PrimaryButton>
      <SecondaryButton>Behold</SecondaryButton>
    </ButtonGroup>
  </ModalContent>
);

export const ExtraSmall = () => (
  <ModalContent size="extraSmall" title="Setet er reservert">
    <Paragraph margin="none">Vogn 3, sete 42 (vindu).</Paragraph>
  </ModalContent>
);

export const ExtraSmallCentered = () => (
  <ModalContent size="extraSmall" title="Billetten er sendt" align="center">
    <Paragraph>Sjekk innboksen din.</Paragraph>
    <PrimaryButton>Den er grei</PrimaryButton>
  </ModalContent>
);
