import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createClient } from '@sanity/client';
import { createQueryStore } from '@sanity/react-loader';
import { enableVisualEditing } from '@sanity/visual-editing';
import { isMaybePresentation } from '@sanity/presentation-comlink';
import '../../documentation/src/styles/index.scss';
import { type ComponentDoc, DocBody } from './DocBody';
import { type Page, PageBody } from './PageBody';
import { DocPicker } from './DocPicker';

// Stega hides edit links in strings. Only prose gets them: in code, props and
// ids the extra characters would break the output.
const STEGA_FIELDS = new Set([
  'text',
  'title',
  'description',
  'imageDescription',
  'alt',
]);

const client = createClient({
  projectId: 'npa0lfls',
  dataset: 'production',
  apiVersion: '2025-02-10',
  useCdn: false,
  stega: {
    // Only Presentation draws the edit overlays the hidden characters are for
    enabled: isMaybePresentation(),
    studioUrl: '/',
    // Subpage cards are links: an overlay on them would take the click
    filter: ({ sourcePath, resultPath }) =>
      STEGA_FIELDS.has(String(sourcePath.at(-1))) &&
      resultPath[0] !== 'subpages',
  },
});

const { useQuery, useLiveMode } = createQueryStore({ client, ssr: false });

// A subpage inherits the subcategory of its parent, as on the site
const QUERY = `*[_type in ["componentDoc", "page"] && _id == $id][0]{
  ...,
  "subcategory": coalesce(parentPage->subcategory, subcategory),
  "subpages": *[_type == "page" && parentPage._ref == ^._id] | order(title asc) { _id, title, description }
}`;
const getId = () => new URLSearchParams(location.search).get('id') ?? '';

// Presentation sets a cookie that lets the live mode read drafts, so the page needs no token
function LiveMode() {
  useLiveMode({ client });
  return null;
}

// Tells Presentation about navigation inside the preview, so its address bar
// and editor follow along
let notifyPresentation: ((url: string) => void) | undefined;

function App() {
  const [id, setId] = useState(getId);
  const { data, loading } = useQuery<ComponentDoc | Page | null>(QUERY, { id });
  const inPresentation = isMaybePresentation();

  const openDoc = (docId: string) => {
    const url = `${location.pathname}?id=${docId}`;
    history.pushState(null, '', url);
    setId(docId);
    notifyPresentation?.(url);
  };

  // Back and forward in the preview, e.g. from a page to the list
  useEffect(() => {
    const onPop = () => setId(getId());
    addEventListener('popstate', onPop);
    return () => removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    if (!inPresentation) return;
    return enableVisualEditing({
      history: {
        subscribe: navigate => {
          notifyPresentation = url => navigate({ type: 'push', url });
          notifyPresentation(location.pathname + location.search);
          const onPop = () =>
            navigate({ type: 'pop', url: location.pathname + location.search });
          addEventListener('popstate', onPop);
          return () => {
            notifyPresentation = undefined;
            removeEventListener('popstate', onPop);
          };
        },
        update: update => {
          if (update.type === 'pop') return history.back();
          history[update.type === 'push' ? 'pushState' : 'replaceState'](
            null,
            '',
            update.url,
          );
          setId(getId());
        },
      },
    });
  }, [inPresentation]);

  return (
    <>
      {inPresentation && <LiveMode />}
      {!id && <DocPicker client={client} onSelect={openDoc} />}
      {id && !loading && !data && (
        <p style={{ padding: '2rem' }}>Fant ikke dokumentet.</p>
      )}
      {/* Keyed by id, so another document starts on its first tab */}
      {data?._type === 'componentDoc' && <DocBody key={id} doc={data} />}
      {data?._type === 'page' && <PageBody page={data} onOpen={openDoc} />}
    </>
  );
}

createRoot(document.getElementById('root') as HTMLElement).render(<App />);
