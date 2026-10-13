import React, { useState } from 'react';
import { Stepper } from '@entur/linje';

const steps = ['Velg reise', 'Reisende', 'Betaling', 'Kvittering'];

export const Default = () => (
  <div style={{ width: 520 }}>
    <Stepper steps={steps} activeIndex={1} />
  </div>
);

export const Interactive = () => {
  const [active, setActive] = useState(2);
  return (
    <div style={{ width: 520 }}>
      <Stepper
        steps={steps}
        activeIndex={active}
        onStepClick={setActive}
        interactive
      />
    </div>
  );
};

export const WithoutStepIndex = () => (
  <div style={{ width: 520 }}>
    <Stepper
      steps={['Billettype', 'Sone', 'Betaling']}
      activeIndex={1}
      showStepperIndex={false}
    />
  </div>
);

export const LastStepActive = () => (
  <div style={{ width: 520 }}>
    <Stepper steps={steps} activeIndex={3} />
  </div>
);
