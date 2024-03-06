import React from 'react';

import { Label } from '@entur/typography';
import { Switch } from '@entur/form';
import { ToastProvider } from '@entur/alert';

import { TestBench } from './TestBench';
import { Contrast } from '@entur/layout';

type FrameComponentProps = {
  children: React.ReactNode;
};

const FrameComponent = ({ children }: FrameComponentProps) => {
  const [contrast, setContrast] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.setAttribute(
      'data-color-mode',
      darkMode ? 'light' : 'dark',
    );
  };
  const toggleContrast = () => {
    setContrast(!contrast);
  };

  const Element = contrast ? Contrast : 'div';

  return (
    <Element className="code-playground__wrapper">
      <ToastProvider>
        <div style={{ paddingBottom: '1rem', display: 'flex', gap: '1rem' }}>
          <Label>
            Dark mode
            <Switch checked={darkMode} onChange={toggleDarkMode} />
          </Label>
          <Label>
            Kontrast
            <Switch checked={contrast} onChange={toggleContrast} />
          </Label>
        </div>
        <div style={{ margin: '2rem' }}>
          <TestBench />
        </div>
        {children}
      </ToastProvider>
    </Element>
  );
};

export default FrameComponent;
