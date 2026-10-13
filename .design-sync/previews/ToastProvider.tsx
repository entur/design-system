import React from 'react';
import {
  ToastProvider,
  useToast,
  SecondaryButton,
  Paragraph,
} from '@entur/linje';

// Toasts only exist after addToast() is called, so each cell fires one on mount.
// A very long delay keeps them on screen for the static capture.
const LONG = 2_000_000_000;

const FireToasts = ({
  toasts,
}: {
  toasts: Parameters<ReturnType<typeof useToast>['addToast']>[0][];
}) => {
  const { addToast } = useToast();
  const fired = React.useRef(false);
  React.useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    toasts.forEach(t => addToast(t));
  }, []);
  return null;
};

const Page = () => (
  <div style={{ padding: 'var(--space-large)' }}>
    <Paragraph margin="bottom">
      Velg billettype og antall reisende for å fortsette.
    </Paragraph>
    <SecondaryButton>Kjøp billett</SecondaryButton>
  </div>
);

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{ position: 'relative', height: 420, transform: 'translateZ(0)' }}
  >
    {children}
  </div>
);

export const WithToast = () => (
  <Frame>
    <ToastProvider delay={LONG}>
      <Page />
      <FireToasts
        toasts={[
          {
            title: 'Billetten er kjøpt',
            content: 'Du finner billetten under Mine billetter.',
          },
        ]}
      />
    </ToastProvider>
  </Frame>
);

export const Stacked = () => (
  <Frame>
    <ToastProvider delay={LONG}>
      <Page />
      <FireToasts
        toasts={[
          {
            title: 'Reisen er lagret',
            content: 'Vi varsler deg om endringer på avgangen.',
            variant: 'information',
          },
          {
            title: 'Kopiert!',
            content: 'Billettnummeret ble kopiert til utklippstavlen.',
          },
        ]}
      />
    </ToastProvider>
  </Frame>
);

export const TopRight = () => (
  <Frame>
    <ToastProvider delay={LONG} position="top-right">
      <Page />
      <FireToasts
        toasts={[
          {
            title: 'Innstillinger oppdatert',
            content: 'Varslene dine er slått på.',
            variant: 'information',
          },
        ]}
      />
    </ToastProvider>
  </Frame>
);
