// Runs in the sandboxed playground iframe, which has no origin of its own. Code
// from a document runs here, out of reach of Studio's login and API access.
// First, so the storage is in place before any other module runs
import './memoryStorage';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ToastProvider } from '@entur/alert';
import Playground from '@components/Playground/Playground';
import { SettingsProvider } from '@providers/SettingsContext';
import '../../../documentation/src/styles/index.scss';

function Sandbox() {
  const [props, setProps] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source === parent && event.data?.type === 'render') {
        setProps(event.data.props);
      }
    };
    addEventListener('message', onMessage);
    parent.postMessage({ type: 'ready' }, '*');

    const observer = new ResizeObserver(() =>
      parent.postMessage(
        { type: 'height', height: document.documentElement.scrollHeight },
        '*',
      ),
    );
    observer.observe(document.body);
    return () => {
      removeEventListener('message', onMessage);
      observer.disconnect();
    };
  }, []);

  return props ? (
    <SettingsProvider>
      <ToastProvider>
        <Playground {...props} />
      </ToastProvider>
    </SettingsProvider>
  ) : null;
}

createRoot(document.getElementById('root') as HTMLElement).render(<Sandbox />);
