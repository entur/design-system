# changelog-dependency-updates

Replaces Lerna's `**Note:** Version bump only for package @entur/x` with the
internal dependency updates that caused the bump.

Most releases bump more packages than were edited: change `@entur/tokens`, and
every package depending on it is republished. Lerna has no commit to write for
those, so it writes a note that tells the reader nothing. This tool fills the
entry in with what the manifests can verify — which dependency moved, from which
range to which, and where its changelog entry is.

## When it runs

Lerna runs it as the root `version` lifecycle script, wired up in the root
`package.json`:

```json
"version": "node tools/changelog-dependency-updates/cli.js"
```

Inside `lerna publish --conventional-commits`, the version command does this in
order (`lerna/dist/commands/version/index.js`, `updatePackageVersions`):

1. root `preversion`
2. per package: `preversion` → write the new version and dependency ranges →
   `version` → write `CHANGELOG.md`
3. **root `version`** ← this tool
4. update the lockfile
5. `git add` the changed files, then commit and tag

Every manifest already carries its new version and every changelog entry is
written, and nothing has been staged yet, so the rewrites land in the release
commit without a second commit. Against the working tree by hand:

```sh
node tools/changelog-dependency-updates/cli.js --dry-run
```

If it throws, the release stops — before the commit, the tags and the push, so
`git checkout .` and the release never happened. Swallowing the error would ship
entries that quietly say less than they could, which nobody would notice. To
release past a broken tool, drop the `version` script for that run.

## What it writes

```markdown
## [0.11.5](https://github.com/entur/design-system/compare/@entur/chip@0.11.4...@entur/chip@0.11.5) (2026-09-08)

### Entur Dependency Updates

- **@entur/tokens:** `^4.1.0` → `^4.1.1` ([changelog](https://github.com/entur/design-system/blob/main/packages/tokens/CHANGELOG.md#411-2026-09-08))
```

Peer dependencies get their own `### Entur Peer Requirements` section: an
updated dependency is something the consumer gets, a peer requirement is
something the consumer has to satisfy.

The markdown stays plain — these files are also read on GitHub, in npm and in an
editor. `apps/documentation/src/components/PageHeader/MarkdownParser.tsx`
matches both sections by their heading text, so renaming a heading here means
renaming it there; it gives them an icon and folds them away when a release is
nothing else, leaving the count and the package names on the visible line.

Titles are normalized on the way past: every changelog here is titled
`# Changelog`, and Lerna writes `# Change Log` when it creates the file for a
package that has never been released. First line only, and only for a package in
the release being prepared.

## What it will not write

- **Never an authored entry.** Only the exact fallback note is replaced. A
  release with `feat`, `fix`, breaking-change or migration notes is left alone,
  byte for byte, and so is every entry below the newest one.
- **Never a consequence.** "No visual changes", "No API changes" and "No action
  required" are statements only a human can make. It reports the version
  movement and links to the entry that explains it.
- **Nothing it cannot verify.** A fallback entry is not proof of a dependency
  update: a package can be republished for other reasons, and a package released
  for the first time has nothing to compare against. Lerna's note stands,
  because it is accurate.

## How a change is verified

Internal dependencies are declared as `workspace:^`, which never changes text
between releases — the package manager rewrites it to `^<version of that
package>` at publish time. So both sides are resolved first:

| Specifier          | Published range |
| ------------------ | --------------- |
| `workspace:^`      | `^1.2.3`        |
| `workspace:~`      | `~1.2.3`        |
| `workspace:*`      | `1.2.3`         |
| `workspace:^2.0.0` | `^2.0.0`        |

The previous side comes from the package's own previous release — the git tag
`@entur/x@<previous version>`, falling back to `HEAD` when that tag is missing —
and the current side from the working tree Lerna has just written. Anything that
cannot be resolved on a side that declares it, such as a `link:` specifier, is
left out rather than guessed at, and only packages released from this repository
are compared at all.

Generation is deterministic — no dates, no ordering by anything but package
name — and safe to repeat: a second run finds the sections already there and
writes nothing.

## Why older entries still say "Version bump only"

Entries from 2025-01 onwards were filled in once, by reading each past release
against the release below it in the same changelog, both at their tags: 607
entries across 20 packages. The 2078 notes before that date stay as they are,
deliberately — the note is accurate, the value of a dependency range on a 2021
patch is nil, and filling them in would add some 40% to files the documentation
site fetches whole. If that ever changes, the tags reach back to 2019, and the
pair of refs `cli.js` compares is all a run over history needs.

A release that is abandoned after its changelog is written leaves an entry for
a version that never shipped, and a manifest naming it. Two of those had put
`@entur/layout@4.0.0` in entries from May, months before it existed:
`changelog-data.test.js` holds the invariant that caught them.

## Tests

```sh
yarn workspace changelog-dependency-updates test
```

`index.test.js` covers the parsing, resolving and rendering, `repo.test.js` what
a ref that is not there answers and what ends the run instead,
`docs-parser.test.js` the contract with the documentation site, and
`changelog-data.test.js` the entries already in the repository. `cli.test.js`
builds a throwaway repository with `testRepository.js` — HEAD is the previous
release, tags and all, and the working tree carries what Lerna writes mid-`lerna
version` — and runs the real entry point over it.

## Known limitation

`lerna publish --create-release` builds its GitHub release notes from the entry
Lerna generated, before this tool runs, so those notes would keep the bump-only
note. The repository does not use that flag today.
