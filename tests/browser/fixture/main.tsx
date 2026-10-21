import { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { SkipToContent } from '@entur/a11y';
import { ExpandablePanel } from '@entur/expand';
import { Modal } from '@entur/modal';

import '@entur/tokens/styles';
import '@entur/a11y/styles';
import '@entur/button/styles';
import '@entur/expand/styles';
import '@entur/icons/styles';
import '@entur/modal/styles';
import '@entur/typography/styles';

function ModalFixture() {
  const [open, setOpen] = useState(false);
  const initialFocusRef = useRef<HTMLInputElement>(null);
  const customFocus = new URLSearchParams(window.location.search).has(
    'customFocus',
  );

  return (
    <main>
      <button type="button">Before modal</button>
      <button type="button" onClick={() => setOpen(true)}>
        Open modal
      </button>
      <button type="button">After modal</button>
      <Modal
        title="Travel preferences"
        size="small"
        open={open}
        onDismiss={() => setOpen(false)}
        closeLabel="Close modal"
        initialFocusRef={customFocus ? initialFocusRef : undefined}
      >
        <label htmlFor="destination">Destination</label>
        <input id="destination" ref={initialFocusRef} />
        <button type="button" onClick={() => setOpen(false)}>
          Save preferences
        </button>
      </Modal>
    </main>
  );
}

function SkipLinkFixture() {
  return (
    <>
      <SkipToContent>Skip to main content</SkipToContent>
      <nav aria-label="Primary">
        <a href="#navigation-destination">Navigation link</a>
      </nav>
      <main id="main-content" tabIndex={-1}>
        <h1>Main content</h1>
        <a href="#content-destination">Main content link</a>
      </main>
    </>
  );
}

function ExpandFixture() {
  return (
    <main>
      <button type="button">Before panel</button>
      <ExpandablePanel title="Journey details">
        <label htmlFor="passenger">Passenger name</label>
        <input id="passenger" />
        <a href="#journey-destination">Journey link</a>
      </ExpandablePanel>
      <button type="button">After panel</button>
    </main>
  );
}

const scenario = new URLSearchParams(window.location.search).get('scenario');
const Fixture =
  scenario === 'skip-link'
    ? SkipLinkFixture
    : scenario === 'expand'
    ? ExpandFixture
    : ModalFixture;

createRoot(document.getElementById('root')!).render(<Fixture />);
