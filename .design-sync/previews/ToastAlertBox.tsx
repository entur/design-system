import React from 'react';
import { ToastAlertBox } from '@entur/linje';

export const Success = () => (
  <ToastAlertBox variant="success" title="Billetten er kjøpt">
    Du finner billetten under Mine billetter.
  </ToastAlertBox>
);

export const Information = () => (
  <ToastAlertBox variant="information" title="Reisen er lagret">
    Vi varsler deg om endringer på avgangen.
  </ToastAlertBox>
);

export const Closable = () => (
  <ToastAlertBox
    variant="success"
    title="Kopiert!"
    closable
    closeButtonLabel="Lukk varsel"
    onClose={() => undefined}
  >
    Billettnummeret ble kopiert til utklippstavlen.
  </ToastAlertBox>
);

export const WithoutTitle = () => (
  <ToastAlertBox variant="information">
    Innstillingene dine er oppdatert.
  </ToastAlertBox>
);
