import React from 'react';
import {
  ModalOverlay,
  ModalContent,
  Paragraph,
  PrimaryButton,
  SecondaryButton,
  ButtonGroup,
} from '@entur/linje';

// The component moves focus to its title/dialog on open (a11y behaviour); drop that
// programmatic focus ring after mount so the static preview shows the resting look.
const BlurFocus = () => {
  React.useEffect(() => {
    const t = setTimeout(
      () => (document.activeElement as HTMLElement | null)?.blur?.(),
      150,
    );
    return () => clearTimeout(t);
  }, []);
  return null;
};

// ModalOverlay is the native <dialog> backdrop layer used by Modal/Drawer; here with
// a ModalContent panel inside. Rendered open via showModal() - needs cardMode "single".

export const WithContent = () => (
  <>
    <BlurFocus />
    <ModalOverlay
      open
      onDismiss={() => undefined}
      aria-label="Bytt avgang"
      style={{ maxWidth: '28.125rem' }}
    >
      <ModalContent size="small" title="Bytt avgang">
        <Paragraph>
          Toget kl. 08:12 er innstilt. Vil du bytte til neste avgang kl. 08:42?
        </Paragraph>
        <ButtonGroup>
          <PrimaryButton>Bytt avgang</PrimaryButton>
          <SecondaryButton>Nei takk</SecondaryButton>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  </>
);
