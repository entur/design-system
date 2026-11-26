import { useMemo } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { IGatsbyImageData } from 'gatsby-plugin-image';

import illustrationKeywords from './illustrationKeywords.json';
import { SCENARIO_BUILDER_ID, SCENE_PEOPLE } from './scenarioScene';

export type ColorMode = 'standard' | 'darkmode' | 'contrast';

export const COLOR_MODES: {
  value: ColorMode;
  label: string;
  lowercase: string;
}[] = [
  { value: 'standard', label: 'Standard', lowercase: 'standard' },
  { value: 'darkmode', label: 'Mørk', lowercase: 'mørk modus' },
  { value: 'contrast', label: 'Kontrast', lowercase: 'kontrast' },
];

/** Utviklingsprinsipper versions, shown on their own dialog */
export const STYLES: { value: string; label: string }[] = [
  { value: '', label: 'Farge' },
  { value: 'color-bubble', label: 'Farge med boble' },
  { value: 'bw', label: 'Monokrom' },
  { value: 'bw-bubble', label: 'Monokrom med boble' },
];

/** Motifs of one illustration, shown as one card with a choice in the dialog. Order sets the default */
export const MOTIFS: Record<string, string> = {
  'Dog left': 'Venstre',
  'Dog right': 'Høyre',
  'Moose spring': 'Vår',
  'Moose winter': 'Vinter',
  'Front page illustration summer': 'Sommer',
  'Front page illustration winter': 'Vinter',
  'Business traveller running side': 'Fra siden',
  'Business traveller running front': 'Forfra',
  'Mobile discount': 'Rabatt',
  'Mobile trip': 'Reise',
  'Mobile in hand left discount': 'Venstre, rabatt',
  'Mobile in hand left trip': 'Venstre, reise',
  'Mobile in hand right discount': 'Høyre, rabatt',
  'Mobile in hand right trip': 'Høyre, reise',
};

export const PRINCIPLES_CATEGORY = 'Utviklingsprinsipper';
export const PRINCIPLES_COMPOSITION = 'Principles Composition';

export type IllustrationFile = {
  extension: string;
  publicUrl: string;
};

export type IllustrationVariant = {
  colorMode: ColorMode;
  hasBackground: boolean;
  /** Utviklingsprinsipper versions: '' (colour), 'bw', 'bw-bubble' or 'color-bubble' */
  style: string;
  /** Key in MOTIFS, or '' when the illustration has one motif */
  motif: string;
  image?: IGatsbyImageData | string;
  files: IllustrationFile[];
};

export type Illustration = {
  id: string;
  name: string;
  category: string;
  keywords: string[];
  variants: IllustrationVariant[];
};

type FileNode = {
  relativePath: string;
  name: string;
  extension: string;
  publicURL: string;
  childImageSharp?: { gatsbyImageData: IGatsbyImageData };
};

const FORMAT_FOLDERS = ['png', 'svg', 'pdf'];
const SCENARIO_PLACES: Record<string, string> = {
  City: 'by',
  'Train-station': 'togstasjon',
  Mountain: 'fjell',
};
const keywordsByName = illustrationKeywords as Record<string, string[]>;

export const useGetIllustrations = (): Illustration[] => {
  const query = useStaticQuery(graphql`
    query IllustrationsQuery {
      pngFiles: allFile(
        filter: {
          sourceInstanceName: { eq: "downloads" }
          relativePath: { glob: "illustrations/**" }
          extension: { eq: "png" }
        }
      ) {
        nodes {
          relativePath
          name
          extension
          publicURL
          childImageSharp {
            gatsbyImageData(
              layout: CONSTRAINED
              width: 400
              outputPixelDensities: [0.5, 1, 2]
              formats: [WEBP]
              placeholder: NONE
            )
          }
        }
      }
      otherFiles: allFile(
        filter: {
          sourceInstanceName: { eq: "downloads" }
          relativePath: { glob: "illustrations/**" }
          extension: { in: ["svg", "pdf"] }
        }
      ) {
        nodes {
          relativePath
          name
          extension
          publicURL
        }
      }
    }
  `);

  return useMemo(
    () =>
      groupIllustrations([
        ...query.pngFiles.nodes,
        ...query.otherFiles.nodes,
      ] as FileNode[]),
    [query],
  );
};

const STYLE_SUFFIXES = ['-bw-bubble', '-color-bubble', '-bw'];

// File names follow «Name[-background][-darkmode|-contrast][-bw|-bw-bubble|-color-bubble]»
const parseFileName = (fileName: string) => {
  let base = fileName;
  let colorMode: ColorMode = 'standard';
  const styleSuffix = STYLE_SUFFIXES.find(suffix => base.endsWith(suffix));
  const style = styleSuffix?.slice(1) ?? '';
  if (styleSuffix) base = base.slice(0, -styleSuffix.length);
  if (base.endsWith('-darkmode')) {
    colorMode = 'darkmode';
    base = base.slice(0, -'-darkmode'.length);
  } else if (base.endsWith('-contrast')) {
    colorMode = 'contrast';
    base = base.slice(0, -'-contrast'.length);
  }
  const hasBackground = base.endsWith('-background');
  if (hasBackground) base = base.slice(0, -'-background'.length);
  return { base, colorMode, hasBackground, style };
};

const SCENE_PATTERN = new RegExp(
  `^(${Object.keys(SCENARIO_PLACES).join('|')})-(.+)$`,
);

const describeIllustration = (folder: string, base: string) => {
  const person = folder.replace(/^Scene-/, '');
  const scene = base.match(SCENE_PATTERN);
  if (scene) {
    const place = SCENARIO_PLACES[scene[1]];
    return {
      name: `${scene[2]} (${place})`,
      keywords: [...(keywordsByName[person] ?? []), place, 'scenario'],
    };
  }
  return {
    name: base.replace(/^Scene-/, ''),
    keywords: keywordsByName[folder] ?? keywordsByName[base] ?? [],
  };
};

const groupIllustrations = (nodes: FileNode[]): Illustration[] => {
  const illustrations = new Map<string, Illustration>();

  for (const node of nodes) {
    const segments = node.relativePath
      .split('/')
      .slice(1, -1)
      .filter(segment => !FORMAT_FOLDERS.includes(segment.toLowerCase()));
    const category = segments[0];
    const folder = segments[segments.length - 1];
    const { base, colorMode, hasBackground, style } = parseFileName(node.name);
    const motif = base in MOTIFS ? base : '';
    // Motifs share their folder's card
    const id = motif ? segments.join('/') : `${segments.join('/')}/${base}`;

    let illustration = illustrations.get(id);
    if (!illustration) {
      illustration = {
        id,
        category,
        variants: [],
        ...describeIllustration(folder, motif ? folder : base),
      };
      illustrations.set(id, illustration);
    }

    let variant = illustration.variants.find(
      v =>
        v.colorMode === colorMode &&
        v.hasBackground === hasBackground &&
        v.style === style &&
        v.motif === motif,
    );
    if (!variant) {
      variant = { colorMode, hasBackground, style, motif, files: [] };
      illustration.variants.push(variant);
    }
    const extension = node.extension.toLowerCase();
    variant.files.push({ extension, publicUrl: node.publicURL });
    if (node.childImageSharp) {
      variant.image = node.childImageSharp.gatsbyImageData;
    } else if (extension === 'svg' && variant.image === undefined) {
      variant.image = node.publicURL;
    }
  }

  return withScenarioBuilder(Array.from(illustrations.values())).sort((a, b) =>
    a.name.localeCompare(b.name, 'no'),
  );
};

const BUILDER_PREVIEW =
  'Scenario/Scene-Woman standing by luggage/City-Woman standing by luggage';

// The scenario builder replaces the exported scenes of the people it can place
const withScenarioBuilder = (list: Illustration[]): Illustration[] => {
  const isBuilt = (i: Illustration) =>
    i.category === 'Scenario' &&
    SCENE_PEOPLE.some(person => i.id.startsWith(`Scenario/Scene-${person}/`));
  const preview = list.find(i => i.id === BUILDER_PREVIEW);
  if (!preview) return list;
  const builder: Illustration = {
    id: SCENARIO_BUILDER_ID,
    name: 'Scenariobygger',
    category: 'Scenario',
    keywords: [
      'scenario',
      'by',
      'togstasjon',
      'city',
      'train station',
      ...SCENE_PEOPLE,
      ...SCENE_PEOPLE.flatMap(person => keywordsByName[person] ?? []),
    ],
    variants: preview.variants,
  };
  return [builder, ...list.filter(i => !isBuilt(i))];
};

/** The illustration's motifs in MOTIFS order, empty when it has only one */
export const motifsOf = (illustration: Illustration) =>
  Object.keys(MOTIFS).filter(motif =>
    illustration.variants.some(v => v.motif === motif),
  );

/** Returns the variant closest to the requested colour mode and background */
export const pickVariant = (
  illustration: Illustration,
  colorMode: ColorMode,
  hasBackground: boolean,
  motif = motifsOf(illustration)[0] ?? '',
) => {
  const find = (mode: ColorMode, background: boolean) =>
    illustration.variants.find(
      v =>
        v.colorMode === mode &&
        v.hasBackground === background &&
        v.style === '' &&
        v.motif === motif,
    );
  return (
    find(colorMode, hasBackground) ??
    find(colorMode, !hasBackground) ??
    find('standard', hasBackground) ??
    find('standard', !hasBackground) ??
    illustration.variants[0]
  );
};
