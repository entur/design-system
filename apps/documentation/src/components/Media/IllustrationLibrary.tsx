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

import { useURLSearchParams } from '@components/IconList/IconList.utils';
import { useSettings } from '@providers/SettingsContext';

import {
  IllustrationDetails,
  IllustrationPreview,
} from './IllustrationDetails';
import {
  PrinciplesDetails,
  isPrinciplesPart,
  principlesAspectRatio,
} from './PrinciplesDetails';
import {
  ILLUSTRATION_CATEGORIES,
  categoryLabel,
} from './illustrationCategories';
import {
  COLOR_MODES,
  ColorMode,
  Illustration,
  PRINCIPLES_CATEGORY,
  PRINCIPLES_COMPOSITION,
  pickVariant,
  useGetIllustrations,
} from './useGetIllustrations';

import './IllustrationLibrary.scss';

const PRINCIPLES_CARD = 'principles';
const groupSlug = (folder: string) => folder.toLowerCase().replace(/\s+/g, '-');
const isPrinciple = (illustration: Illustration) =>
  illustration.category === PRINCIPLES_CATEGORY;
// Utviklingsprinsipper is shown as one card, so its parts count once
const countCards = (list: Illustration[]) =>
  list.filter(i => !isPrinciple(i)).length + (list.some(isPrinciple) ? 1 : 0);

const IllustrationLibrary = () => {
  const illustrations = useGetIllustrations();
  const { colorMode: theme, resolvedColorMode } = useSettings();
  const { initialParams, debouncedUpdateURL } = useURLSearchParams();

  // Defaults on the first render, so it matches the server-rendered HTML
  const [search, setSearch] = React.useState('');
  const [categories, setCategories] = React.useState<string[]>([]);
  const [colorMode, setColorMode] = React.useState<ColorMode>('standard');

  React.useEffect(() => {
    setSearch(initialParams.search);
    // Several categories are stored comma-separated in the shared «category» URL parameter
    setCategories(
      (initialParams.category?.value ?? '')
        .split(',')
        .filter(value => ILLUSTRATION_CATEGORIES.some(c => c.folder === value)),
    );
  }, [initialParams]);

  React.useEffect(() => {
    if (theme === 'contrast') setColorMode('contrast');
    else setColorMode(resolvedColorMode === 'dark' ? 'darkmode' : 'standard');
  }, [theme, resolvedColorMode]);
  const [withBackground, setWithBackground] = React.useState(false);
  const [openId, setOpenId] = React.useState<string | null>(null);
  const openerRef = React.useRef<HTMLButtonElement | null>(null);
  const closeDetails = () => {
    setOpenId(null);
    // The dialog is unmounted on close, so it cannot restore focus itself
    requestAnimationFrame(() => openerRef.current?.focus());
  };

  React.useEffect(() => {
    debouncedUpdateURL(search, categories.join(',') || null);
  }, [search, categories, debouncedUpdateURL]);

  const searcher = React.useMemo(
    () =>
      new Searcher(illustrations, {
        keySelector: (illustration: Illustration) => [
          illustration.name,
          categoryLabel(illustration.category),
          ...illustration.keywords,
        ],
        threshold: 0.8,
      }),
    [illustrations],
  );

  const matches = React.useMemo(
    () => (search.trim() === '' ? illustrations : searcher.search(search)),
    [illustrations, search, searcher],
  );
  const visible =
    categories.length === 0
      ? matches
      : matches.filter(i => categories.includes(i.category));

  const categoryItems = ILLUSTRATION_CATEGORIES.map(c => ({
    value: c.folder,
    label: `${c.label} (${countCards(
      matches.filter(i => i.category === c.folder),
    )})`,
  }));
  const selectedCategoryItems = categoryItems.filter(item =>
    categories.includes(item.value),
  );

  const groups = ILLUSTRATION_CATEGORIES.map(c => ({
    ...c,
    items: visible.filter(i => i.category === c.folder),
  })).filter(group => group.items.length > 0);

  const isFiltered = search.trim() !== '' || categories.length > 0;
  const reset = () => {
    setSearch('');
    setCategories([]);
  };
  const opened = illustrations.find(i => i.id === openId);
  const principles = illustrations.filter(isPrinciple);
  const principlesComposition = principles.find(
    i => i.name === PRINCIPLES_COMPOSITION,
  );
  const matchedPart =
    search.trim() === ''
      ? undefined
      : visible.find(i => isPrinciple(i) && isPrinciplesPart(i))?.name;
  const visibleCount = countCards(visible);
  const totalCount = countCards(illustrations);

  return (
    <section className="illustration-library" aria-label="Illustrasjoner">
      <div className="illustration-library__filters">
        <TextField
          className="illustration-library__search"
          label="Søk etter illustrasjon"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
          prepend={<SearchIcon aria-hidden="true" />}
          clearable
          onClear={() => setSearch('')}
        />
        <MultiSelect
          className="illustration-library__category"
          label="Kategorier"
          placeholder={categories.length === 0 ? 'Alle kategorier' : undefined}
          items={categoryItems}
          selectedItems={selectedCategoryItems}
          onChange={(items: NormalizedDropdownItemType[]) =>
            setCategories(items.map(item => item.value))
          }
          hideSelectAll
          labelClearAllItems="Vis alle kategorier"
        />
      </div>

      <div className="illustration-library__display">
        <SegmentedControl
          label="Vis i"
          selectedValue={colorMode}
          onChange={value => setColorMode(value as ColorMode)}
        >
          {COLOR_MODES.map(mode => (
            <SegmentedChoice key={mode.value} value={mode.value}>
              {mode.label}
            </SegmentedChoice>
          ))}
        </SegmentedControl>
        <Switch
          checked={withBackground}
          onChange={() => setWithBackground(prev => !prev)}
        >
          Med bakgrunn
        </Switch>
      </div>

      <div className="illustration-library__summary">
        <Text as="p" variant="subparagraph" aria-live="polite">
          {isFiltered
            ? `Viser ${visibleCount} av ${totalCount} illustrasjoner`
            : `${totalCount} illustrasjoner`}
        </Text>
        {isFiltered && visible.length > 0 && (
          <SecondaryButton size="small" onClick={reset}>
            Nullstill filter
          </SecondaryButton>
        )}
      </div>

      {visible.length === 0 ? (
        <div className="illustration-library__empty">
          <Heading as="h2" variant="title-2">
            Finner ingen illustrasjoner
          </Heading>
          <Text as="p">
            Prøv et annet ord, gjerne på engelsk, eller beskriv situasjonen i
            stedet for motivet, som «venter» eller «rullestol».
            {categories.length > 0 &&
              ` Du søker bare i ${categories
                .map(c => `«${categoryLabel(c)}»`)
                .join(', ')}.`}
          </Text>
          <SecondaryButton size="small" onClick={reset}>
            Nullstill filter
          </SecondaryButton>
          <Text as="p">
            Mangler det en illustrasjon? Si ifra på{' '}
            <Link href="https://entur.slack.com/archives/C899QSPB7">
              #talk-designsystem
            </Link>
            .
          </Text>
        </div>
      ) : (
        groups.map(group => (
          <section
            key={group.folder}
            className="illustration-library__group"
            aria-labelledby={`illustration-group-${groupSlug(group.folder)}`}
          >
            <Heading
              as="h2"
              variant="subtitle-1"
              id={`illustration-group-${groupSlug(group.folder)}`}
            >
              {group.label}
            </Heading>
            <Text as="p" variant="subparagraph">
              {group.description}
            </Text>
            {group.folder === PRINCIPLES_CATEGORY && principlesComposition ? (
              <ul className="illustration-library__grid illustration-library__grid--feature">
                <li>
                  <button
                    type="button"
                    className="illustration-card"
                    onClick={e => {
                      openerRef.current = e.currentTarget;
                      setOpenId(PRINCIPLES_CARD);
                    }}
                    aria-haspopup="dialog"
                  >
                    <IllustrationPreview
                      variant={principlesComposition.variants[0]}
                      className="illustration-card__preview"
                      style={{ aspectRatio: principlesAspectRatio }}
                    />
                    <span className="illustration-card__caption">
                      <Text as="span" variant="label">
                        Utviklingsprinsipper
                      </Text>
                      <Text as="span" variant="caption">
                        Hele illustrasjonen eller én og én del
                      </Text>
                    </span>
                    <VisuallyHidden>, vis detaljer og last ned</VisuallyHidden>
                  </button>
                </li>
              </ul>
            ) : (
              <ul
                className={classNames('illustration-library__grid', {
                  'illustration-library__grid--wide': group.wide,
                })}
              >
                {group.items.map(illustration => {
                  const variant = pickVariant(
                    illustration,
                    colorMode,
                    withBackground,
                  );
                  return (
                    <li key={illustration.id}>
                      <button
                        type="button"
                        className="illustration-card"
                        onClick={e => {
                          openerRef.current = e.currentTarget;
                          setOpenId(illustration.id);
                        }}
                        aria-haspopup="dialog"
                      >
                        <IllustrationPreview
                          variant={variant}
                          className="illustration-card__preview"
                        />
                        <span className="illustration-card__caption">
                          <Text as="span" variant="label">
                            {illustration.name}
                          </Text>
                          {variant.colorMode !== colorMode && (
                            <Text as="span" variant="caption">
                              Finnes ikke i{' '}
                              {
                                COLOR_MODES.find(m => m.value === colorMode)
                                  ?.lowercase
                              }
                            </Text>
                          )}
                        </span>
                        <VisuallyHidden>
                          , vis detaljer og last ned
                        </VisuallyHidden>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        ))
      )}

      {openId === PRINCIPLES_CARD && (
        <PrinciplesDetails
          illustrations={principles}
          initialPart={matchedPart}
          onDismiss={closeDetails}
        />
      )}
      {opened && (
        <IllustrationDetails
          key={opened.id}
          illustration={opened}
          initialVariant={pickVariant(opened, colorMode, withBackground)}
          onDismiss={closeDetails}
        />
      )}
    </section>
  );
};

export default IllustrationLibrary;
