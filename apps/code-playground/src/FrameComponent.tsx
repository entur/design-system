import React from 'react';

import { Label } from '@entur/typography';
import { Switch } from '@entur/form';
import { ToastProvider } from '@entur/alert';

import { TestBench } from './TestBench';

type FrameComponentProps = {
  children: React.ReactNode;
};

const FrameComponent = ({ children }: FrameComponentProps) => {
  const [contrast, setContrast] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(false);

  React.useEffect(() => {
    document.documentElement.setAttribute(
      'data-color-mode',
      darkMode ? 'dark' : 'light',
    );
    document.documentElement.setAttribute(
      'class',
      contrast ? 'eds-contrast' : '',
    );
  }, [darkMode, contrast]);

  return (
    <ToastProvider>
      <div style={{ paddingBottom: '1rem', display: 'flex', gap: '1rem' }}>
        <Label>
          Dark mode
          <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
        </Label>
        <Label>
          Kontrast
          <Switch checked={contrast} onChange={() => setContrast(!contrast)} />
        </Label>
      </div>
      <div style={{ margin: '2rem' }}>
        <TestBench />
      </div>
      {children}
    </ToastProvider>
  );
};

export default FrameComponent;
