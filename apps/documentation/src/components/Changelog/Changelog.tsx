import React from 'react';
import { Link as GatsbyLink, graphql, navigate, useStaticQuery } from 'gatsby';
import { useLocation } from '@reach/router';

import { ForwardIcon } from '@entur/icons';
import { Tag } from '@entur/layout';
import { Text } from '@entur/typography/beta';

import { ChangelogModal } from '../PageHeader/ChangelogModal';
import { useGetChangelog } from '../PageHeader/useGetChangelog';

import './Changelog.scss';

/** Changelogen som vises, f.eks. /komponenter/ressurser/changelog?package=alert */
const PACKAGE_PARAM = 'package';

/** Verdien skills-changelogen åpnes med. Ingen @entur-pakke heter det. */
const SKILLS = 'skills';

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

/** Changelogen URL-en ber om, og lenken som åpner eller lukker en. */
const useSelectedChangelog = () => {
  const location = useLocation();
  const selected = new URLSearchParams(location.search).get(PACKAGE_PARAM);

  // Any other params on the page are left alone.
  const urlWith = (name: string | null) => {
    const params = new URLSearchParams(location.search);

    if (name === null) params.delete(PACKAGE_PARAM);
    else params.set(PACKAGE_PARAM, name);

    const search = params.toString();

    return `${location.pathname}${search ? `?${search}` : ''}`;
  };

  const close = () => navigate(urlWith(null), { replace: true });

  return { selected, urlWith, close };
};

const ChangelogCard = ({
  title,
  to,
  children,
}: {
  title: string;
  to: string;
  children?: React.ReactNode;
}) => (
  <GatsbyLink className="changelog-card" to={to}>
    <span className="changelog-card__title">
      <Text as="strong" weight="bold">
        {title}
      </Text>
      <ForwardIcon className="changelog-card__arrow" aria-hidden="true" />
    </span>
    {children && <span className="changelog-card__meta">{children}</span>}
  </GatsbyLink>
);

const Changelog = () => {
  const query = useGetChangelog();
  const { selected: selectedName, urlWith, close } = useSelectedChangelog();

  const changelogs = (query?.allFile?.nodes || [])
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));

  const versions = new Map(
    (query?.allNpmPackageVersion?.nodes || []).map(node => [node.name, node]),
  );

  // The URL decides which changelog is open, so the modal can be linked to.
  const selected = changelogs.find(node => node.name === selectedName);

  return (
    <div className="changelog-overview">
      {changelogs.length === 0 ? (
        <Text>Fant ingen changelogger.</Text>
      ) : (
        <ul className="changelog-overview__list">
          {changelogs.map(changelog => {
            const published = versions.get(changelog.name);
            const publishedAt = formatPublishedAt(
              published?.publishedAt ?? null,
            );

            return (
              <li className="changelog-overview__item" key={changelog.name}>
                <ChangelogCard
                  title={`@entur/${changelog.name}`}
                  to={urlWith(changelog.name)}
                >
                  {published && (
                    <Tag size="small">{`v${published.version}`}</Tag>
                  )}
                  {publishedAt && (
                    <Text as="span" variant="caption">
                      {publishedAt}
                    </Text>
                  )}
                </ChangelogCard>
              </li>
            );
          })}
        </ul>
      )}

      {selected && (
        <ChangelogModal
          title={`@entur/${selected.name}`}
          url={selected.publicURL}
          open
          onDismiss={close}
        />
      )}
    </div>
  );
};

/** Inngangen til skills-changelogen, som ikke er en npm-pakke. */
export const SkillsChangelogCard = () => {
  const { file } = useStaticQuery(graphql`
    query SkillsChangelogCard {
      file(sourceInstanceName: { eq: "skills-changelog" }) {
        publicURL
      }
    }
  `);
  const { selected, urlWith, close } = useSelectedChangelog();

  if (!file) return null;

  return (
    <div className="changelog-overview">
      <ul className="changelog-overview__list">
        <li className="changelog-overview__item">
          <ChangelogCard title="Skills" to={urlWith(SKILLS)} />
        </li>
      </ul>

      {selected === SKILLS && (
        <ChangelogModal
          title="Skills"
          url={file.publicURL}
          open
          onDismiss={close}
        />
      )}
    </div>
  );
};

export default Changelog;
