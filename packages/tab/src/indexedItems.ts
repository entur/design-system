import React, { useCallback, useContext, useEffect, useRef } from 'react';

const isDev = () => process.env.NODE_ENV !== 'production';

export type ItemKind = 'tab' | 'panel';

const NAMES = {
  tab: { child: 'Tab', parent: 'TabList', self: 'tab', sibling: 'panel' },
  panel: {
    child: 'TabPanel',
    parent: 'TabPanels',
    self: 'panel',
    sibling: 'tab',
  },
} as const;

type ItemContextValue = {
  index: number;
  register: (index: number) => () => void;
  keepMounted: boolean;
};

const ItemContexts = {
  tab: React.createContext<ItemContextValue | null>(null),
  panel: React.createContext<ItemContextValue | null>(null),
};

/** Logs each distinct message once, so a later problem is not swallowed */
export function useWarnOnce() {
  const reported = useRef(new Set<string>());

  return useCallback((level: 'warn' | 'error', message: string) => {
    if (!isDev() || reported.current.has(message)) return;
    reported.current.add(message);
    console[level](message);
  }, []);
}

/**
 * Settles on the index for a Tab or TabPanel — an explicit index prop wins over
 * the one the parent handed out — and reports it back to the parent, which uses
 * it to spot markup where the indices cannot line up.
 */
export function useItemIndex(kind: ItemKind, explicitIndex?: number) {
  const { child, parent } = NAMES[kind];
  const item = useContext(ItemContexts[kind]);
  const register = item?.register;
  const index = explicitIndex ?? item?.index ?? 0;
  const warn = useWarnOnce();

  useEffect(() => register?.(index), [register, index]);

  useEffect(() => {
    if (explicitIndex === undefined && !register)
      warn(
        'warn',
        `<${child}> was rendered outside of <${parent}>, so it falls back to index 0. Render it from <${parent}>, or give it an index prop.`,
      );
  }, [explicitIndex, register, child, parent, warn]);

  return { index, keepMounted: item?.keepMounted ?? false };
}

/**
 * Hands out an index to every child that could be a Tab or a TabPanel, and
 * warns when the indices cannot line up.
 *
 * Fragments, Suspense boundaries and plain HTML elements are transparent: they
 * take up no index themselves, but their children do, which keeps the indices
 * right when tabs or panels sit nested in markup. We cannot look inside a
 * component, so each one takes up a single index — a component that renders a
 * tab or a panel needs an explicit index prop.
 */
export function useIndexedChildren(
  kind: ItemKind,
  children: React.ReactNode,
  options: {
    selectedIndex?: number;
    keepMounted?: boolean;
    /** Lets Tabs compare the indices the tabs and the panels ended up with */
    onIndices?: (indices: number[]) => void;
  } = {},
): React.ReactNode {
  const { selectedIndex, keepMounted = false, onIndices } = options;
  const counts = useRef(new Map<number, number>());
  const warn = useWarnOnce();

  const register = useCallback((index: number) => {
    counts.current.set(index, (counts.current.get(index) ?? 0) + 1);

    return () => {
      const left = (counts.current.get(index) ?? 0) - 1;
      if (left > 0) counts.current.set(index, left);
      else counts.current.delete(index);
    };
  }, []);

  // Runs after the children have registered themselves
  useEffect(() => {
    if (!isDev()) return;

    const used = Array.from(counts.current.keys());
    const shared = used.filter(index => (counts.current.get(index) ?? 0) > 1);
    onIndices?.(used);

    if (shared.length) warn('error', sharedIndexMessage(kind, shared));
    // An unused index after the last child is fine: that tab has no panel
    else if (
      selectedIndex !== undefined &&
      !counts.current.has(selectedIndex) &&
      selectedIndex < Math.max(...used)
    )
      warn('warn', missingIndexMessage(kind, selectedIndex));
  });

  let next = 0;
  const walk = (nodes: React.ReactNode): React.ReactNode =>
    React.Children.map(nodes, child => {
      // Text, numbers, null and booleans can never be tabs or panels
      if (!React.isValidElement(child)) return child;

      const isTransparent =
        child.type === React.Fragment ||
        child.type === React.Suspense ||
        typeof child.type === 'string';

      if (!isTransparent)
        return React.createElement(
          ItemContexts[kind].Provider,
          { value: { index: next++, register, keepMounted } },
          child,
        );

      const { children: nested } = child.props as {
        children?: React.ReactNode;
      };
      return nested === undefined
        ? child
        : React.cloneElement(child, undefined, walk(nested));
    });

  return walk(children);
}

function sharedIndexMessage(kind: ItemKind, shared: number[]) {
  const { child, parent, self, sibling } = NAMES[kind];

  return `Several <${child}> components got the same index (${shared.join(
    ', ',
  )}), so they belong to the same ${sibling} and change together.

<${parent}> numbers its children in the order they appear, and it cannot see inside your own components. A wrapper such as <ErrorBoundary> therefore counts as one child, and every <${child}> inside it gets that same index.

Fix it in one of two ways:
  1. Put each <${child}> directly inside <${parent}>, and move wrappers such as ErrorBoundary or Suspense inside the ${self}.
  2. Set the index yourself: <${child} index={0} />, <${child} index={1} /> and so on. Needed when the ${self} lives inside a component of your own.

Fragments, Suspense and plain HTML elements take no index of their own, so nesting ${self}s in those is fine.`;
}

function missingIndexMessage(kind: ItemKind, selectedIndex: number) {
  const { child, parent, self, sibling } = NAMES[kind];

  return `No <${child}> got index ${selectedIndex}, so that ${sibling} shows nothing while later indices are in use.

<${parent}> numbers its children in the order they appear, and a component it cannot see inside takes up one index whether or not it renders a ${self}. Give the ${self} an explicit index prop if it lives inside a component of your own.

If the ${self} loads lazily, it sorts itself out once loading finishes.`;
}

/** Warns about panels no tab can reach, which neither parent can see on its own */
export function useUnreachablePanelWarning() {
  const seen = useRef<{ tab?: number[]; panel?: number[] }>({});
  const warn = useWarnOnce();

  const reportIndices = useCallback((kind: ItemKind, indices: number[]) => {
    seen.current[kind] = indices;
  }, []);

  useEffect(() => {
    const { tab, panel } = seen.current;
    if (!isDev() || !tab || !panel) return;

    const unreachable = panel.filter(index => !tab.includes(index));
    if (!unreachable.length) return;

    warn(
      'error',
      `No <Tab> got index ${unreachable.join(
        ', ',
      )}, so that panel can never be shown.

There are more panels than tabs, or a tab is rendered conditionally while its panel is not. Render the tab and the panel under the same condition, or drop the panel.`,
    );
  });

  return reportIndices;
}
