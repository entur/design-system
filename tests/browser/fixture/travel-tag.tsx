import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { TravelTag } from '@entur/travel';

import '@entur/tokens/styles';
import '@entur/icons/styles';
import '@entur/travel/styles';
import '@entur/typography/styles';

function TravelTagFixture() {
  const [shown, setShown] = useState(true);
  return (
    <main>
      {shown && (
        <TravelTag transport="bus" onClose={() => setShown(false)}>
          31
        </TravelTag>
      )}
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<TravelTagFixture />);
