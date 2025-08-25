import React from 'react';

import { Label } from '@entur/typography';
import { Switch } from '@entur/form';
import { ToastProvider } from '@entur/alert';

import { TestBench } from './TestBench';
import { Contrast } from '@entur/layout';

//@ts-ignore
import logo from './media/logo.svg';
//@ts-ignore
import logoDark from './media/logoDark.svg';

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

  document.documentElement.style.overflow = 'visible';

  const Element = contrast ? Contrast : 'div';

  return (
    <Element className="code-playground__wrapper">
      <ToastProvider>
        <nav aria-label="Navigasjon, hovedseksjoner">
          <img
            src={darkMode || contrast ? logoDark : logo}
            height="32px"
            width="102px"
            alt="Entur logo, klikk for å gå til startsiden"
          />
        </nav>
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
