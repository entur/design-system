const BASE_URL = 'https://linje.entur.no';

const CATEGORY_LABELS = {
  'kom-i-gang': 'Getting Started',
  komponenter: 'Components',
  tokens: 'Design Tokens',
  'universell-utforming': 'Accessibility',
  identitet: 'Brand Identity',
  monster: 'Patterns',
  ressurser: 'Resources',
};

const SUBCATEGORY_LABELS = {
  knapper: 'Buttons',
  skjemaelementer: 'Form Elements',
  'layout-og-flater': 'Layout & Surfaces',
  navigasjon: 'Navigation',
  feedback: 'Feedback',
  reise: 'Travel',
  'for-designere': 'For Designers',
  'for-utviklere': 'For Developers',
  introduksjon: 'Introduction',
  farger: 'Colors',
  typografi: 'Typography',
  ikoner: 'Icons',
  innsikt: 'Insights',
};

function label(map, key) {
  return (key && map[key]) || (key ? titleCase(key) : null);
}

function titleCase(str) {
  return str
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function groupByCategory(pages) {
  const map = {};
  for (const page of pages) {
    const cat = page.category || 'other';
    if (!map[cat]) map[cat] = {};
    const sub = page.subcategory || '_root';
    if (!map[cat][sub]) map[cat][sub] = [];
    map[cat][sub].push(page);
  }
  return map;
}

function formatPageLine(page) {
  const url = `${BASE_URL}${page.path}`;
  const desc = page.description ? `: ${page.description}` : '';
  const pkg = page.npmPackage ? ` (\`${page.npmPackage}\`)` : '';
  return `- [${page.title}](${url})${pkg}${desc}`;
}

function generatePageIndex(pages) {
  const grouped = groupByCategory(pages);
  const lines = [];

  for (const [cat, subcats] of Object.entries(grouped)) {
    const catLabel = label(CATEGORY_LABELS, cat);
    lines.push(`## ${catLabel}`);
    lines.push('');

    for (const [sub, catPages] of Object.entries(subcats)) {
      if (sub !== '_root') {
        const subLabel = label(SUBCATEGORY_LABELS, sub);
        lines.push(`### ${subLabel}`);
        lines.push('');
      }
      for (const page of catPages) {
        lines.push(formatPageLine(page));
      }
      lines.push('');
    }
  }

  return lines.join('\n');
}

function generateLlmsTxt(pages) {
  const lines = [];

  lines.push('# Entur Linje Design System');
  lines.push('');
  lines.push(
    "> Entur Linje is the official React component library and design system for Entur — Norway's national public transport data platform. Published as `@entur/*` npm packages.",
  );
  lines.push('');
  lines.push(
    '> Full documentation: https://linje.entur.no | GitHub: https://github.com/entur/design-system',
  );
  lines.push('');
  lines.push(generatePageIndex(pages));

  return lines.join('\n');
}

function generateLlmsFullTxt(pages, skillsFiles) {
  const lines = [];

  lines.push('# Entur Linje Design System — Full Reference');
  lines.push('');
  lines.push(
    '> Complete documentation for AI agents. Covers installation, components, tokens, accessibility, and brand identity.',
  );
  lines.push('');
  lines.push(
    '> Full docs site: https://linje.entur.no | GitHub: https://github.com/entur/design-system',
  );
  lines.push('');
  lines.push('---');
  lines.push('');

  for (const { label: fileLabel, content } of skillsFiles) {
    lines.push(`## ${fileLabel}`);
    lines.push('');
    lines.push(content.trim());
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  lines.push('## Page Index');
  lines.push('');
  lines.push(
    'All pages on linje.entur.no, grouped by category. Use these URLs to link to specific documentation.',
  );
  lines.push('');
  lines.push(generatePageIndex(pages));

  return lines.join('\n');
}

module.exports = { generateLlmsTxt, generateLlmsFullTxt };
