import React from 'react';
import { Link as GatsbyLink } from 'gatsby';
import { compiler } from 'markdown-to-jsx';

import { BaseExpand, ExpandableTextButton } from '@entur/expand';
import { Tag, TagVariant } from '@entur/layout';
import {
  BackArrowIcon,
  BugIcon,
  LinkIcon,
  NewIcon,
  PackageIcon,
  WarningIcon,
} from '@entur/icons';
import {
  Heading,
  Link,
  ListItem,
  Text,
  TextContainer,
  UnorderedList,
} from '@entur/typography/beta';

import './MarkdownParser.scss';

// Beta entries get their own sections, marked with a badge instead of the
// suffix the changelog preset writes.
const BETA_SUFFIX = ' (beta)';

/**
 * Seksjonene changelogen er delt inn i, med overskriftene vår
 * conventional-changelog-preset skriver.
 *
 * Seksjonene er kategorier, ikke tilstander, så de bruker kategorifarger valgt
 * for å skille seg fra hverandre. `BREAKING CHANGES` er unntaket: den krever
 * noe av den som leser, og er den eneste som bruker en statusfarge.
 *
 * `generated` er seksjonene tools/changelog-dependency-updates skriver i stedet
 * for en commit. De er navngitt etter scopet: bare pakker som slippes herfra er
 * listet opp, og en release som ikke er annet enn slike seksjoner blir slått
 * sammen.
 */
const SECTIONS: Record<
  string,
  { icon: React.ElementType; variant: TagVariant; generated?: boolean }
> = {
  'Bug Fixes': { icon: BugIcon, variant: 'blue' },
  Features: { icon: NewIcon, variant: 'spring' },
  'BREAKING CHANGES': { icon: WarningIcon, variant: 'warning' },
  Reverts: { icon: BackArrowIcon, variant: 'neutral' },
  'Entur Dependency Updates': {
    icon: PackageIcon,
    variant: 'neutral',
    generated: true,
  },
  'Entur Peer Requirements': {
    icon: LinkIcon,
    variant: 'jungle',
    generated: true,
  },
};

// Named components, so the grouping below can recognise them by type
const ReleaseHeading = (props: { children?: React.ReactNode }) => (
  <Heading as="h3" variant="subtitle-1" {...props} />
);
const MinorHeading = (props: { children?: React.ReactNode }) => (
  <Heading as="h6" variant="section-2" {...props} />
);
const Paragraph = (props: { children?: React.ReactNode; tone?: 'subdued' }) => (
  <Text {...props} />
);
const Strong = (props: { children?: React.ReactNode }) => (
  <Text as="strong" weight="bold" {...props} />
);
const Code = (props: { children?: React.ReactNode }) => (
  <Text variant="code" {...props} />
);

const textContent = (children: React.ReactNode): string =>
  React.Children.toArray(children)
    .map(child => {
      if (typeof child === 'string') return child;
      if (React.isValidElement(child)) return textContent(child.props.children);
      return '';
    })
    .join('');

const isType = (
  node: React.ReactNode,
  type: React.ElementType,
): node is React.ReactElement =>
  React.isValidElement(node) && node.type === type;

/** Navnet på seksjonen, uten suffikset preset-en gir beta-seksjoner. */
const stripBeta = (heading: string): string =>
  heading.endsWith(BETA_SUFFIX)
    ? heading.slice(0, -BETA_SUFFIX.length)
    : heading;

/** Navnet på seksjonen en node innleder, om den innleder en. */
const sectionTitle = (node: React.ReactNode): string =>
  isType(node, ChangelogSection)
    ? stripBeta(textContent(node.props.children).trim())
    : '';

/** Taggen som navngir seksjonen, lik overalt den er brukt. */
const SectionTag = ({ title }: { title: string }) => {
  const section = SECTIONS[title];
  const Icon = section?.icon;

  return (
    <Tag variant={section?.variant}>
      {Icon ? <Icon aria-hidden="true" /> : null}
      {title}
    </Tag>
  );
};

const ChangelogSection = ({
  children,
  ...rest
}: {
  children?: React.ReactNode;
}) => {
  // Beta components have their own sections, e.g. "Bug Fixes (beta)".
  const heading = textContent(children).trim();
  const isBeta = heading.endsWith(BETA_SUFFIX);

  // Rendered as a heading: the sections structure the changelog, and sit one
  // level below the version they belong to.
  const title = stripBeta(heading);

  return (
    <div className="markdown-parser__section">
      {/* markdown-to-jsx passes a className of its own, so it goes first. */}
      <h4 {...rest} className="markdown-parser__section-heading">
        <SectionTag title={title} />
        {/* Samme kategorifarge som beta-merket ellers på siden. */}
        {isBeta && <Tag variant="mystic">Beta</Tag>}
      </h4>
      {title === 'BREAKING CHANGES' && (
        <Text variant="caption" lang="nb">
          <Link as={GatsbyLink} to="/komponenter/ressurser/migrering">
            Se migreringsguidene
          </Link>
        </Text>
      )}
    </div>
  );
};

/** The block with tone="subdued" on every paragraph and list in it. Nested lists set
 * their own colour, so each one needs the tone. */
const subdued = (node: React.ReactNode): React.ReactNode => {
  if (!React.isValidElement(node)) return node;
  const children = React.Children.map(node.props.children, subdued);
  const tone =
    isType(node, Paragraph) || isType(node, UnorderedList)
      ? { tone: 'subdued' }
      : {};
  return React.cloneElement(node, tone, children);
};

/** Et changelog-innslag er én commit: overskriften, og eventuelt den lengre
 * beskrivelsen fra commit-meldingen. */
const ChangelogEntry = ({
  children,
  ...rest
}: {
  children?: React.ReactNode;
}) => {
  const blocks = React.Children.toArray(children);
  const [summary, ...description] = blocks;

  // Entries without a description are inline content, not blocks. The p
  // override means a block summary always arrives as a Paragraph.
  if (!isType(summary, Paragraph) || description.length === 0) {
    return <ListItem {...rest}>{children}</ListItem>;
  }

  return (
    <ListItem {...rest}>
      {summary.props.children}
      <TextContainer className="markdown-parser__description">
        {description.map(subdued)}
      </TextContainer>
    </ListItem>
  );
};

/** Pakkene en generert avhengighetsliste nevner, uten @entur/-prefikset. */
const listedPackages = (list: React.ReactElement): string[] =>
  React.Children.toArray(list.props.children)
    .map(item =>
      textContent(item)
        .split(':')[0]
        .trim()
        .replace(/^@entur\//, ''),
    )
    .filter(Boolean);

/**
 * Seksjonen og listen under den, bygget som de andre seksjonene: taggen med
 * navnet først, og under den én linje som kan åpnes. Antallet og pakkenavnene
 * blir stående i linjen: den som leser skal kunne se hva som har flyttet seg
 * uten å måtte åpne noe. Linjen er skrevet på engelsk, som resten av
 * changelogen.
 *
 * Taggen er ingen overskrift, til forskjell fra `Bug Fixes` og `Features`. Som
 * h4 ville dette lagt hundrevis av oppføringer i overskriftslisten, rett etter
 * versjonen de uansett hører til.
 */
const DependencySection = ({
  title,
  names,
  children,
}: {
  title: string;
  names: string[];
  children: React.ReactNode;
}) => {
  const [open, setOpen] = React.useState(false);
  const contentId = React.useId();

  return (
    <div className="markdown-parser__dependencies">
      <div className="markdown-parser__dependencies-title">
        <SectionTag title={title} />
      </div>
      {/* Listet opp som seksjonene et menneske har skrevet: linjen som åpner
          tar plassen til en oppføring, og pakkene den nevner blir listen
          under den. */}
      <UnorderedList>
        <ListItem>
          <ExpandableTextButton
            as="span"
            open={open}
            onToggle={() => setOpen(wasOpen => !wasOpen)}
            aria-controls={contentId}
          >
            <span className="markdown-parser__dependencies-summary">
              <Strong>
                {`${names.length} ${
                  names.length === 1 ? 'package' : 'packages'
                }`}
              </Strong>
              {`: ${names.join(', ')}`}
            </span>
          </ExpandableTextButton>
          <BaseExpand id={contentId} open={open}>
            {children}
          </BaseExpand>
        </ListItem>
      </UnorderedList>
    </div>
  );
};

/**
 * Innslaget slått sammen, om det ikke er annet enn genererte
 * avhengighetsseksjoner: en overskrift og en liste, om og om igjen. Er det noe
 * annet der, er det skrevet av et menneske, og da blir alt stående.
 */
const collapseDependencySections = (body: React.ReactNode[]) => {
  const collapsed: React.ReactNode[] = [];

  for (let index = 0; index < body.length; index += 2) {
    const heading = body[index];
    const list = body[index + 1];
    const title = sectionTitle(heading);

    if (!SECTIONS[title]?.generated || !isType(list, UnorderedList))
      return null;

    collapsed.push(
      <DependencySection key={index} title={title} names={listedPackages(list)}>
        {list}
      </DependencySection>,
    );
  }

  return collapsed.length ? collapsed : null;
};

/** The children of an entry, or of its summary when it has a description. */
const summaryOf = (entry: React.ReactElement): React.ReactNode[] => {
  const [first] = React.Children.toArray(entry.props.children);
  return React.Children.toArray(
    isType(first, Paragraph) ? first.props.children : entry.props.children,
  );
};

/** The scope an entry starts with, such as `typography/beta` in `**typography/beta:** …`. */
const scopeOf = (entry: React.ReactNode): string | null => {
  if (!isType(entry, ChangelogEntry)) return null;
  const [first] = summaryOf(entry);
  const text = isType(first, Strong) ? textContent(first.props.children) : '';
  return text.endsWith(':') ? text.slice(0, -1) : null;
};

/** The entry without its scope, for a list under that scope. */
// No spread: the tslib this build resolves has no __spreadArray.
const withoutScope = (entry: React.ReactElement) => {
  const summary = summaryOf(entry).slice(1);
  if (typeof summary[0] === 'string') summary[0] = summary[0].trimStart();
  const blocks = React.Children.toArray(entry.props.children);
  const [first] = blocks;

  return isType(first, Paragraph)
    ? React.cloneElement(
        entry,
        {},
        ([React.cloneElement(first, {}, summary)] as React.ReactNode[]).concat(
          blocks.slice(1),
        ),
      )
    : React.cloneElement(entry, {}, summary);
};

/**
 * Entries with the same scope listed under it once, so a section with many
 * `typography/beta` fixes reads as one group. A scope with one entry is left as it is.
 */
const groupByScope = (list: React.ReactElement) => {
  const entries = React.Children.toArray(list.props.children);
  const groups = new Map<string | null, React.ReactNode[]>();
  const order: React.ReactNode[] = [];

  entries.forEach(entry => {
    const scope = scopeOf(entry);
    if (scope === null) return order.push(entry);
    if (!groups.has(scope)) {
      groups.set(scope, []);
      order.push(scope);
    }
    groups.get(scope)?.push(entry);
  });

  return React.cloneElement(
    list,
    {},
    order.flatMap(item => {
      if (typeof item !== 'string') return [item];
      const group = groups.get(item) ?? [];
      if (group.length === 1) return group;

      return (
        <ChangelogEntry key={item}>
          <Strong>{item}</Strong>
          <UnorderedList>
            {group.map(entry => withoutScope(entry as React.ReactElement))}
          </UnorderedList>
        </ChangelogEntry>
      );
    }),
  );
};

/** Every list a person wrote, grouped by scope. Generated sections are left alone. */
const groupSectionsByScope = (nodes: React.ReactNode[]) =>
  nodes.map((node, index) => {
    const title = sectionTitle(nodes[index - 1]);
    return title && !SECTIONS[title]?.generated && isType(node, UnorderedList)
      ? groupByScope(node)
      : node;
  });

/** Nodene delt i én bolk per release: overskriften, og alt som følger den. */
const splitReleases = (nodes: React.ReactNode[]) => {
  const releases: React.ReactNode[][] = [];

  nodes.forEach(node => {
    if (isType(node, ReleaseHeading) || releases.length === 0)
      releases.push([]);
    releases[releases.length - 1].push(node);
  });

  return releases;
};

/**
 * Releases whose whole content is generated dependency sections are collapsed;
 * anything a person wrote is left open. Both kinds of release heading are
 * rendered as ReleaseHeading, so they are what a release entry starts at.
 */
const collapseDependencyOnlyReleases = (nodes: React.ReactNode[]) =>
  // No spread: the tslib this build resolves has no __spreadArray.
  splitReleases(nodes).reduce<React.ReactNode[]>((output, release) => {
    const body = release.slice(1);

    return output.concat(release[0], collapseDependencySections(body) ?? body);
  }, []);

const OVERRIDES = {
  // Releases are h1 when the version got a minor or major bump and h2
  // when it got a patch, but they are the same thing to a reader.
  h1: { component: ReleaseHeading },
  h2: { component: ReleaseHeading },
  h3: { component: ChangelogSection },
  h4: { component: MinorHeading },
  h5: { component: MinorHeading },
  a: { component: Link },
  p: { component: Paragraph },
  ul: { component: UnorderedList },
  li: { component: ChangelogEntry },
  strong: { component: Strong },
  code: { component: Code },
};

export const MarkdownParser: React.FC<{ children: any }> = ({ children }) => {
  // Compiled rather than rendered through the component, so the releases can
  // be grouped: markdown-to-jsx emits headings and lists as siblings.
  const nodes = React.Children.toArray(
    compiler(children, {
      forceBlock: true,
      overrides: OVERRIDES,
      wrapper: null,
      // Commit bodies mention tag names like <details> and <dialog>. Parsed as
      // HTML they turn into real elements: an empty disclosure widget, or text
      // that disappears entirely inside a closed dialog.
      disableParsingRawHTML: true,
    }) as React.ReactNode,
  );

  return (
    <TextContainer className="markdown-parser" lang="en">
      {collapseDependencyOnlyReleases(groupSectionsByScope(nodes))}
    </TextContainer>
  );
};
