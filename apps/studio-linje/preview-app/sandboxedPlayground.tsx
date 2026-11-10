// Replaces the docs site's Playground in the preview. This page shares Studio's
// origin, so the playground, which runs code from the document, is rendered in
// a sandboxed iframe without an origin instead: a draft cannot act with the
// login of whoever opens it.
import React, { useEffect, useRef, useState } from 'react';
import { stegaClean } from '@sanity/client/stega';

export default function SandboxedPlayground(props: Record<string, unknown>) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const [height, setHeight] = useState(0);

  // Only messages from this iframe, and only a ready signal and a height
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow) return;
      if (event.data?.type === 'ready') setReady(true);
      if (
        event.data?.type === 'height' &&
        typeof event.data.height === 'number'
      )
        setHeight(event.data.height);
    };
    addEventListener('message', onMessage);
    return () => removeEventListener('message', onMessage);
  }, []);

  useEffect(() => {
    // The sandbox has no origin to check against, so the target is '*'
    if (ready)
      frame.current?.contentWindow?.postMessage(
        { type: 'render', props: stegaClean(props) },
        '*',
      );
  });

  return (
    <iframe
      ref={frame}
      title="Eksempel"
      // Relative to the preview page, which is served from static/preview
      src="playground.html"
      sandbox="allow-scripts"
      style={{ display: 'block', width: '100%', height, border: 0 }}
    />
  );
}
