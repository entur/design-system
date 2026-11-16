import { useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { ToastProvider, useToast } from '@entur/alert';

import '@entur/tokens/styles';
import '@entur/alert/styles';
import '@entur/button/styles';
import '@entur/icons/styles';
import '@entur/tooltip/styles';
import '@entur/typography/styles';

function ToastTrigger() {
  const { addToast } = useToast();
  const count = useRef(0);
  return (
    <button type="button" onClick={() => addToast(`Toast ${++count.current}`)}>
      Show toast
    </button>
  );
}

createRoot(document.getElementById('root')!).render(
  <ToastProvider delay={1500}>
    <main>
      <ToastTrigger />
      <button type="button">After trigger</button>
    </main>
  </ToastProvider>,
);
