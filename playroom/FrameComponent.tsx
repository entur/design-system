import React from 'react';
import { TestBench } from '../src/components/TestBench';
import { Label } from '@entur/typography';
import { Switch } from '@entur/form';
import { Contrast } from '@entur/layout';

const FrameComponent = ({ children }) => {
  const [contrast, setContrast] = React.useState(false);
  const Element = contrast ? Contrast : 'div';
  return (
    <Element>
      <div style={{ paddingBottom: '1rem' }}>
        <Label>
          Kontrast
          <Switch checked={contrast} onChange={() => setContrast(!contrast)} />
        </Label>
      </div>
      <div style={{ margin: '2rem' }}>
        <TestBench />
      </div>
      {children}
    </Element>
  );
};

export default FrameComponent;
