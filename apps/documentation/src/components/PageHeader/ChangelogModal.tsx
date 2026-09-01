import React, { useEffect, useState } from 'react';

import { Loader } from '@entur/loader';
import { Modal } from '@entur/modal';
import { SmallText } from '@entur/typography';

import { MarkdownParser } from './MarkdownParser';

type ChangelogModalProps = {
  /** Navnet på pakken, uten @entur/-prefiks */
  packageName: string;
  /** URL til den rå CHANGELOG-filen */
  url: string;
  open: boolean;
  onDismiss: () => void;
};

export const ChangelogModal = ({
  packageName,
  url,
  open,
  onDismiss,
}: ChangelogModalProps) => {
  const [changelog, setChangelog] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setFailed(false);
    setChangelog(null);

    fetch(url)
      .then(response => response.text())
      .then(text => {
        if (!cancelled) setChangelog(text);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [open, url]);

  return (
    <Modal
      onDismiss={onDismiss}
      title={`@entur/${packageName}`}
      size="large"
      open={open}
    >
      {failed && <SmallText>Klarte ikke å hente changelogen.</SmallText>}
      {!failed &&
        (changelog === null ? (
          <Loader>Henter changelog</Loader>
        ) : (
          <MarkdownParser>{changelog}</MarkdownParser>
        ))}
    </Modal>
  );
};
