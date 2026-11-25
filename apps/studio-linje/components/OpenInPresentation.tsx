import React, { useEffect, useRef } from 'react';
import { Card, Text } from '@sanity/ui';
import type { UserViewComponent } from 'sanity/structure';
import { useRouter } from 'sanity/router';
import { previewPathFor } from '../previewPath';
import { rememberListPath } from '../listPath';

// The only view of a page in Sider: it opens the document in
// Presentation, where the preview is shown next to the editor
export const OpenInPresentation: UserViewComponent = ({
  documentId,
  schemaType,
}) => {
  const { navigateIntent } = useRouter();
  // The view stays mounted for a moment after navigating, and the effect would run again
  const opened = useRef(false);

  useEffect(() => {
    if (opened.current) return;
    opened.current = true;
    rememberListPath(window.location.pathname);
    navigateIntent('edit', {
      id: documentId,
      type: schemaType.name,
      mode: 'presentation',
      preview: previewPathFor(documentId),
    });
  }, [documentId, schemaType.name, navigateIntent]);

  return (
    <Card padding={4}>
      <Text muted>Åpner forhåndsvisning …</Text>
    </Card>
  );
};
