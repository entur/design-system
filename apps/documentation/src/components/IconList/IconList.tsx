import React from 'react';
import classNames from 'classnames';
import { Searcher } from 'fast-fuzzy';

import { VisuallyHidden } from '@entur/a11y';
import { SecondaryButton } from '@entur/button';
import { MultiSelect, NormalizedDropdownItemType } from '@entur/dropdown';
import {
  SegmentedChoice,
  SegmentedControl,
  Switch,
  TextField,
} from '@entur/form';
import { SearchIcon } from '@entur/icons';
import { Heading, Link, Text } from '@entur/typography/beta';

import { IconDetails, IconPreview } from './IconDetails';
import { useURLSearchParams } from './IconList.utils';
import {
  ICON_CATEGORIES,
  categoryLabel,
  categoryOf,
  groupOf,
} from './iconCategories';
import iconKeywords from './iconKeywords.json';
import { useGetIcons } from './useGetIcons';

import './IconList.scss';

export type IconItem = {
  name: string;
  /** Folder below src/svgs, e.g. UI/Validation */
  category: string;
  /** The category the icon is shown under */
  group: string;
  component: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  downloadUrl: string;
  keywords: string[];
  /** White artwork that needs a dark background */
  onDark: boolean;
  /** Other names that export the same icon */
  aliases: string[];
};

type IconListProps = {
  icons: Record<string, unknown>;
};

const STYLES = [
  { value: 'all', label: 'Alle' },
  { value: 'outline', label: 'Strek' },
  { value: 'filled', label: 'Fylt' },
] as const;
type Style = (typeof STYLES)[number]['value'];

const DEPRECATED_ICONS = ['BellIcon'];
// Duplicates shown under their main icon instead of as their own card
const ALIASES: Record<string, string> = {
  Warning: 'ValidationExclamationFilled',
};
const keywordsByName = iconKeywords as Record<string, string[]>;

const isFilled = (icon: IconItem) => icon.name.endsWith('Filled');
const outlineName = (name: string) => name.replace(/Filled$/, '');
// "ValidationExclamationCircle" -> "Validation Exclamation Circle"
const splitWords = (name: string) =>
  name.replace(/([a-zæøå])([A-ZÆØÅ])/g, '$1 $2');
const groupSlug = (folder: string) =>
  folder.toLowerCase().replace(/[^a-z]+/g, '-');

const IconList: React.FC<IconListProps> = ({ icons: iconComponents }) => {
  const files = useGetIcons();
  const { initialParams, debouncedUpdateURL } = useURLSearchParams();

  // Defaults on the first render, so it matches the server-rendered HTML
  const [search, setSearch] = React.useState('');
  const [groups, setGroups] = React.useState<string[]>([]);
  const [style, setStyle] = React.useState<Style>('all');
  const [contrast, setContrast] = React.useState(false);
  const [openName, setOpenName] = React.useState<string | null>(null);
  const openerRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    setSearch(initialParams.search);
    // Several categories are stored comma-separated in the «category» URL parameter
    setGroups(
      (initialParams.category?.value ?? '')
        .split(',')
        .filter(value => ICON_CATEGORIES.some(c => c.folder === value)),
    );
    const initialStyle = STYLES.find(s => s.value === initialParams.style);
    if (initialStyle) setStyle(initialStyle.value);
  }, [initialParams]);

  React.useEffect(() => {
    debouncedUpdateURL(
      search,
      groups.join(',') || null,
      style === 'all' ? null : style,
    );
  }, [search, groups, style, debouncedUpdateURL]);

  const allIcons = React.useMemo(
    () =>
      files
        .flatMap(({ node }): IconItem[] => {
          const name = node.name.replace(/\s+/g, '');
          const component = iconComponents[`${name}Icon`];
          if (
            !component ||
            DEPRECATED_ICONS.includes(`${name}Icon`) ||
            name in ALIASES
          )
            return [];
          const category = node.relativeDirectory;
          const group = groupOf(category);
          return [
            {
              name,
              category,
              group,
              component: component as IconItem['component'],
              downloadUrl: node.publicURL,
              keywords: keywordsByName[name] ?? [],
              onDark: name.endsWith('Negative'),
              aliases: Object.keys(ALIASES).filter(
                alias => ALIASES[alias] === name,
              ),
            },
          ];
        })
        .sort((a, b) => a.name.localeCompare(b.name, 'no')),
    [files, iconComponents],
  );

  const searcher = React.useMemo(
    () =>
      new Searcher(allIcons, {
        keySelector: (icon: IconItem) => [
          icon.name,
          splitWords(icon.name),
          categoryLabel(icon.group),
          ...icon.aliases.flatMap(alias => [alias, `${alias}Icon`]),
          ...icon.keywords,
        ],
        threshold: 0.8,
      }),
    [allIcons],
  );

  const matches = React.useMemo(() => {
    const found =
      search.trim() === '' ? allIcons : searcher.search(search.trim());
    if (style === 'all') return found;
    return found.filter(icon => isFilled(icon) === (style === 'filled'));
  }, [allIcons, search, searcher, style]);

  const visible =
    groups.length === 0
      ? matches
      : matches.filter(icon => groups.includes(icon.group));

  const categoryItems = ICON_CATEGORIES.map(c => ({
    value: c.folder,
    label: `${c.label} (${matches.filter(i => i.group === c.folder).length})`,
  }));
  const selectedCategoryItems = categoryItems.filter(item =>
    groups.includes(item.value),
  );

  // While searching, the group with the best match comes first
  const groupOrder =
    search.trim() === ''
      ? ICON_CATEGORIES.map(c => c.folder)
      : Array.from(new Set(visible.map(icon => icon.group)));
  const shownGroups = groupOrder
    .map(folder => ({
      ...categoryOf(folder)!,
      items: visible.filter(icon => icon.group === folder),
    }))
    .filter(group => group.items.length > 0);

  const isFiltered =
    search.trim() !== '' || groups.length > 0 || style !== 'all';
  const reset = () => {
    setSearch('');
    setGroups([]);
    setStyle('all');
  };

  const opened = allIcons.find(icon => icon.name === openName);
  const variantsOf = (icon: IconItem) =>
    allIcons.filter(
      other =>
        other.category === icon.category &&
        outlineName(other.name) === outlineName(icon.name),
    );
  const closeDetails = () => {
    setOpenName(null);
    // The dialog is unmounted on close, so it cannot restore focus itself
    requestAnimationFrame(() => openerRef.current?.focus());
  };

  return (
    <section className="icon-library" aria-label="Ikoner">
      <div className="icon-library__filters">
        <TextField
          label="Søk etter ikon"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
          prepend={<SearchIcon aria-hidden="true" />}
          clearable
          onClear={() => setSearch('')}
        />
        <MultiSelect
          label="Kategorier"
          placeholder={groups.length === 0 ? 'Alle kategorier' : undefined}
          items={categoryItems}
          selectedItems={selectedCategoryItems}
          onChange={(items: NormalizedDropdownItemType[]) =>
            setGroups(items.map(item => item.value))
          }
          hideSelectAll
          labelClearAllItems="Vis alle kategorier"
        />
      </div>

      <div className="icon-library__display">
        <SegmentedControl
          label="Stil"
          selectedValue={style}
          onChange={value => setStyle(value as Style)}
        >
          {STYLES.map(s => (
            <SegmentedChoice key={s.value} value={s.value}>
              {s.label}
            </SegmentedChoice>
          ))}
        </SegmentedControl>
        <Switch checked={contrast} onChange={() => setContrast(!contrast)}>
          Kontrast
        </Switch>
      </div>

      <div className="icon-library__summary">
        <Text as="p" variant="subparagraph" aria-live="polite">
          {isFiltered
            ? `Viser ${visible.length} av ${allIcons.length} ikoner`
            : `${allIcons.length} ikoner`}
        </Text>
        {isFiltered && visible.length > 0 && (
          <SecondaryButton size="small" onClick={reset}>
            Nullstill filter
          </SecondaryButton>
        )}
      </div>

      {visible.length === 0 ? (
        <div className="icon-library__empty">
          <Heading as="h2" variant="title-2">
            Finner ingen ikoner
          </Heading>
          <Text as="p">
            Prøv et annet ord, gjerne på engelsk, eller beskriv hva ikonet gjør
            i stedet for hvordan det ser ut, som «søk» i stedet for
            «forstørrelsesglass».
            {groups.length > 0 &&
              ` Du søker bare i ${groups
                .map(g => `«${categoryLabel(g)}»`)
                .join(', ')}.`}
          </Text>
          <SecondaryButton size="small" onClick={reset}>
            Nullstill filter
          </SecondaryButton>
          <Text as="p">
            Mangler det et ikon? Si ifra på{' '}
            <Link href="https://entur.slack.com/archives/C899QSPB7">
              #talk-designsystem
            </Link>
            .
          </Text>
        </div>
      ) : (
        shownGroups.map(group => (
          <section
            key={group.folder}
            className="icon-library__group"
            aria-labelledby={`icon-group-${groupSlug(group.folder)}`}
          >
            <Heading
              as="h2"
              variant="subtitle-1"
              id={`icon-group-${groupSlug(group.folder)}`}
            >
              {group.label}
            </Heading>
            <Text as="p" variant="subparagraph">
              {group.description}
            </Text>
            <ul className="icon-library__grid">
              {group.items.map(icon => (
                <li key={icon.name}>
                  <button
                    type="button"
                    className="icon-card"
                    onClick={e => {
                      openerRef.current = e.currentTarget;
                      setOpenName(icon.name);
                    }}
                    aria-haspopup="dialog"
                  >
                    <span
                      className={classNames('icon-card__preview', {
                        'eds-contrast': contrast || group.dark || icon.onDark,
                      })}
                    >
                      <IconPreview icon={icon} size="2rem" />
                    </span>
                    <Text
                      as="span"
                      variant="caption"
                      className="icon-card__name"
                    >
                      {icon.name}
                    </Text>
                    <VisuallyHidden>, vis detaljer og last ned</VisuallyHidden>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}

      {opened && (
        <IconDetails
          key={opened.name}
          icon={opened}
          variants={variantsOf(opened)}
          contrast={contrast}
          onSelectVariant={variant => setOpenName(variant.name)}
          onDismiss={closeDetails}
        />
      )}
    </section>
  );
};

export default IconList;
