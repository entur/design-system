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

## Step 4: Generate the Slack release message

Write the release message in Norwegian (Bokmål), from the changelogs of the packages with real changes. Skip packages whose entry is only "Entur Dependency Updates" or "Version bump only", and changes consumers cannot notice (such as removing a class with no visible effect).

The message has two parts: a short main post that answers "do I need to do anything, and what is new for me?", and a thread reply with the details per package.

### Main post

```
**:sparkles: Ny release av Linje**
:white_check_mark: Ingen breaking changes. <what to do, e.g. update packages together>

**Det viktigste**
• **:frame_with_picture: <theme in plain words>**
    ◦ what the user notices, with component names as code
    ◦ Pakke: icons 10.2.0
• **:keyboard: <theme>**
    ◦ what changed and what it was like before
    ◦ behaviour changes users will notice
    ◦ Pakker: datepicker 12.3.3, modal 2.1.3
• **:wrench: Mindre rettinger**
    ◦ short list of the rest

:thread: Detaljer per pakke i tråden. Alle changelogs
```

- The first line after the title says whether consumers must act. With breaking changes or deprecations, start with `:warning:` and say what breaks or is deprecated, what to do, and the removal version. Mark beta-only breaking changes "gjelder kun beta-komponenter".
- Group the changes into 2–4 themes by what the user notices, not by package or fix type, and give each a fitting emoji. Put the remaining small changes under `:wrench: Mindre rettinger`.
- Each theme is a list item with a bold heading, and its details as a nested list. Bold text next to plain text on one line is hard to tell apart, so keep headings on their own line.
- The last sub-item of each theme lists its packages with versions (`Pakke:` or `Pakker:`), each linked to its changelog.

### Thread reply

The detailed list, without a title or closing link, since the main post has both:

```
**:warning: Breaking changes**
• @entur/package@version
    ◦ what breaks and what to do

**:hourglass: Deprecations**
• @entur/package@version
    ◦ what is deprecated, the replacement, and the version it will be removed in

**:rocket: Minor change / feature**
• @entur/package@version
    ◦ change description

**:bug: Bugfix**
• @entur/package@version, @entur/other@version
    ◦ change shared by both packages
```

- Sections in this order, as in the changelogs: what needs action first. Leave out empty sections. Use `:rocket: Feature (kun beta-endringer)` when every feature is beta-scoped.
- Each package is a list item, with its changes as a nested list. Group packages that share one change into one item that names every package.
- Bullets are short and consumer-focused. Breaking changes and deprecations keep the action and the version from the changelog.

### Both parts

- Every package links to its changelog on the documentation site: `https://linje.entur.no/komponenter/ressurser/changelog?package=<name>`, where `<name>` is the npm name without `@entur/`. There is no anchor for a single version, so do not append one.
- Tag every linje.entur.no link with `utm_source=slack&utm_campaign=release-<YYYY-MM-DD>` (the release date). Slack strips the referrer, so the tag is the only way analytics can count visits from each release post. Example: `https://linje.entur.no/komponenter/ressurser/changelog?package=travel&utm_source=slack&utm_campaign=release-2026-11-27`.
- Wrap component names and other API names (hooks, icons, props, CSS classes) in `<code>`, for example `<code>Modal</code>`. Keep headings, package lists and plain descriptions such as "nedtrekksliste" as text.

Slack shows markdown and `<url|label>` literally when pasted. Put each part on the clipboard as HTML instead, with plain text as fallback, so links and lists survive. Write `main.html`/`main.txt` and `thread.html`/`thread.txt` in the scratchpad, and this Swift script, `copy.swift`:

```swift
import AppKit
let base = CommandLine.arguments[1]
let html = try! String(contentsOfFile: base + ".html", encoding: .utf8)
let text = try! String(contentsOfFile: base + ".txt", encoding: .utf8)
let board = NSPasteboard.general
board.clearContents()
board.setString(html, forType: .html)
board.setString(text, forType: .string)
```

Use `<b>` for headings, `<a href>` for links, a `<ul>` with a nested `<ul>` per item, and a `<br>` before each section. No backticks or asterisks in the HTML, and link text rather than bare URLs, which unfurl. In the `.txt` files, use `•` and an indented `◦`, with no backticks or other markdown: Slack pastes the plain text instead of the HTML when it finds markdown there.

Copy the main post with `swift copy.swift main` and tell the user. When they ask for the thread, run `swift copy.swift thread` yourself.

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
