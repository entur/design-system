# Publish

Bump versions and publish all changed `@entur/*` packages to npm using Lerna + conventional commits.

## Step 1: Pre-flight checks

Run in parallel:

1. `git status` — must be clean (no uncommitted changes)
2. `git log --oneline -3` — confirm on `main` and up to date
3. Check npm login: `npm whoami`

If `npm whoami` fails or returns an unexpected user, **stop immediately** and tell the user to log in first:

```bash
npm login
```

npm publish requires 2FA — the user must be logged in before proceeding.

If working tree is dirty or not on main, stop and tell the user.

## Step 2: Run lerna version

```bash
HUSKY=0 yarn lerna version --conventional-commits --yes 2>&1
```

This creates the version commit, local tags, and pushes tags to remote. It does NOT publish to npm. Breaking changes in beta scopes bump a minor, not a major (ADR 5); the changelog preset handles that.

## Step 3: Show publish summary

List all packages that will be published (non-private). Format as a table:

| Package | Version |
| ------- | ------- |

**Highlight** (bold or note) any package bumped beyond patch (minor or major).

Private packages (code-playground, documentation, studio-linje, design-system-scanner) are skipped — mention them briefly so the user knows.

## Step 4: Generate Slack release message

Write the release message in Norwegian (Bokmål), from the changelogs of the packages with real changes. Skip packages whose entry is only "Entur Dependency Updates" or "Version bump only".

```
:sparkles: Ny release

:warning: Breaking changes
@entur/package@version
• what breaks and what to do

:hourglass: Deprecations
@entur/package@version
• what is deprecated, the replacement, and the version it will be removed in

:rocket: Minor change / feature
@entur/package@version
• change description

:bug: Bugfix
@entur/package@version
• change description

:computer: Her finner du alle våre changelogs: https://linje.entur.no/komponenter/ressurser/changelog
```

- Sections in this order, as in the changelogs: what needs action first. Leave out empty sections.
- Use `:rocket: Feature (kun beta-endringer)` when every feature in the release is beta-scoped, and mark beta-only breaking changes "gjelder kun beta-komponenter".
- Bullets are short and consumer-focused: what changed and how it affects use. Breaking changes and deprecations keep the action and the version from the changelog.
- Group packages that share one change (one feature in all packages) into one sentence instead of a line each.
- Every package heading links to its changelog on the documentation site: `https://linje.entur.no/komponenter/ressurser/changelog?package=<name>`, where `<name>` is the npm name without `@entur/`. There is no anchor for a single version, so do not append one.

Slack shows markdown and `<url|label>` literally when pasted. Put the message on the clipboard as HTML instead, with plain text as fallback, so links and lists survive. Write a Swift script in the scratchpad and run it with `swift copy.swift`:

```swift
import AppKit
let html = try! String(contentsOfFile: "message.html")
let text = try! String(contentsOfFile: "message.txt")
let board = NSPasteboard.general
board.clearContents()
board.setString(html, forType: .html)
board.setString(text, forType: .string)
```

Use `<a href>` for links and `<ul>` for lists, no backticks or asterisks, and link text rather than bare URLs, which unfurl. Tell the user the message is on their clipboard.

## Step 5: Tell the user to publish

You cannot handle interactive 2FA prompts. Tell the user to run this themselves in a separate terminal:

```bash
HUSKY=0 yarn lerna publish from-package --yes
```

Remind them they will be prompted for a 2FA OTP code during this step.

## Important rules

- **Never run the publish command yourself** — it requires interactive 2FA input.
- If `lerna version` fails inside the changelog generator
  (`tools/changelog-dependency-updates/cli.js`), nothing was committed, tagged
  or pushed: `git checkout .` and report the error. Do not work around it by
  removing the script without asking.
- Do not push to main yourself; `lerna version` pushes the version commit and tags.
- If `lerna version` fails or produces unexpected output, stop and explain before proceeding.
- If no packages have changed since their last tag, lerna will report nothing to version — tell the user and stop.
