import { map } from 'rxjs/operators';
import { HomeIcon } from '@entur/icons';

const API_VERSION = '2025-02-10';

// ——— Sorting presets ———

const byTitle = [{ field: 'title', direction: 'asc' as const }];

const byLandingPageThenSubcategory = [
  { field: 'isCategoryLandingPage', direction: 'desc' as const },
  { field: 'subcategory', direction: 'asc' as const },
  { field: 'title', direction: 'asc' as const },
];

const byCategoryThenSubcategory = [
  { field: 'category', direction: 'asc' as const },
  ...byLandingPageThenSubcategory,
];

// ——— Helpers ———

/**
 * A subcategory entry. Either a plain name like `"Knapper"` or an object
 * with a custom GROQ filter for edge cases (e.g. Mønster/Monster).
 */
type SubcategoryEntry = string | { title: string; filter: string };

type SortOrder = { field: string; direction: 'asc' | 'desc' }[];

/**
 * Creates a page/document list filtered by a GROQ expression.
 * Accepts a single document type or an array of types.
 *
 * Example: `createFilteredList(S, 'page', 'Knapper-sider', 'category == "Komponenter"')`
 * Example: `createFilteredList(S, ['page', 'componentDoc'], 'Alle', 'category == "Komponenter"')`
 */
function createFilteredList(
  S: any,
  documentType: string | string[],
  title: string,
  filter?: string,
  ordering: SortOrder = byTitle,
) {
  if (Array.isArray(documentType)) {
    const typeFilter = `_type in [${documentType
      .map(t => `"${t}"`)
      .join(', ')}]`;
    const fullFilter = filter ? `${typeFilter} && ${filter}` : typeFilter;
    return S.documentList()
      .apiVersion(API_VERSION)
      .title(title)
      .filter(fullFilter)
      .defaultOrdering(ordering);
  }

  const list = S.documentTypeList(documentType)
    .apiVersion(API_VERSION)
    .title(title)
    .defaultOrdering(ordering);
  return filter ? list.filter(filter) : list;
}

/**
 * Builds a category section for the sidebar with:
 * 1. An "Alle sider under {category}" list (landing pages sorted first)
 * 2. One list per subcategory, sorted alphabetically by title
 *
 * Pass `categoryFilter` to override the default `category == "X"` GROQ filter.
 */
function createCategorySection(
  S: any,
  documentStore: any,
  documentType: string | string[],
  category: string,
  subcategories: SubcategoryEntry[],
  categoryFilter?: string,
) {
  const filter = categoryFilter ?? `category == "${category}"`;
  const types = Array.isArray(documentType) ? documentType : [documentType];
  const typeGroq = types.map(t => `"${t}"`).join(', ');

  const allDocsList = S.listItem()
    .title(`Alle sider under ${category}`)
    .child(
      createFilteredList(
        S,
        documentType,
        `${category}-sider`,
        filter,
        byLandingPageThenSubcategory,
      ),
    );

  const subcategoryLists = subcategories.map(entry => {
    const title = typeof entry === 'string' ? entry : entry.title;
    const subFilter =
      typeof entry === 'string'
        ? `category == "${category}" && subcategory == "${entry}"`
        : entry.filter;

    return S.listItem()
      .title(title)
      .child(createFilteredList(S, documentType, `${title}-sider`, subFilter));
  });

  return S.listItem()
    .title(category)
    .child(() =>
      documentStore
        .listenQuery(
          `*[_type in [${typeGroq}] && ${filter} && isCategoryLandingPage == true][0]{ _id, _type, title }`,
          {},
          { apiVersion: API_VERSION },
        )
        .pipe(
          map(
            (result: { _id: string; _type: string; title: string } | null) => {
              const landingPageItem = result
                ? [
                    S.documentListItem()
                      .id(result._id)
                      .schemaType(result._type)
                      .title(`${result.title} (landingsside)`)
                      .icon(HomeIcon),
                  ]
                : [];

              return S.list()
                .title(`${category} underkategorier`)
                .items([allDocsList, ...landingPageItem, ...subcategoryLists]);
            },
          ),
        ),
    );
}

// ——— Desk structure ———

export const structure = (S: any, { documentStore }: any) =>
  S.list()
    .title('Content')
    .items([
      // ——— Alle sider (pages + component docs merged) ———
      S.listItem()
        .title('Innhold')
        .child(
          S.list()
            .title('Innhold')
            .items([
              S.listItem()
                .title('Alle sider')
                .child(
                  createFilteredList(
                    S,
                    ['page', 'componentDoc'],
                    'Alle sider',
                    undefined,
                    byCategoryThenSubcategory,
                  ),
                ),

              createCategorySection(
                S,
                documentStore,
                ['page', 'componentDoc'],
                'Komponenter',
                [
                  'Knapper',
                  'Feedback',
                  'Layout og flater',
                  'Navigasjon',
                  'Reise',
                  'Ressurser',
                  'Skjemaelementer',
                ],
              ),

              createCategorySection(
                S,
                documentStore,
                ['page', 'componentDoc'],
                'Identitet',
                ['Introduksjon', 'Maler', 'Verktøykassen'],
              ),

              createCategorySection(
                S,
                documentStore,
                ['page', 'componentDoc'],
                'Kom i gang',
                ['For designere', 'For utviklere', 'Introduksjon'],
              ),

              // Mønster needs custom filters because some documents
              // were created with "Monster" (without ø)
              createCategorySection(
                S,
                documentStore,
                ['page', 'componentDoc'],
                'Mønster',
                ['Mønster', 'Maler'],
                'category == "Mønster" || category == "Monster"',
              ),

              createCategorySection(
                S,
                documentStore,
                ['page', 'componentDoc'],
                'Ressurser',
                ['Workshopmaler'],
              ),

              createCategorySection(
                S,
                documentStore,
                ['page', 'componentDoc'],
                'Tokens',
                ['Fargetokens', 'Øvrige tokens'],
              ),

              // Universell utforming has no subcategories
              S.listItem()
                .title('Universell utforming')
                .child(
                  createFilteredList(
                    S,
                    ['page', 'componentDoc'],
                    'Universell utforming-sider',
                    'category == "Universell utforming"',
                  ),
                ),
            ]),
        ),
    ]);
