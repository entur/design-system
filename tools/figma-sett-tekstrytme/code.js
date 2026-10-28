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

function panel() {
  figma.showUI(__html__, { width: 280, height: 220, themeColors: true });

  // Selection and node changes come in bursts, so wait for them to settle and drop stale answers
  let latest = 0;
  let timer;
  const update = async () => {
    const id = ++latest;
    const result = await status(figma.currentPage.selection);
    if (id === latest) figma.ui.postMessage({ type: 'status', ...result });
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
