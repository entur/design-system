import { createRoot } from 'react-dom/client';
import { VisuallyHidden } from '@entur/a11y';

import '@entur/tokens/styles';
import '@entur/a11y/styles';

createRoot(document.getElementById('root')!).render(
  <main>
    <p>
      Visible text
      <VisuallyHidden className="consumer-class">Hidden text</VisuallyHidden>
    </p>
  </main>,
);
