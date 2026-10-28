const fs = require('fs');
const path = require('path');
const postcss = require('postcss');

// Runs against built packages, so run `yarn build:packages` first.
const PACKAGES_DIR = path.resolve(__dirname, '../../packages');
// In the order base.css pulls them in through its imports
const BASE_FILES = [
  'primitive.css',
  'semantic.css',
  'transport.css',
  'base.css',
].map(file => path.join(PACKAGES_DIR, 'tokens/dist', file));

const MODE_SELECTOR = /^\[data-(color|view)-mode(?:=['"]?([^'"\]]+)['"]?)?\]$/;

function readCss(file) {
  if (!fs.existsSync(file)) {
    throw new Error(`${file} is missing. Run yarn build:packages first.`);
  }
  return postcss.parse(fs.readFileSync(file, 'utf-8'));
}

function parseSelector(selector) {
  if (selector === ':root') return { root: true };
  const match = selector.match(MODE_SELECTOR);
  return match ? { mode: match[1], value: match[2] } : undefined;
}

function isTokenRule(node) {
  return (
    node.type === 'rule' &&
    node.parent.type === 'root' &&
    node.selectors.every(parseSelector)
  );
}

function isToken(decl) {
  return decl.prop.startsWith('--') && isTokenRule(decl.parent);
}

/** Token rules in source order, as { selectors, decls }. */
function tokenRules(root) {
  const rules = [];
  root.each(node => {
    if (!isTokenRule(node)) return;
    const decls = [];
    node.each(decl => {
      if (decl.type === 'decl' && decl.prop.startsWith('--'))
        decls.push([decl.prop, decl.value]);
    });
    rules.push({ selectors: node.selectors.map(parseSelector), decls });
  });
  return rules;
}

/** Everything in a stylesheet except the token declarations. */
function nonTokenCss(root) {
  const nodes = [];
  root.walk(node => {
    if (node.type === 'comment' || (node.type === 'decl' && isToken(node)))
      return;
    const parents = [];
    for (let parent = node.parent; parent.type !== 'root'; ) {
      parents.unshift(parent.selector ?? `@${parent.name} ${parent.params}`);
      parent = parent.parent;
    }
    const own =
      node.type === 'decl'
        ? `${node.prop}: ${node.value}${node.important ? ' !important' : ''}`
        : node.selector ?? `@${node.name} ${node.params}`;
    const hasNonTokenDecl = () =>
      node.some(child => child.type === 'decl' && !isToken(child));
    if (node.type !== 'rule' || hasNonTokenDecl())
      nodes.push([...parents, own].join(' > '));
  });
  return nodes;
}

function matches({ root, mode, value }, element) {
  if (root) return element.root;
  const elementValue = element[mode];
  return value === undefined
    ? elementValue !== undefined
    : elementValue === value;
}

function toRgba(r, g, b, a = 1) {
  const alpha = Math.round(Number(a) * 1000) / 1000;
  return `rgba(${Number(r)}, ${Number(g)}, ${Number(b)}, ${alpha})`;
}

function normalize(value) {
  return value
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .replace(/#([0-9a-f]{3,8})\b/g, (match, hex) => {
      if (hex.length === 3 || hex.length === 4)
        hex = [...hex].map(char => char + char).join('');
      if (hex.length !== 6 && hex.length !== 8) return match;
      const [r, g, b, a = 255] = hex
        .match(/../g)
        .map(pair => parseInt(pair, 16));
      return toRgba(r, g, b, a / 255);
    })
    .replace(
      /rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+))?\s*\)/g,
      (_, r, g, b, a) => toRgba(r, g, b, a),
    );
}

/**
 * The computed custom properties of an element, the way a browser works
 * them out: declared values win, the rest are inherited from the parent.
 */
function computeElement(rules, element, parentValues) {
  const declared = new Map();
  for (const rule of rules) {
    if (!rule.selectors.some(selector => matches(selector, element))) continue;
    for (const [prop, value] of rule.decls) declared.set(prop, value);
  }

  const computed = new Map(parentValues);
  const resolved = new Set();
  const resolving = new Set();
  const resolve = prop => {
    if (!declared.has(prop) || resolved.has(prop)) return computed.get(prop);
    if (resolving.has(prop)) return undefined;
    resolving.add(prop);
    let value = declared.get(prop);
    const innermostVar = /var\(\s*(--[\w-]+)\s*(?:,\s*([^()]*))?\)/;
    while (innermostVar.test(value)) {
      value = value.replace(
        innermostVar,
        (_, name, fallback) =>
          resolve(name) ?? fallback?.trim() ?? `<unset ${name}>`,
      );
    }
    resolving.delete(prop);
    resolved.add(prop);
    computed.set(prop, normalize(value));
    return computed.get(prop);
  };
  for (const prop of declared.keys()) resolve(prop);
  return computed;
}

const baseRules = BASE_FILES.flatMap(file => tokenRules(readCss(file)));

const packages = fs
  .readdirSync(PACKAGES_DIR)
  .filter(name => {
    const pkgFile = path.join(PACKAGES_DIR, name, 'package.json');
    if (!fs.existsSync(pkgFile)) return false;
    const { exports = {} } = JSON.parse(fs.readFileSync(pkgFile, 'utf-8'));
    return './styles/no-base-tokens' in exports;
  })
  .sort();

describe.each(packages)('@entur/%s', name => {
  const dist = path.join(PACKAGES_DIR, name, 'dist');
  const withTokens = readCss(path.join(dist, 'styles.css'));
  const withoutTokens = readCss(path.join(dist, 'styles.no-base-tokens.css'));

  test('keeps all CSS except the token declarations', () => {
    expect(nonTokenCss(withoutTokens)).toEqual(nonTokenCss(withTokens));
  });

  test('gives the same token values as styles.css when base.css is loaded first', () => {
    const before = [...baseRules, ...tokenRules(withTokens)];
    const after = [...baseRules, ...tokenRules(withoutTokens)];

    const modeValues = { color: new Set(), view: new Set() };
    for (const rule of before)
      for (const { mode, value } of rule.selectors)
        if (value) modeValues[mode].add(value);
    const colors = [undefined, ...modeValues.color];
    const views = [undefined, ...modeValues.view];

    const differences = [];
    const compare = (scenario, beforeValues, afterValues) => {
      const props = new Set([...beforeValues.keys(), ...afterValues.keys()]);
      for (const prop of props) {
        if (beforeValues.get(prop) !== afterValues.get(prop))
          differences.push(
            `${scenario} ${prop}: ${beforeValues.get(prop)} → ${afterValues.get(
              prop,
            )}`,
          );
      }
    };

    for (const color of colors) {
      for (const view of views) {
        const html = { root: true, color, view };
        const htmlBefore = computeElement(before, html, new Map());
        const htmlAfter = computeElement(after, html, new Map());
        const htmlScenario = `<html color=${color} view=${view}>`;
        compare(htmlScenario, htmlBefore, htmlAfter);

        // Nested themes, e.g. a dark or compact section on a light page
        for (const nestedColor of colors) {
          for (const nestedView of views) {
            if (!nestedColor && !nestedView) continue;
            const nested = {
              root: false,
              color: nestedColor,
              view: nestedView,
            };
            compare(
              `${htmlScenario} <div color=${nestedColor} view=${nestedView}>`,
              computeElement(before, nested, htmlBefore),
              computeElement(after, nested, htmlAfter),
            );
          }
        }
      }
    }

    expect(differences.slice(0, 20)).toEqual([]);
  });
});
