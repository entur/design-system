// Single source of truth for tab/section title suggestions, so
// TitleSuggestionsInput's lists and the fallback below stay in sync.

export const TAB_TITLES = ['Oversikt', 'Kode', 'Tilgjengelighet'];

// 'Bruk' is a placeholder TitleSuggestionsInput substitutes with
// "Bruk <component name> når" once resolved to the Oversikt tab.
export const SECTION_TITLES_BY_TAB: Record<string, string[]> = {
  Oversikt: ['Bruk', 'Retningslinjer', 'Eksempler'],
  Kode: ['Kom i gang', 'Eksempler', 'Komponentprops'],
  Tilgjengelighet: ['Sjekkliste', 'WCAG-kriterier'],
};

const FALLBACK_BRUK_TITLE = 'Bruk komponenten når';

// Flat fallback for contexts where the parent tab can't be resolved. Spells
// "Bruk" out in full since the substitution above needs a resolved tab.
export const ALL_SECTION_TITLES = Array.from(
  new Set(
    Object.values(SECTION_TITLES_BY_TAB)
      .flat()
      .map(title => (title === 'Bruk' ? FALLBACK_BRUK_TITLE : title)),
  ),
);
