---
name: fix-security-vulnerabilities
description: Patch open Dependabot/CVE alerts via Yarn 4 resolutions without breaking @entur/* consumers
---

# Fix Security Vulnerabilities

Fix open security vulnerabilities reported by Dependabot / GitHub Advisory
Database in this repo. Patch as many CVEs as possible *without* breaking
changes to consumers of the published `@entur/*` packages.

## Context

- Yarn 4.9.3 monorepo, 23 packages under `packages/`, docs site under `apps/documentation/`
- Root `package.json` already has ~90 `resolutions` entries — extend this pattern, don't replace it
- `yarn npm audit` crashes with HTTP 400 on Yarn 4 in this repo — do NOT use it

## Investigation

1. List open Dependabot alerts via GitHub API:
   ```bash
   gh api repos/entur/design-system/dependabot/alerts \
     --jq '.[] | select(.state=="open") | {number, severity: .security_advisory.severity, package: .security_vulnerability.package.name, patched: .security_vulnerability.first_patched_version.identifier, summary: .security_advisory.summary}'
   ```
   Cross-reference with `gh api repos/entur/design-system/dependabot/alerts --paginate`
   if there are many.

2. For each vulnerable package, determine:
   - **Direct dep in `packages/*/package.json`?** → prefer a real version bump in
     that package's `package.json`.
   - **Transitive/dev-only dep?** → prefer a `resolutions` override in root
     `package.json`.
   - Find the lowest patched version per the advisory.

3. Check which ranges the vulnerable package appears under in the lockfile:
   ```bash
   yarn why <package-name>
   ```
   Each distinct semver range may need its own resolution entry.

4. For each vulnerability you cannot fix, document: the blocker (e.g. major
   version gap in a pinned transitive parent, patch doesn't exist yet, or
   only affects unused code paths) and the residual risk.

## Implementation

### Resolution syntax (Yarn 4)

This repo uses Yarn 4's `@npm:` resolution qualifier for range-specific pins.
Follow the existing pattern in root `package.json`:

```jsonc
// Pin all instances matching a specific range:
"minimatch@npm:^3.0.4": "3.1.4",
"minimatch@npm:^9.0.3": "9.0.7",

// Pin all instances regardless of range (use sparingly):
"cookie": "0.7.0",
```

Use range-qualified entries (`pkg@npm:^X.Y.Z`) when the package appears
under multiple major versions in the lockfile. Use unqualified entries
only when every instance should resolve to the same version.

### Steps

1. Add or update entries in the `resolutions` field of root `package.json`.
   Group by package name, ordered alphabetically, matching existing style.
2. If a resolution crosses a major version boundary (e.g. `serialize-javascript
   ^5 → 7`), verify API compatibility for actual call sites in this repo.
   Note the verification in the PR body.
3. If Yarn rejects a package due to age-gating, install with:
   ```bash
   YARN_ENABLE_MINIMAL_VERSION_AGE_GATE=0 yarn install
   ```
   Note this in the PR body.
4. Run `yarn install` to regenerate `yarn.lock`.
5. Do NOT modify `packages/*/package.json` unless the vulnerable package
   is a direct dependency there.

## Verification (mandatory before reporting done)

Run these in order:

1. **`yarn build:packages`** — all packages must build clean.
2. **`yarn test`** — all test suites must pass.
3. **`yarn start:documentation`** — Gatsby must compile and begin serving
   (smoke-check; especially relevant if you bumped `axios`, `gatsby-source-sanity`
   deps, or webpack). Kill after confirming successful compilation.
4. **Re-query Dependabot alerts:**
   ```bash
   gh api repos/entur/design-system/dependabot/alerts \
     --jq '.[] | select(.state=="open") | {number, package: .security_vulnerability.package.name, severity: .security_advisory.severity}'
   ```
   List which alerts are now resolved and which remain open with reasons.

## Commit conventions

- **Type/scope:** `chore(root): patch transitive security vulnerabilities`
  Never use `fix:` or `feat:` for dependency-only changes — they trigger
  version bumps in published packages.
- **AI attribution:** If AI produced the majority of the changes, add trailer:
  `AI-assistant: Claude Code (claude-opus-4-6)` — do NOT use `Co-authored-by`.

## PR description

Write in Norwegian. Follow the repo's PR template exactly. Use these sections:

### 💡 Hvorfor?
List CVEs being fixed, grouped by severity. Reference GitHub Advisory IDs
(GHSA-xxxx) when available.

### 🔧 Hvordan?
Structure as:
- **Direkte oppdateringer:** any real version bumps in `packages/*/package.json`
- **Resolution-overrides i root `package.json`:** list each as
  `package@range: old → new — CVE-ID one-line summary`
- **Fortsatt ufikserbart:** vulnerabilities intentionally left, with blocker
  explanation and residual risk assessment
- One sentence on impact for consumers of `@entur/*` packages (usually: "Ingen
  endring for konsumenter — kun interne/transitive avhengigheter er oppdatert.").

### 🧩 Type endring
Tick `🏗️ Bygg-/CI-endring` only.

### 💬 Tilleggsnotater
Note any: manual API compatibility verifications for major-version jumps,
age-gate workarounds, unusual range overrides (e.g. overriding `~3.7.6` to
`3.8.3` because the pinned version itself is vulnerable).

### ✅ Sjekkliste
Tick applicable items.

### 🧪 Testing
Concrete numbers: "X pakker bygger OK", "Y testsuiter (Z tester) passerer",
and docs-site smoke-check result.
