import type {
  ColorTokenFinding,
  ColorTokenSummary,
  ComponentUsage,
  CssOverrideFinding,
  HardcodedColorFinding,
  PackageUsage,
  TypographySummary,
} from './types';

const TYPOGRAPHY_PACKAGE = '@entur/typography';

/**
 * Components only the new typography exports.
 *
 * Adoption is keyed on the component name rather than the import subpath, so
 * the metric survives the new typography being promoted out of beta: after
 * that both generations are imported from the package root and the subpath is
 * gone.
 */
const NEW_TYPOGRAPHY_COMPONENTS = new Set(['Heading', 'Text']);

/** Components only the legacy typography exports. */
const LEGACY_TYPOGRAPHY_COMPONENTS = new Set([
  'Heading1',
  'Heading2',
  'Heading3',
  'Heading4',
  'Heading5',
  'Heading6',
  'Paragraph',
  'LeadParagraph',
  'SubParagraph',
  'SmallText',
  'StrongText',
  'EmphasizedText',
  'Label',
  'SubLabel',
  'CodeText',
  'PreformattedText',
]);

type TypographyGeneration = 'new' | 'legacy' | 'shared';

/**
 * Which typography generation a JSX instance belongs to.
 *
 * Link, Blockquote, BlockquoteFooter and the list components are exported
 * under the same name by both generations, so they are counted separately and
 * kept out of the adoption share. The import subpath could tell them apart
 * today, but only until the new typography leaves beta — using it would make
 * the same component count as new before the release and as shared after,
 * which is the step change this classification exists to avoid.
 */
function typographyGeneration(component: ComponentUsage): TypographyGeneration {
  if (NEW_TYPOGRAPHY_COMPONENTS.has(component.componentName)) return 'new';
  if (LEGACY_TYPOGRAPHY_COMPONENTS.has(component.componentName)) {
    return 'legacy';
  }
  return 'shared';
}

export interface TypographySummaryInput {
  designSystemPackages: PackageUsage[];
  componentUsage: ComponentUsage[];
  cssOverrides: CssOverrideFinding[];
}

/**
 * Roll typography adoption up to a single per-repo record.
 *
 * Having these on the repo event means adoption can be read as one metric with
 * one filter, instead of being recomputed each time by counting component rows.
 *
 * Adoption is measured from JSX instances rather than imports: the KR is about
 * teams actually rendering the new components, and a type-only import of
 * TypographyTextVariant is not adoption.
 */
export function buildTypographySummary({
  designSystemPackages,
  componentUsage,
  cssOverrides,
}: TypographySummaryInput): TypographySummary {
  const pkg = designSystemPackages.find(p => p.name === TYPOGRAPHY_PACKAGE);

  let newInstanceCount = 0;
  let legacyInstanceCount = 0;
  let sharedInstanceCount = 0;

  for (const component of componentUsage) {
    if (component.packageName !== TYPOGRAPHY_PACKAGE) continue;
    switch (typographyGeneration(component)) {
      case 'new':
        newInstanceCount += component.instanceCount;
        break;
      case 'legacy':
        legacyInstanceCount += component.instanceCount;
        break;
      default:
        sharedInstanceCount += component.instanceCount;
    }
  }

  const typographyOverrides = cssOverrides.filter(
    override => override.packageName === TYPOGRAPHY_PACKAGE,
  );

  const totalInstances = newInstanceCount + legacyInstanceCount;

  return {
    hasPackage: pkg !== undefined,
    packageVersion: pkg?.version ?? null,
    isDevDependency: pkg?.isDev ?? false,
    usesNewTypography: newInstanceCount > 0,
    usesLegacyTypography: legacyInstanceCount > 0,
    newInstanceCount,
    legacyInstanceCount,
    sharedInstanceCount,
    newShare: totalInstances > 0 ? newInstanceCount / totalInstances : null,
    classOverrideCount: typographyOverrides.length,
    classOverrideLegacyCount: typographyOverrides.filter(
      o => o.classGeneration === 'legacy',
    ).length,
    classOverrideBetaCount: typographyOverrides.filter(
      o => o.classGeneration === 'beta',
    ).length,
    classOverrideUnknownCount: typographyOverrides.filter(
      o => o.classGeneration === 'unknown',
    ).length,
  };
}

export interface ColorTokenSummaryInput {
  analysisComplete: boolean;
  styleFilesScanned: number;
  colorTokenUsage: ColorTokenFinding[];
  hardcodedColors: HardcodedColorFinding[];
}

/** Roll colour token usage up to a single per-repo record. */
export function buildColorTokenSummary({
  analysisComplete,
  styleFilesScanned,
  colorTokenUsage,
  hardcodedColors,
}: ColorTokenSummaryInput): ColorTokenSummary {
  let usageCount = 0;
  let legacyTokenCount = 0;
  let newTokenCount = 0;

  for (const token of colorTokenUsage) {
    usageCount += token.occurrenceCount;
    if (token.tokenGeneration === 'legacy') {
      legacyTokenCount += token.occurrenceCount;
    } else {
      newTokenCount += token.occurrenceCount;
    }
  }

  let hardcodedColorCount = 0;
  let hardcodedMatchingTokenCount = 0;

  for (const color of hardcodedColors) {
    hardcodedColorCount += color.occurrenceCount;
    if (color.matchesTokenName) {
      hardcodedMatchingTokenCount += color.occurrenceCount;
    }
  }

  return {
    analysisComplete,
    styleFilesScanned,
    usageCount,
    distinctTokenCount: colorTokenUsage.length,
    legacyTokenCount,
    newTokenCount,
    hardcodedColorCount,
    hardcodedMatchingTokenCount,
  };
}

/**
 * Flatten the typography rollup into scalar properties.
 *
 * Shared by the PostHog and BigQuery exports so the two never drift apart, and
 * so a dashboard filter and a SQL query use the same column names.
 */
export function flattenTypographySummary(
  summary: TypographySummary,
): Record<string, string | number | boolean | null> {
  return {
    typography_has_package: summary.hasPackage,
    typography_version: summary.packageVersion,
    typography_is_dev_dependency: summary.isDevDependency,
    typography_uses_new: summary.usesNewTypography,
    typography_uses_legacy: summary.usesLegacyTypography,
    typography_new_instance_count: summary.newInstanceCount,
    typography_legacy_instance_count: summary.legacyInstanceCount,
    typography_shared_instance_count: summary.sharedInstanceCount,
    typography_new_share: summary.newShare,
    typography_class_override_count: summary.classOverrideCount,
    typography_class_override_legacy_count: summary.classOverrideLegacyCount,
    typography_class_override_beta_count: summary.classOverrideBetaCount,
    typography_class_override_unknown_count: summary.classOverrideUnknownCount,
  };
}

/** Flatten the colour token rollup into scalar properties. */
export function flattenColorTokenSummary(
  summary: ColorTokenSummary,
): Record<string, string | number | boolean | null> {
  return {
    color_analysis_complete: summary.analysisComplete,
    color_style_files_scanned: summary.styleFilesScanned,
    color_token_usage_count: summary.usageCount,
    color_token_distinct_count: summary.distinctTokenCount,
    color_token_legacy_count: summary.legacyTokenCount,
    color_token_new_count: summary.newTokenCount,
    hardcoded_color_count: summary.hardcodedColorCount,
    hardcoded_color_matching_token_count: summary.hardcodedMatchingTokenCount,
  };
}
