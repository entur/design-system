const GUIDE_URL =
  'https://github.com/entur/design-system/blob/main/skills/entur-web-development/references/css-layers.md#the-beta-typography-and-your-global-css';

const COMPARED_PROPERTIES = [
  'font-size',
  'line-height',
  'font-weight',
  'font-family',
  'color',
  'letter-spacing',
  'margin-top',
  'margin-bottom',
  'padding-left',
  'text-decoration-line',
  'background-color',
  'list-style-type',
];

// Each element is paired with a neutral twin carrying the same classes,
// so only rules that target the element itself can make them differ
const PROBES = [
  ...['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(element => ({
    element,
    twin: 'div',
    className: 'eds-heading eds-heading--title-2',
    component: 'Heading',
  })),
  {
    element: 'p',
    twin: 'div',
    className: 'eds-text eds-text--paragraph',
    component: 'Text',
  },
  {
    element: 'a',
    twin: 'span',
    className: 'eds-text--link',
    component: 'Link',
  },
  {
    element: 'ul',
    twin: 'div',
    className: 'eds-text eds-text--unordered-list',
    component: 'UnorderedList',
  },
  {
    element: 'code',
    twin: 'span',
    className: 'eds-text eds-text--code',
    component: 'Text variant="code"',
  },
];

/** Finds global CSS in the app that overrides the beta typography. Empty when the beta styles aren't loaded. */
export function findGlobalStyleConflicts(): string[] {
  const host = document.createElement('div');
  host.setAttribute('aria-hidden', 'true');
  host.style.cssText =
    'position:absolute;top:0;left:-10000px;width:600px;visibility:hidden;pointer-events:none';

  const container = document.createElement('div');
  container.className = 'eds-text-container';
  container.innerHTML =
    '<p class="eds-text eds-text--paragraph">x</p><p class="eds-text eds-text--paragraph">x</p>';
  host.append(container);

  const pairs = PROBES.map(probe => {
    const [element, twin] = [probe.element, probe.twin].map(tag => {
      const node = document.createElement(tag);
      node.className = probe.className;
      node.textContent = 'x';
      host.append(node);
      return node;
    });
    return { probe, element, twin };
  });

  document.body.append(host);
  const conflicts: string[] = [];

  if (window.getComputedStyle(container).display === 'flow-root') {
    if (
      window.getComputedStyle(container.lastElementChild as Element)
        .marginTop === '0px'
    ) {
      conflicts.push(
        'TextContainer has no space between texts. Often a reset like `* { margin: 0 }`.',
      );
    }
    pairs.forEach(({ probe, element, twin }) => {
      const elementStyle = window.getComputedStyle(element);
      const twinStyle = window.getComputedStyle(twin);
      const changed = COMPARED_PROPERTIES.filter(
        property =>
          elementStyle.getPropertyValue(property) !==
          twinStyle.getPropertyValue(property),
      );
      if (changed.length > 0) {
        conflicts.push(
          `\`${probe.element} { ${changed.join('; ')} }\` overrides ${
            probe.component
          }.`,
        );
      }
    });
  }

  host.remove();
  return conflicts;
}

let checkTimeoutId: number | undefined;

/** Warns the developer once if global CSS in the app overrides the beta typography */
export function warnAboutGlobalStyles(): void {
  // Plain process.env.NODE_ENV, so bundlers replace it and drop the check from production builds
  if (process.env.NODE_ENV === 'production') return;
  if (
    typeof window === 'undefined' ||
    (typeof process !== 'undefined' && process.env.TEST === 'true') ||
    checkTimeoutId !== undefined
  ) {
    return;
  }

  // Wait for the stylesheets, like warnAboutMissingStyles
  checkTimeoutId = window.setTimeout(() => {
    const conflicts = findGlobalStyleConflicts();
    if (conflicts.length === 0) return;
    console.warn(
      `@entur/typography: global CSS in your app overrides the typography components.

${conflicts.map(conflict => `  - ${conflict}`).join('\n')}

CSS outside a cascade layer always wins over the typography, which sits in layers. Move resets into \`@layer core.reset\` and element styles into \`@layer core.base\`, with the layer order declared first:
${GUIDE_URL}`,
    );
  }, 1000);
}
