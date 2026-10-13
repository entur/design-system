import React from 'react';
import {
  Modal,
  Paragraph,
  PrimaryButton,
  SecondaryButton,
  NegativeButton,
  ButtonGroup,
  TextField,
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

// Modals render through a native <dialog>.showModal() (top layer, portal to body),
// so each export opens its own modal. Needs cardMode "single" in the product card.

export const Medium = () => (
  <>
    <BlurFocus />
    <Modal open onDismiss={() => undefined} title="Endre reisen" size="medium">
      <Paragraph>
        Du kan endre avgangstid frem til 15 minutter før avreise.
        Prisforskjellen blir belastet eller refundert automatisk.
      </Paragraph>
      <ButtonGroup>
        <PrimaryButton>Velg ny avgang</PrimaryButton>
        <SecondaryButton>Avbryt</SecondaryButton>
      </ButtonGroup>
    </Modal>
  </>
);

export const SmallConfirm = () => (
  <>
    <BlurFocus />
    <Modal
      open
      onDismiss={() => undefined}
      title="Kansellere billetten?"
      size="small"
    >
      <Paragraph>
        Billetten Oslo S – Bergen 12. juni blir kansellert, og 649 kr refunderes
        til kortet ditt.
      </Paragraph>
      <ButtonGroup>
        <NegativeButton>Kanseller billett</NegativeButton>
        <SecondaryButton>Behold billetten</SecondaryButton>
      </ButtonGroup>
    </Modal>
  </>
);

export const ExtraSmallCentered = () => (
  <>
    <BlurFocus />
    <Modal
      open
      onDismiss={() => undefined}
      title="Billetten er sendt"
      size="extraSmall"
      align="center"
    >
      <Paragraph>Vi har sendt billetten til ola.nordmann@example.no.</Paragraph>
      <PrimaryButton>Den er grei</PrimaryButton>
    </Modal>
  </>
);

export const WithForm = () => (
  <>
    <BlurFocus />
    <Modal open onDismiss={() => undefined} title="Lagre reise" size="small">
      <div style={{ marginBottom: 'var(--space-large)' }}>
        <TextField label="Navn på reisen" defaultValue="Hjem fra jobb" />
      </div>
      <ButtonGroup>
        <PrimaryButton>Lagre</PrimaryButton>
        <SecondaryButton>Avbryt</SecondaryButton>
      </ButtonGroup>
    </Modal>
  </>
);
