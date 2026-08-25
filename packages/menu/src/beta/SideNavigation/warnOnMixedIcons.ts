import React from 'react';
import { getNodeText } from '@entur/utils';

/* Items on one level either all carry an icon or none do. Checked in
 * development only. */

const ITEM = 'SideNavigationBeta.Item';
const EXPANDABLE_ITEM = 'SideNavigationBeta.ExpandableItem';

type Row = { label: string; hasIcon: boolean };

const displayNameOf = (type: React.ElementType): string | undefined =>
  (type as { displayName?: string })?.displayName;

/** Collects the items on one level: descends through Group and fragments, stops
 * at a submenu, which the ExpandableItem holding it checks itself. */
const collectRows = (node: React.ReactNode, rows: Row[] = []): Row[] => {
  React.Children.forEach(node, child => {
    if (!React.isValidElement(child)) return;

    const props = child.props as {
      icon?: React.ReactNode;
      title?: React.ReactNode;
      children?: React.ReactNode;
    };
    const name = displayNameOf(child.type as React.ElementType);

    if (name === ITEM || name === EXPANDABLE_ITEM) {
      rows.push({
        label: getNodeText(
          name === EXPANDABLE_ITEM ? props.title : props.children,
        ),
        hasIcon: props.icon !== undefined && props.icon !== null,
      });
      return;
    }

    collectRows(props.children, rows);
  });

  return rows;
};

const describe = (rows: Row[]): string => {
  const labels = rows.map(row => `"${row.label}"`);
  return labels.length > 5
    ? `${labels.slice(0, 5).join(', ')} and ${labels.length - 5} more`
    : labels.join(', ');
};

// A level that is already warned about would otherwise warn again on every
// render, and twice per render under StrictMode.
const warned = new Set<string>();

/** Warns when only some of the items on one level have an icon. `level`
 * describes where, e.g. `the top level` or `the submenu "Sales"`. */
export const warnOnMixedIcons = (
  children: React.ReactNode,
  level: string,
): void => {
  if (process.env.NODE_ENV === 'production') return;

  const rows = collectRows(children);
  if (rows.length < 2) return;

  const withIcon = rows.filter(row => row.hasIcon);
  if (withIcon.length === 0 || withIcon.length === rows.length) return;

  const without = rows.filter(row => !row.hasIcon);
  const oddOnesOut = withIcon.length <= without.length ? withIcon : without;
  const heading =
    oddOnesOut === withIcon ? 'Only these have an icon' : 'These have no icon';

  const message = [
    `SideNavigation (beta): mixed icons on ${level}.`,
    `  ${heading}: ${describe(oddOnesOut)}`,
    '  Give every item on a level an icon, or none of them.',
  ].join('\n');

  if (warned.has(message)) return;
  warned.add(message);
  console.warn(message);
};

/** For tests only. */
export const resetMixedIconWarnings = (): void => warned.clear();
