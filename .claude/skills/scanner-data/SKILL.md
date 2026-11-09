---
name: scanner-data
description: Query the design system usage scanner data (which Entur repos use which @entur/* components, props, prop values, deprecated APIs, beta entry points, CSS overrides, owning teams) through PostHog. Use when deciding on breaking changes, deprecations, redesigns or new features, when asked "who uses X", "how is X used", "what is unused", or when building PostHog insights from scanner data.
---

# Scanner data

The [design system scanner](../../../tools/design-system-scanner/README.md) scans Entur repos every Monday. It loads the results into BigQuery, and PostHog syncs them into its data warehouse. Query them with HogQL in the PostHog project **Entur Linje (5424)**.

## Access

Use the PostHog CLI (`posthog-cli`, brew tap `posthog/tap`). The PostHog MCP is not available.

```sh
posthog-cli api call execute-sql '{"query":"SELECT count() FROM bigquery.scan_runs"}'
```

For queries with quotes, build the JSON with a helper instead of escaping by hand:

```sh
q() { posthog-cli api call execute-sql "$(python3 -I -c 'import json,sys;print(json.dumps({"query":sys.argv[1]}))' "$1")"; }
```

A personal API key with read scopes is enough: `query:read`, `warehouse_table:read`, `warehouse_view:read`, `external_data_source:read`, `project:read`, and `insight:read`, `insight_variable:read`, `dashboard:read` for existing insights. `posthog-cli login` creates a key with far wider scopes, so make the key by hand instead. A warning about the missing `user:read` scope is harmless.

Existing insights: `posthog-cli api call insights-list '{"limit":100}'` and `insight-get '{"id":"<short_id>"}'`. Reuse their HogQL before writing new queries.

## Tables

Each table is available as `bigquery.<table>` (and as `bigquery_<table>`). Every row carries `scan_id` and `scan_timestamp`.

| Table                | One row per                  | Key columns                                                                              |
| -------------------- | ---------------------------- | ---------------------------------------------------------------------------------------- |
| `scan_runs`          | scan                         | `scan_status`, `total_repos_scanned`, `total_repos_failed`                               |
| `repos`              | repo                         | `owner_teams` (JSON array), `framework`, `is_monorepo`, typography and colour rollups    |
| `repo_package_usage` | repo, package                | `package_version`, `resolved_version`, `is_design_system`, `ui_library_category`         |
| `repo_symbol_usage`  | repo, symbol, entry point    | `instance_count`, `props` (JSON `[{name, count}]`), `finding_source`, `deep_import_path` |
| `repo_prop_values`   | repo, component, prop, value | `prop_name`, `prop_value`, `instance_count`                                              |
| `ds_catalog`         | exported symbol, entry point | `known_props`, `enum_props`, `is_deprecated`, `deprecated_props`                         |
| `file_findings`      | file, symbol                 | `file_path`, `line_number`, `finding_type`, `deep_import_path`                           |
| `repo_css_overrides` | `.eds-*` selector use        | `base_class`, `class_generation`, `source`                                               |
| `repo_workspaces`    | monorepo workspace           | `workspace_type`, `ds_package_count`                                                     |

The column meanings are in the scanner README under "BigQuery output format". Discover what PostHog actually has with:

```sql
SELECT table_name, groupArray(column_name) FROM system.information_schema.columns
WHERE table_name LIKE 'bigquery.%' GROUP BY table_name
```

## Rules

- **Pin to the latest scan.** Every weekly scan appends a full snapshot, so summing across scans multiplies counts. Filter each table on `scan_timestamp = (SELECT max(scan_timestamp) FROM bigquery.<same table>)`. For trends, group by `scan_timestamp`.
- **An entry point is package + `deep_import_path` + symbol.** `Link` from `@entur/typography` and from `@entur/typography/beta` are different components. Never group on `symbol_name` alone, and filter beta on `deep_import_path = '/beta'`, not on the package name.
- **Exclude `finding_source = 'catalog-zero'`** when counting use. Those rows mark symbols that are installed but never used.
- **Array columns arrive as JSON strings.** `known_props`, `enum_props`, `deprecated_props` and `owner_teams` must be decoded: `JSONExtract(assumeNotNull(col), 'Array(String)')`.
- **`props` is a JSON string**: `ARRAY JOIN JSONExtractArrayRaw(assumeNotNull(props)) AS p`, then `JSONExtractString(p, 'name')` and `toInt(JSONExtractString(p, 'count'))`.
- **`prop_value` is always a string**, so `true` and `12` arrive as `'true'` and `'12'`. `'(expression)'` counts non-literal values such as `variant={v}`. Include it in the denominator when you report shares, and say how big it is.
- **Only enum-like props have values**: literal unions and booleans listed in the catalog's `enum_props`. Free-text props (`children`, `className`, `href`, `title`, `label`, `aria-*`, `data-*`) are never recorded.
- **`sumIf` returns NULL** when nothing matches. Wrap it in `coalesce(…, 0)`.
- **New BigQuery columns are not visible in PostHog until the schema is refreshed** for that table under Data warehouse → BigQuery source. Keep the sync on `full_refresh`, because incremental sync fails.
- **Only whitelisted repos are scanned.** State the scope ("of N scanned repos") with every number. Get N from `scan_runs.total_repos_scanned`.

## Questions and queries

### Who passes a prop to a component (blast radius)

```sql
SELECT u.repo_name, u.deep_import_path, toInt(JSONExtractString(p, 'count')) AS instances
FROM bigquery.repo_symbol_usage AS u
ARRAY JOIN JSONExtractArrayRaw(assumeNotNull(u.props)) AS p
WHERE u.scan_timestamp = (SELECT max(scan_timestamp) FROM bigquery.repo_symbol_usage)
  AND u.package_name = '@entur/dropdown' AND u.symbol_name = 'Dropdown'
  AND JSONExtractString(p, 'name') = 'variant'
ORDER BY instances DESC
```

### Which values a prop gets

```sql
SELECT prop_value, sum(instance_count) AS instances, uniqExact(repo_name) AS repos,
       round(100 * instances / sum(instances) OVER (), 1) AS share_pct
FROM bigquery.repo_prop_values
WHERE scan_timestamp = (SELECT max(scan_timestamp) FROM bigquery.repo_prop_values)
  AND package_name = '@entur/button' AND symbol_name = 'Button'
  AND deep_import_path IS NULL AND prop_name = 'variant'
GROUP BY prop_value ORDER BY instances DESC
```

### Use of deprecated components and props

```sql
WITH catalog AS (
  SELECT package_name, coalesce(deep_import_path, '') AS entry, symbol_name,
         coalesce(is_deprecated, false) AS is_deprecated,
         JSONExtract(assumeNotNull(deprecated_props), 'Array(String)') AS deprecated_props
  FROM bigquery.ds_catalog
  WHERE scan_timestamp = (SELECT max(scan_timestamp) FROM bigquery.ds_catalog)
)
SELECT c.package_name, c.symbol_name, JSONExtractString(p, 'name') AS prop,
       uniqExact(u.repo_name) AS repos, sum(toInt(JSONExtractString(p, 'count'))) AS instances
FROM bigquery.repo_symbol_usage AS u
JOIN catalog AS c ON c.package_name = u.package_name
  AND c.entry = coalesce(u.deep_import_path, '') AND c.symbol_name = u.symbol_name
ARRAY JOIN JSONExtractArrayRaw(assumeNotNull(u.props)) AS p
WHERE u.scan_timestamp = (SELECT max(scan_timestamp) FROM bigquery.repo_symbol_usage)
  AND (c.is_deprecated OR has(c.deprecated_props, JSONExtractString(p, 'name')))
  AND (c.is_deprecated OR length(c.deprecated_props) > 0)
GROUP BY c.package_name, c.symbol_name, prop ORDER BY repos DESC
```

A deprecated component used without props doesn't show up here. Count it from `instance_count` instead.

### Stable vs beta adoption

```sql
SELECT package_name, symbol_name, coalesce(deep_import_path, '') AS entry,
       uniqExact(repo_name) AS repos, sum(instance_count) AS instances
FROM bigquery.repo_symbol_usage
WHERE scan_timestamp = (SELECT max(scan_timestamp) FROM bigquery.repo_symbol_usage)
  AND finding_source != 'catalog-zero'
GROUP BY package_name, symbol_name, entry ORDER BY symbol_name, entry
```

### Components nobody renders

```sql
WITH used AS (
  SELECT DISTINCT package_name, symbol_name FROM bigquery.repo_symbol_usage
  WHERE scan_timestamp = (SELECT max(scan_timestamp) FROM bigquery.repo_symbol_usage)
    AND finding_source != 'catalog-zero'
)
SELECT c.package_name, c.symbol_name
FROM bigquery.ds_catalog AS c
LEFT JOIN used AS u ON u.package_name = c.package_name AND u.symbol_name = c.symbol_name
WHERE c.scan_timestamp = (SELECT max(scan_timestamp) FROM bigquery.ds_catalog)
  AND c.symbol_type = 'component' AND u.symbol_name = ''
```

For declared props nobody passes, start from the insight "Unused props per component".

### Where consumers override internal classes

```sql
SELECT package_name, base_class, class_generation,
       uniqExact(repo_name) AS repos, count() AS selectors
FROM bigquery.repo_css_overrides
WHERE scan_timestamp = (SELECT max(scan_timestamp) FROM bigquery.repo_css_overrides)
GROUP BY package_name, base_class, class_generation
ORDER BY repos DESC, selectors DESC
```

Many overrides of one class point to a missing variant or prop.

### Which teams use a component

```sql
SELECT arrayJoin(JSONExtract(assumeNotNull(r.owner_teams), 'Array(String)')) AS team,
       uniqExact(u.repo_name) AS repos, sum(u.instance_count) AS instances
FROM bigquery.repo_symbol_usage AS u
JOIN bigquery.repos AS r ON r.repo_name = u.repo_name AND r.scan_id = u.scan_id
WHERE u.scan_timestamp = (SELECT max(scan_timestamp) FROM bigquery.repo_symbol_usage)
  AND u.symbol_name = 'Dropdown' AND u.finding_source != 'catalog-zero'
GROUP BY team ORDER BY repos DESC
```

### Down to file and line

`file_findings` has rows only when a scan ran with `--include-file-findings`. Check that it has rows for the latest scan before you rely on it.

## Reporting

- Give the scan date and the number of scanned repos with every number.
- Separate stable and beta.
- For prop values, report the `(expression)` share next to the literal values.
- Say when a conclusion rests on a few repos. Three repos with many instances is not broad use.
