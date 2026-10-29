import React, { useEffect, useState } from 'react';
import { Link as GatsbyLink } from 'gatsby';

import { Loader } from '@entur/loader';
import { Modal } from '@entur/modal';
import { Link, Text } from '@entur/typography/beta';

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
      {failed && (
        <Text variant="caption">Klarte ikke å hente changelogen.</Text>
      )}
      {!failed &&
        (changelog === null ? (
          <Loader>Henter changelog</Loader>
        ) : (
          <>
            {changelog.includes('BREAKING CHANGES') && (
              <Text variant="caption" tone="subdued">
                Har oppgraderingen breaking changes? Se{' '}
                <Link as={GatsbyLink} to="/komponenter/ressurser/migrering">
                  migreringsguidene
                </Link>
                .
              </Text>
            )}
            <MarkdownParser>{changelog}</MarkdownParser>
          </>
        ))}
    </Modal>
  );
};
