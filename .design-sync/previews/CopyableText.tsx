import React from 'react';
import { CopyableText, ToastProvider, Paragraph } from '@entur/linje';

// CopyableText calls useToast(), so it must sit inside a ToastProvider.
const WithToasts = ({ children }: { children: React.ReactNode }) => (
  <ToastProvider>{children}</ToastProvider>
);

export const Default = () => (
  <WithToasts>
    <CopyableText successMessage="Billettnummeret ble kopiert.">
      NSB-7F3K-92QX
    </CopyableText>
  </WithToasts>
);

export const Sizes = () => (
  <WithToasts>
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-default)',
        alignItems: 'flex-start',
      }}
    >
      <CopyableText>ENT:StopPlace:NSR:58366</CopyableText>
      <CopyableText size="small">ENT:StopPlace:NSR:58366</CopyableText>
    </div>
  </WithToasts>
);

export const InContext = () => (
  <WithToasts>
    <div style={{ width: 360 }}>
      <Paragraph margin="bottom">
        Oppgi bestillingsreferansen når du kontakter kundeservice:
      </Paragraph>
      <CopyableText
        textToCopy="ORD-2024-558190"
        successHeading="Referanse kopiert"
      >
        ORD-2024-558190
      </CopyableText>
    </div>
  </WithToasts>
);
