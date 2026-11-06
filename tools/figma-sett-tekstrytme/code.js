// Sett tekstrytme – prototype
// Sets the spacing toggles on the beta text components by the rules of TextContainer
// (packages/typography/src/beta/components/text-container.scss):
// - every element has its space after, except the last one
// - a heading gets space above, unless it comes first or right after a heading or the overline

const ABOVE = 'Spacing above';
const BELOW = 'Spacing below';
const AFTER = 'Paragraph spacing';
// Label Beta calls its space after just Spacing, too common a name to trust on other components
const LABEL_AFTER = 'Spacing';

function propKey(node, name) {
  return Object.keys(node.componentProperties).find(
    key => key.split('#')[0] === name,
  );
}

// heading, overline, text (with its toggle) or other: what the element is decides its neighbours' spacing
async function describe(node) {
  if (node.type !== 'INSTANCE') return { kind: 'other' };

  const main = await node.getMainComponentAsync();
  const owner =
    main && main.parent && main.parent.type === 'COMPONENT_SET'
      ? main.parent
      : main;
  const above = propKey(node, ABOVE);
  const below = propKey(node, BELOW);

  if (above || below || (owner && /heading/i.test(owner.name)))
    return { kind: 'heading', above, below };

  const after =
    propKey(node, AFTER) ||
    (owner && /label/i.test(owner.name)
      ? propKey(node, LABEL_AFTER)
      : undefined);
  if (!after) return { kind: 'other' };

  const type = propKey(node, 'Type');
  const overline =
    type !== undefined && node.componentProperties[type].value === 'Overline';
  return { kind: overline ? 'overline' : 'text', after };
}

function isFlow(node) {
  return (
    (node.type === 'FRAME' || node.type === 'COMPONENT') &&
    node.layoutMode === 'VERTICAL'
  );
}

// Vertical auto layouts in the selection, without looking inside instances or hidden layers
function findFlows(nodes) {
  const flows = new Set();
  const walk = node => {
    if (!node.visible) return;
    if (node.type === 'INSTANCE') {
      if (node.parent && isFlow(node.parent)) flows.add(node.parent);
      return;
    }
    if (isFlow(node)) flows.add(node);
    if ('children' in node) node.children.forEach(walk);
  };
  nodes.forEach(walk);
  return [...flows];
}

async function setFlow(flow, apply, report) {
  const items = flow.children.filter(
    node => node.visible && node.layoutPositioning !== 'ABSOLUTE',
  );
  const kinds = await Promise.all(items.map(describe));
  if (!kinds.some(kind => kind.kind !== 'other')) return;

  report.flows++;
  if (flow.itemSpacing !== 0) report.gaps.push(flow);

  kinds.forEach((kind, index) => {
    const node = items[index];
    const previous = kinds[index - 1];
    const hasNext = index < items.length - 1;
    const wanted = {};

    if (kind.kind === 'heading') {
      if (kind.above)
        wanted[kind.above] =
          previous !== undefined &&
          previous.kind !== 'heading' &&
          previous.kind !== 'overline';
      if (kind.below) wanted[kind.below] = hasNext;
    } else if (kind.after) {
      wanted[kind.after] = hasNext;
    } else if (hasNext) {
      // Code gives unknown elements the space after of a paragraph, Figma has no toggle for it
      report.others.push(node);
    }

    const changes = {};
    for (const key in wanted) {
      if (node.componentProperties[key].value !== wanted[key])
        changes[key] = wanted[key];
    }
    if (Object.keys(changes).length === 0) return;

    report.changed.push(node);
    if (apply) node.setProperties(changes);
  });
}

async function settTekstrytme(nodes, apply) {
  const report = { flows: 0, changed: [], gaps: [], others: [] };
  for (const flow of findFlows(nodes)) await setFlow(flow, apply, report);
  return report;
}

// Selected instances as they are, and the instances inside selected frames, without looking inside instances or hidden layers
function findInstances(nodes) {
  const instances = [];
  const walk = node => {
    if (!node.visible) return;
    if (node.type === 'INSTANCE') {
      instances.push(node);
      return;
    }
    if ('children' in node) node.children.forEach(walk);
  };
  nodes.forEach(walk);
  return instances;
}

// For text in cards, lists and other places where auto layout gap gives the spacing
async function turnOff(nodes) {
  const changed = [];
  for (const node of findInstances(nodes)) {
    const kind = await describe(node);
    const changes = {};
    for (const key of [kind.above, kind.below, kind.after]) {
      if (key && node.componentProperties[key].value) changes[key] = false;
    }
    if (Object.keys(changes).length === 0) continue;

    node.setProperties(changes);
    changed.push(node);
  }
  return changed;
}

function summary(report, apply) {
  if (report.flows === 0)
    return 'Fant ingen tekstkomponenter i en vertikal auto layout';

  const parts = [
    report.changed.length === 0
      ? 'Tekstrytmen stemmer'
      : `${report.changed.length} ${
          report.changed.length === 1 ? 'element' : 'elementer'
        } ${apply ? 'endret' : 'avviker'}`,
  ];
  if (report.gaps.length > 0)
    parts.push(`${report.gaps.length} ramme(r) har gap, som kommer i tillegg`);
  if (report.others.length > 0)
    parts.push(
      `${report.others.length} andre element(er) mangler luft etter (koden gir 24)`,
    );
  return parts.join(' · ');
}

function offSummary(changed) {
  return changed.length === 0
    ? 'Avstanden er allerede av'
    : `Avstand slått av på ${changed.length} ${
        changed.length === 1 ? 'element' : 'elementer'
      }`;
}

// What the switch shows: on when the toggles follow the rules, off when they are all off, otherwise deviates
async function status(selection) {
  if (selection.length === 0) return { state: 'empty' };

  const label =
    selection.length === 1 ? selection[0].name : `${selection.length} lag`;
  const texts = [];
  for (const node of findInstances(selection)) {
    const kind = await describe(node);
    if (kind.kind !== 'other') texts.push({ node, kind });
  }
  if (texts.length === 0) return { state: 'none', label };

  const report = await settTekstrytme(selection, false);
  const anyOn = texts.some(({ node, kind }) =>
    [kind.above, kind.below, kind.after].some(
      key => key && node.componentProperties[key].value,
    ),
  );

  // Text outside a vertical auto layout has no rhythm to follow, only spacing on or off
  if (report.flows === 0)
    return {
      state: anyOn ? 'on' : 'off',
      flow: false,
      label,
      count: texts.length,
    };

  const state = report.changed.length === 0 ? 'on' : anyOn ? 'deviates' : 'off';

  return {
    state,
    flow: true,
    label,
    count: texts.length,
    deviations: report.changed.length,
    gaps: report.gaps.length,
    others: report.others.length,
  };
}

// --- context ---
// Each context sets the three collections, as data-type-scale and data-density would in code.
// The context names the component size, data-density; on Standard, Desktop or Mobile picks the
// text size, data-type-scale, since mobile screens have room for smaller headings only.
const COLLECTIONS = {
  typography: 'Typography',
  size: 'Component size',
  spacing: 'Component spacing',
};
const VIEW_MODES = ['Standard', 'Compact', 'Display'];
const CONTEXTS = [
  {
    id: 'standard-desktop',
    name: 'Standard · Desktop',
    typography: 'Standard',
    size: 'Standard',
    spacing: 'Standard',
  },
  {
    id: 'standard-mobile',
    name: 'Standard · Mobile',
    typography: 'Compact',
    size: 'Standard',
    spacing: 'Standard',
  },
  {
    id: 'compact',
    name: 'Compact',
    typography: 'Compact',
    size: 'Compact',
    spacing: 'Compact',
  },
  {
    id: 'display',
    name: 'Display',
    typography: 'Display',
    size: 'Display',
    spacing: 'Display',
  },
];
const CONTEXT_KEY = 'kontekst';
const COMPONENT_KEY = 'komponent';
const COMPONENT_VALUES = ['inherit', ...VIEW_MODES];

const collections = {};
const seenCollectionIds = new Set();
const scannedPages = new Set();
let importing = false;
let imported = false;

const complete = () => Object.keys(COLLECTIONS).every(key => collections[key]);

// Older library versions of the same collections have other modes, so only the view modes count
async function acceptCollections(ids) {
  for (const id of ids) {
    if (seenCollectionIds.has(id)) continue;
    seenCollectionIds.add(id);
    const collection = await figma.variables.getVariableCollectionByIdAsync(id);
    if (!collection) continue;
    const key = Object.keys(COLLECTIONS).find(
      k => COLLECTIONS[k] === collection.name,
    );
    const modes = collection.modes.map(mode => mode.name);
    if (
      key &&
      !collections[key] &&
      VIEW_MODES.every(name => modes.includes(name))
    )
      collections[key] = collection;
  }
}

// Found where the file already uses them; importing from the library can be slow, so it runs last and in the background
async function findCollections(nodes, onImported) {
  for (const node of nodes) {
    for (let n = node; n && !complete(); n = n.parent) {
      if (n.explicitVariableModes)
        await acceptCollections(Object.keys(n.explicitVariableModes));
      if (n.resolvedVariableModes)
        await acceptCollections(Object.keys(n.resolvedVariableModes));
    }
  }
  if (!complete() && !scannedPages.has(figma.currentPage.id)) {
    scannedPages.add(figma.currentPage.id);
    for (const instance of figma.currentPage.findAllWithCriteria({
      types: ['INSTANCE'],
    })) {
      await acceptCollections(
        Object.keys(instance.resolvedVariableModes || {}),
      );
      if (complete()) break;
    }
  }
  if (!complete()) importCollections(onImported);
}

// Asked once per run: a collection the library doesn't have won't turn up on the next selection either
async function importCollections(onImported) {
  if (importing || imported) return;
  importing = true;
  try {
    for (const library of await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()) {
      const key = Object.keys(COLLECTIONS).find(
        k => COLLECTIONS[k] === library.name,
      );
      if (!key || collections[key]) continue;
      const variables =
        await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
          library.key,
        );
      if (variables.length === 0) continue;
      const variable = await figma.variables.importVariableByKeyAsync(
        variables[0].key,
      );
      await acceptCollections([variable.variableCollectionId]);
    }
  } catch (error) {
    // Without library access the collections already in use are all there is
  } finally {
    importing = false;
    imported = true;
    if (onImported) onImported();
  }
}

// The context belongs on the screen around the components, never on a layer inside a component,
// where it would change only that layer: a frame inside an instance belongs to the component
function isContextTarget(node) {
  if (node.type !== 'FRAME' && node.type !== 'SECTION') return false;
  for (let n = node.parent; n; n = n.parent)
    if (n.type === 'INSTANCE') return false;
  return true;
}

// A component on the screen, not one inside another component, can take its own size: text and size alike
function isComponentTarget(node) {
  if (node.type !== 'INSTANCE') return false;
  for (let n = node.parent; n; n = n.parent)
    if (n.type === 'INSTANCE') return false;
  return true;
}

// Follows the screen, one view mode for all three collections, or custom when they differ
function componentValueOf(node) {
  const own = node.explicitVariableModes || {};
  const names = Object.keys(collections).map(key => {
    const modeId = own[collections[key].id];
    const mode =
      modeId && collections[key].modes.find(m => m.modeId === modeId);
    return mode ? mode.name : null;
  });
  if (names.every(name => !name)) return 'inherit';
  return names.every(name => name === names[0]) ? names[0] : 'custom';
}

// The nearest layer that sets one of the collections, where an inherited context comes from
function contextOwner(node) {
  for (let n = node; n; n = n.parent) {
    const set = n.explicitVariableModes || {};
    if (Object.keys(collections).some(key => set[collections[key].id]))
      return n;
  }
  return null;
}

// A mode is inherited from the nearest layer that sets it, otherwise it is the collection's default
function modeOf(node, collection) {
  for (let n = node; n; n = n.parent) {
    const modeId =
      n.explicitVariableModes && n.explicitVariableModes[collection.id];
    const mode = modeId && collection.modes.find(m => m.modeId === modeId);
    if (mode) return { name: mode.name, set: true };
  }
  return {
    name: collection.modes.find(
      mode => mode.modeId === collection.defaultModeId,
    ).name,
    set: false,
  };
}

function contextOf(node) {
  const modes = {};
  let set = false;
  for (const key in collections) {
    const mode = modeOf(node, collections[key]);
    modes[key] = mode.name;
    set = set || mode.set;
  }
  // Should two contexts share modes, the choice made in the plugin tells them apart
  let chosen;
  for (let n = node; n && !chosen; n = n.parent)
    chosen = n.getPluginData && n.getPluginData(CONTEXT_KEY);
  const matches = CONTEXTS.filter(context =>
    Object.keys(modes).every(key => context[key] === modes[key]),
  );
  const match = matches.find(context => context.id === chosen) || matches[0];
  return { modes, set, id: set && match ? match.id : '' };
}

function componentName(main) {
  return main.parent && main.parent.type === 'COMPONENT_SET'
    ? main.parent.name
    : main.name;
}

// Instances whose size doesn't come from Component size keep their Standard size in every context
async function unboundComponents(nodes, collection) {
  const follows = new Map();
  const variableCollections = new Map();
  const counts = {};

  const usesCollection = async node => {
    const bound = [
      node,
      ...node.findAll(
        n => n.boundVariables && Object.keys(n.boundVariables).length > 0,
      ),
    ];
    for (const n of bound) {
      for (const value of Object.values(n.boundVariables || {})) {
        for (const alias of [].concat(value)) {
          if (!alias || !alias.id) continue;
          if (!variableCollections.has(alias.id)) {
            const variable = await figma.variables.getVariableByIdAsync(
              alias.id,
            );
            variableCollections.set(
              alias.id,
              variable ? variable.variableCollectionId : null,
            );
          }
          if (variableCollections.get(alias.id) === collection.id) return true;
        }
      }
    }
    return false;
  };

  for (const node of findInstances(nodes)) {
    if ((await describe(node)).kind !== 'other') continue;
    // Icons and other small pictures have no size to follow
    if (
      node.width <= 32 &&
      node.height <= 32 &&
      !node.findOne(n => n.type === 'TEXT')
    )
      continue;
    const main = await node.getMainComponentAsync();
    if (!main) continue;
    if (!follows.has(main.id)) follows.set(main.id, await usesCollection(node));
    if (follows.get(main.id)) continue;
    const name = componentName(main);
    counts[name] = (counts[name] || 0) + 1;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

async function contextStatus(selection, onImported) {
  if (selection.length === 0) return { available: false };
  const targets = selection.filter(isContextTarget);

  // Components get a size of their own instead of a context
  const components = selection.filter(isComponentTarget);
  if (targets.length === 0 && components.length === selection.length) {
    await findCollections(components, onImported);
    if (!collections.typography && !collections.size)
      return { available: false };
    const values = components.map(componentValueOf);
    const owner = contextOwner(components[0].parent);
    const result = {
      available: true,
      component: true,
      value: values.every(value => value === values[0]) ? values[0] : 'mixed',
      modes: contextOf(components[0]).modes,
      from: owner && owner.name,
    };
    if (collections.size)
      result.unbound = await unboundComponents(components, collections.size);
    return result;
  }

  // Any other layer shows the context it inherits, and where from, but can't set one
  if (targets.length === 0) {
    await findCollections(selection, onImported);
    if (!collections.typography && !collections.size)
      return { available: false };
    const { modes, set, id } = contextOf(selection[0]);
    const owner = contextOwner(selection[0]);
    return {
      available: true,
      readOnly: true,
      set,
      id,
      modes,
      from: owner && owner !== selection[0] ? owner.name : null,
      own: owner === selection[0],
    };
  }

  await findCollections(targets, onImported);
  const missing = Object.keys(COLLECTIONS)
    .filter(key => !collections[key])
    .map(key => COLLECTIONS[key]);
  if (!collections.typography && !collections.size)
    return { available: true, missing, loading: importing };

  const contexts = targets.map(contextOf);
  const same = contexts.every(
    context => JSON.stringify(context) === JSON.stringify(contexts[0]),
  );
  if (!same)
    return { available: true, mixed: true, missing, loading: importing };

  const { modes, set, id } = contexts[0];
  const result = {
    available: true,
    set,
    id,
    modes,
    missing,
    loading: importing,
  };
  if (set) {
    const modeIds = {};
    for (const key in collections)
      modeIds[key] = modeIdOf(collections[key], modes[key]);
    result.diverging = targets.reduce(
      (count, node) => count + divergingLayers(node, modeIds, false).length,
      0,
    );
  }
  if (collections.size && modes.size !== 'Standard')
    result.unbound = await unboundComponents(targets, collections.size);
  return result;
}

const modeIdOf = (collection, name) =>
  collection.modes.find(mode => mode.name === name).modeId;

// Chosen in the plugin, for a frame like an article or for one component, and kept when the screen changes
const chosenInPlugin = node =>
  Boolean(
    node.getPluginData &&
      (node.getPluginData(CONTEXT_KEY) || node.getPluginData(COMPONENT_KEY)),
  );

// Layers inside the frame that don't follow its modes: a mode set by hand further in, or a component
// that brings its own. What was chosen in the plugin stays.
function divergingLayers(frame, modeIds, apply) {
  const found = [];
  const walk = node => {
    for (const child of node.children || []) {
      if (chosenInPlugin(child)) continue;
      const own = child.explicitVariableModes || {};
      const resolved =
        child.type === 'INSTANCE' ? child.resolvedVariableModes || {} : {};
      let diverges = false;
      for (const key in collections) {
        const collection = collections[key];
        const mode = own[collection.id] || resolved[collection.id];
        if (!mode || mode === modeIds[key]) continue;
        diverges = true;
        if (!apply) continue;
        // A cleared mode follows the frame again; a component's own mode needs the frame's set over it
        if (own[collection.id])
          child.clearExplicitVariableModeForCollection(collection);
        const after = child.type === 'INSTANCE' && child.resolvedVariableModes;
        if (
          after &&
          after[collection.id] &&
          after[collection.id] !== modeIds[key]
        )
          child.setExplicitVariableModeForCollection(collection, modeIds[key]);
      }
      if (diverges) found.push(child);
      if (child.type !== 'INSTANCE') walk(child);
    }
  };
  walk(frame);
  return found;
}

// The whole screen takes the context, so a compact button in a Standard screen becomes a standard one
function setContext(selection, id) {
  const context = CONTEXTS.find(c => c.id === id);
  const targets = selection.filter(isContextTarget);
  const modeIds = {};
  for (const key in collections)
    modeIds[key] = modeIdOf(collections[key], context[key]);

  let aligned = 0;
  for (const node of targets) {
    for (const key in collections)
      node.setExplicitVariableModeForCollection(collections[key], modeIds[key]);
    node.setPluginData(CONTEXT_KEY, id);
    aligned += divergingLayers(node, modeIds, true).length;
  }
  return { context, count: targets.length, aligned };
}

// One component in another size than the screen, text and size alike, or back to following the screen
function setComponent(selection, value) {
  if (!COMPONENT_VALUES.includes(value)) return 0;
  const targets = selection.filter(isComponentTarget);
  for (const node of targets) {
    const own = node.explicitVariableModes || {};
    for (const key in collections) {
      const collection = collections[key];
      if (value !== 'inherit')
        node.setExplicitVariableModeForCollection(
          collection,
          modeIdOf(collection, value),
        );
      else if (own[collection.id])
        node.clearExplicitVariableModeForCollection(collection);
    }
    node.setPluginData(COMPONENT_KEY, value === 'inherit' ? '' : value);
  }
  return targets.length;
}

function panel() {
  figma.showUI(__html__, { width: 280, height: 390, themeColors: true });

  // Selection and node changes come in bursts, so wait for them to settle and drop stale answers
  let latest = 0;
  let timer;
  const update = async () => {
    const id = ++latest;
    const selection = figma.currentPage.selection;
    const result = await status(selection);
    // The text rhythm still works when the variables can't be read
    const context = await contextStatus(selection, schedule).catch(() => ({
      available: false,
    }));
    if (id === latest)
      figma.ui.postMessage({ type: 'status', ...result, context });
  };
  const schedule = () => {
    clearTimeout(timer);
    timer = setTimeout(update, 150);
  };

  let page = figma.currentPage;
  page.on('nodechange', schedule);
  figma.on('selectionchange', schedule);
  figma.on('currentpagechange', () => {
    page.off('nodechange', schedule);
    page = figma.currentPage;
    page.on('nodechange', schedule);
    schedule();
  });

  figma.ui.onmessage = async message => {
    const selection = figma.currentPage.selection;
    try {
      if (message.type === 'toggle' && message.on)
        figma.notify(summary(await settTekstrytme(selection, true), true));
      if (message.type === 'toggle' && !message.on)
        figma.notify(offSummary(await turnOff(selection)));
      if (message.type === 'check') {
        const report = await settTekstrytme(selection, false);
        if (report.changed.length > 0)
          figma.currentPage.selection = report.changed;
        figma.notify(summary(report, false));
      }
      if (message.type === 'context') {
        const { context, count, aligned } = setContext(selection, message.id);
        figma.notify(
          count === 0
            ? 'Marker skjermrammen for å sette kontekst'
            : `${context.name} satt på ${count} ${
                count === 1 ? 'ramme' : 'rammer'
              }${
                aligned > 0
                  ? ` · ${aligned} lag med egen modus følger nå konteksten`
                  : ''
              }`,
        );
      }
      if (message.type === 'component') {
        const count = setComponent(selection, message.value);
        const what =
          message.value === 'inherit' ? 'Følger skjermen' : message.value;
        figma.notify(
          count === 0
            ? 'Marker en komponent på skjermen'
            : `${what} satt på ${count} ${
                count === 1 ? 'komponent' : 'komponenter'
              }`,
        );
      }
    } catch (error) {
      figma.notify(`Feil: ${error.message}`, { error: true });
    }
    update();
  };

  update();
}

// --- run ---
async function run() {
  if (figma.command === 'panel') {
    panel();
    return;
  }

  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    figma.closePlugin('Marker rammen med teksten først');
    return;
  }

  if (figma.command === 'off') {
    figma.closePlugin(offSummary(await turnOff(selection)));
    return;
  }

  const apply = figma.command !== 'check';
  const report = await settTekstrytme(selection, apply);
  if (!apply && report.changed.length > 0)
    figma.currentPage.selection = report.changed;
  figma.closePlugin(summary(report, apply));
}

run().catch(error => figma.closePlugin(`Feil: ${error.message}`));
