import React from 'react';
import { navigate } from 'gatsby';
import { useLocation } from '@reach/router';

import { ActionChip } from '@entur/chip';
import { ListViewIcon } from '@entur/icons';

import { ChangelogModal } from './ChangelogModal';
import { useGetChangelog } from './useGetChangelog';

/** Åpner changelogen siden handler om, f.eks.
 * /komponenter/knapper/button?changelog */
const CHANGELOG_PARAM = 'changelog';

export const PackageChangelog = ({ packageName }: { packageName: string }) => {
  const query = useGetChangelog();
  const normalizedPackageName = packageName.replace(/\/beta$/, '');
  const packageKey = normalizedPackageName.split('@entur/')?.[1];
  const changelog = query.allFile.nodes.find(
    node => node.name === normalizedPackageName || node.name === packageKey,
  );

  if (!changelog) return null;

  return (
    <ChangelogButton
      title={`@entur/${changelog.name}`}
      url={changelog.publicURL}
    />
  );
};

/** Knappen som åpner en changelog, og modalen den åpner. */
export const ChangelogButton = ({
  title,
  url,
}: {
  title: string;
  url: string;
}) => {
  const location = useLocation();

  // The URL decides whether the changelog is open, so it can be linked to.
  const open = new URLSearchParams(location.search).has(CHANGELOG_PARAM);

  // Other params on the page, e.g. the icon list filters, are left alone. The
  // flag is written by hand: URLSearchParams would render it as "changelog=".
  const urlWithChangelog = (isOpen: boolean) => {
    const params = new URLSearchParams(location.search);
    params.delete(CHANGELOG_PARAM);

    const other = params.toString();
    const search = [other, isOpen ? CHANGELOG_PARAM : '']
      .filter(Boolean)
      .join('&');

    return `${location.pathname}${search ? `?${search}` : ''}`;
  };

  return (
    <>
      <ActionChip onClick={() => navigate(urlWithChangelog(true))}>
        Changelog
        <ListViewIcon />
      </ActionChip>

      <ChangelogModal
        title={title}
        url={url}
        open={open}
        onDismiss={() => navigate(urlWithChangelog(false), { replace: true })}
      />
    </>
  );
};
