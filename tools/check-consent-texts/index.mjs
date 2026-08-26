/**
 * Checks that the Usercentrics endpoint the documentation site reads its consent texts from
 * still answers, and still answers with the fields the site depends on.
 *
 * The endpoint is undocumented, so nothing obliges Usercentrics to keep its shape. If it
 * changes, the consent banner stops appearing. That is safe — no optional technology runs
 * without consent — but silent: we would lose insight without being told, and readers could
 * not give or change consent. This check is the warning.
 *
 * The assertions mirror fetchUcLabels in apps/documentation/src/utils/cmpUtils.ts, which
 * defines the same settings id and base url. Keep them in step: if the site starts
 * depending on another field, assert it here too.
 *
 * Usage: node tools/check-consent-texts/index.mjs
 */

const SETTINGS_ID = '6QfyMRB25Z5CMz';
const API_BASE = 'https://v1.api.service.cmp.usercentrics.eu/latest';

/** Retries what a scheduled run should not shout about: timeouts, dropped connections and
 *  the endpoint being briefly unwell. A 4xx is an answer, so it stands. */
async function fetchJson(url, attempt = 1) {
  let transient = true;
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    transient = response.status >= 500;
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    if (attempt < 3 && transient) return fetchJson(url, attempt + 1);
    throw new Error(`${error.message} from ${url}`, { cause: error });
  }
}

/** Usercentrics serves texts under an uppercase settings type, derived from the account. */
function settingsTypeFor(cmpType) {
  if (['gdpr', 'pipeda', 'cipa', 'uk_gdpr'].includes(cmpType)) return 'GDPR';
  if (['tcf', 'tcf2', 'uk_tcf2'].includes(cmpType)) return 'TCF';
  return 'US';
}

const problems = [];
const notes = [];

let core;
try {
  core = await fetchJson(`${API_BASE}/core/${SETTINGS_ID}`);
} catch (error) {
  console.error('The Usercentrics settings could not be read at all:\n');
  console.error(`  - ${error.message}`);
  console.error(
    '\nThe consent banner will not appear while this is the case. Nothing optional is ' +
      'collected, but no consent can be given either.',
  );
  process.exit(1);
}

const { version, languages, cmp } = core;

if (!version) problems.push('The core settings response has no version.');

// Nothing below may assume the shape held: reporting a change is the job, crashing on it is not.
const languageList = Array.isArray(languages) ? languages : [];
if (languageList.length === 0) {
  problems.push('The core settings response lists no languages.');
}

// A custom first layer is only safe outside TCF: in TCF mode the consent screen recorded in
// the TC string would be wrong, because Usercentrics' own UI never renders.
if (cmp?.type !== 'gdpr') {
  problems.push(
    `The account is in "${cmp?.type}" mode rather than "gdpr". The documentation site ` +
      `replaces Usercentrics' first layer, which assumes GDPR mode — revisit that before ` +
      `relying on this.`,
  );
}

const settingsType = settingsTypeFor(cmp?.type);
notes.push(
  `Settings ${SETTINGS_ID}, version ${version}, type ${settingsType}, ` +
    `languages ${languageList.join(', ')}`,
);

for (const language of languageList) {
  if (typeof language !== 'string') {
    problems.push(
      `The core settings list ${JSON.stringify(language)} as a language.`,
    );
    continue;
  }
  const url = `${API_BASE}/i18n/${language.toLowerCase()}/${settingsType}/${SETTINGS_ID}/${version}`;
  let texts;
  try {
    texts = await fetchJson(url);
  } catch (error) {
    problems.push(
      `Could not read the texts for "${language}": ${error.message}`,
    );
    continue;
  }

  // Exactly what fetchUcLabels refuses to render the banner without.
  const firstLayer = texts?.firstLayer;
  const required = {
    'firstLayer.privacy.title': firstLayer?.privacy?.title,
    'firstLayer.buttons.accept': firstLayer?.buttons?.accept,
    'firstLayer.buttons.deny': firstLayer?.buttons?.deny,
  };
  for (const [field, value] of Object.entries(required)) {
    if (typeof value !== 'string' || value.trim() === '') {
      problems.push(`"${language}": ${field} is missing or empty.`);
    }
  }

  // The privacy page lists these. Empty is not a crash, but it is an empty page.
  if (Object.keys(texts?.categories ?? {}).length === 0) {
    problems.push(
      `"${language}": no categories, so the privacy page would list none.`,
    );
  }
  if (Object.keys(texts?.services ?? {}).length === 0) {
    problems.push(
      `"${language}": no services, so the privacy page would list none.`,
    );
  }

  // Not required — the banner renders without it — but its absence means the note about
  // strictly necessary technologies disappears, which the Digdir pattern asks for.
  const shortDescription = firstLayer?.privacy?.shortDescription;
  if (typeof shortDescription !== 'string' || !shortDescription.trim()) {
    notes.push(
      `"${language}": firstLayer.privacy.shortDescription is empty, so the banner shows ` +
        `no note about necessary information. Set "Short Banner Message for Web".`,
    );
  }

  if (!problems.some(problem => problem.startsWith(`"${language}"`))) {
    notes.push(`"${language}": texts can be read as the site expects.`);
  }
}

for (const note of notes) console.log(`  ${note}`);

if (problems.length > 0) {
  console.error('\nThe consent texts cannot be read as the site expects:\n');
  for (const problem of problems) console.error(`  - ${problem}`);
  console.error(
    '\nThe consent banner will not appear while this is the case. Nothing optional is ' +
      'collected, but no consent can be given either.',
  );
  process.exit(1);
}

console.log('\nAll good.');
