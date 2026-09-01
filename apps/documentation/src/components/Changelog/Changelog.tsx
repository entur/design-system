import React from 'react';
import { Link as GatsbyLink, navigate } from 'gatsby';
import { useLocation } from '@reach/router';

import { ForwardIcon } from '@entur/icons';
import { Tag } from '@entur/layout';
import { Paragraph, SmallText, StrongText } from '@entur/typography';

import { ChangelogModal } from '../PageHeader/ChangelogModal';
import { useGetChangelog } from '../PageHeader/useGetChangelog';

import './Changelog.scss';

/** Pakken som vises, f.eks. /komponenter/ressurser/changelog?package=alert */
const PACKAGE_PARAM = 'package';

const dateFormat = new Intl.DateTimeFormat('nb-NO', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const formatPublishedAt = (publishedAt: string | null) => {
  if (!publishedAt) return null;

  const date = new Date(publishedAt);

  return Number.isNaN(date.getTime()) ? null : dateFormat.format(date);
};

const Changelog = () => {
  const location = useLocation();
  const query = useGetChangelog();

  const changelogs = (query?.allFile?.nodes || [])
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));

  const versions = new Map(
    (query?.allNpmPackageVersion?.nodes || []).map(node => [node.name, node]),
  );

  // The URL decides which changelog is open, so the modal can be linked to.
  const selectedName = new URLSearchParams(location.search).get(PACKAGE_PARAM);
  const selected = changelogs.find(node => node.name === selectedName);

  // Any other params on the page are left alone.
  const urlWithPackage = (name: string | null) => {
    const params = new URLSearchParams(location.search);

    if (name === null) params.delete(PACKAGE_PARAM);
    else params.set(PACKAGE_PARAM, name);

    const search = params.toString();

    return `${location.pathname}${search ? `?${search}` : ''}`;
  };

  return (
    <div className="changelog-overview">
      {changelogs.length === 0 ? (
        <Paragraph>Fant ingen changelogger.</Paragraph>
      ) : (
        <ul className="changelog-overview__list">
          {changelogs.map(changelog => {
            const published = versions.get(changelog.name);
            const publishedAt = formatPublishedAt(
              published?.publishedAt ?? null,
            );

            return (
              <li className="changelog-overview__item" key={changelog.name}>
                <GatsbyLink
                  className="changelog-card"
                  to={urlWithPackage(changelog.name)}
                >
                  <span className="changelog-card__title">
                    <StrongText>{`@entur/${changelog.name}`}</StrongText>
                    <ForwardIcon
                      className="changelog-card__arrow"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="changelog-card__meta">
                    {published && (
                      <Tag as="span" compact>{`v${published.version}`}</Tag>
                    )}
                    {publishedAt && (
                      <SmallText margin="none">{publishedAt}</SmallText>
                    )}
                  </span>
                </GatsbyLink>
              </li>
            );
          })}
        </ul>
      )}

      {selected && (
        <ChangelogModal
          packageName={selected.name}
          url={selected.publicURL}
          open
          onDismiss={() => navigate(urlWithPackage(null), { replace: true })}
        />
      )}
    </div>
  );
};

export default Changelog;
