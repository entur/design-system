# Pull Request

Create the pull request for the current branch, or update the description of the one already open, so it says what the branch actually does.

## Arguments

Optional: a PR number (e.g. `/pull-request 303`), or `ready` to open a PR that is ready for review. Without `ready`, a new PR is opened as a draft.

## Step 1: Find the PR

Run `gh pr view $PR_NUMBER --json number,title,body,isDraft,headRefName,baseRefName`. Without a PR number, gh uses the current branch.

- **A PR exists:** update it (Step 4b).
- **No PR:** create one (Step 4a). The branch must be pushed and must not be `main`. If it has no Jira ID at the start of its name, ask for one.

## Step 2: Gather ground truth from the branch

Run these in parallel:

1. `git diff $BASE_BRANCH...HEAD --name-only` — all files changed on this branch
2. `git log $BASE_BRANCH...HEAD --format='%h %s%n%b'` — commits with their bodies and footers
3. Read `.github/pull_request_template.md` — the sections and what each one means. The template is the contract.

Then read the changed files that show intent: source in `packages/`, workflows, config, `AGENTS.md`, ADRs. Skip tests, lockfiles and generated files unless they are the only change.

## Step 3: Assess breaking changes

Read `doc/adr/0005-public-interface.adoc`, then check the diff against it:

- **Public interface changed** (exports, props, union values, defaults, size scales, tokens, stylesheet entries, `exports` subpaths, consumer `data-*` attributes, specificity, cascade layers, peer dependency ranges): breaking. Tick "Breaking change", and check that a commit has a `BREAKING CHANGE:` footer that names the element, the action and the replacement.
- **`eds-*` classes or DOM structure changed:** not breaking. Check that the commit body names what moved.
- **Visual change** that can lower contrast, shift layout or change meaning: tick "Visuell endring", and give a verdict with the reason under "Breaking changes". If you cannot tell, write that it needs a verdict, and say so to the user. Never guess "ikke breaking".
- **New `@deprecated`:** check for a `DEPRECATED:` footer with the removal version.

Beta components can break in a minor, but still need the footer. Report any footer that is missing or vague to the user. Fixing a commit message is their call.

## Step 4a: Create

Write the body following the template. Title: the main commit subject, or a summary in the same `type(scope): description` form. Then:

```bash
gh pr create --draft --title "..." --body-file /path/to/body.md
```

Leave out `--draft` only when the user passed `ready`. Copilot reviews a PR when it is ready for review, including the breaking-change check.

## Step 4b: Update

Go through the current description section by section and check each claim against the branch:

- Does **Hvordan** describe the implementation? Is anything mentioned that is not in the code, or in the code but not mentioned?
- Do **Type endring** and **Breaking changes** match Step 3?
- Are the **Sjekkliste** boxes right for this kind of change?
- Does **Hvorfor** state the problem and the decision, not an external source the branch is catching up to?

Keep what is accurate and fix only what is wrong or missing. Then:

```bash
gh pr edit PR_NUMBER --body-file /path/to/body.md
```

`gh pr edit` is verified to work on this repo. If a `GraphQL: ... Projects` deprecation
warning shows up in the output, it is noise from an unrelated field and does not mean the
update failed — check the returned PR URL and exit code, and filter it with
`2>&1 | grep -v "GraphQL.*Projects"` if it clutters the output.

## Writing rules

**Code is the source of truth.** Never describe the work as implementing, matching or
catching up to Figma — "Figma har fått ny utforming, så komponenten er oppdatert" gets the
direction wrong and makes deliberate work read as catch-up. A redesign is a decision about
the component that rolls out to both Figma and code, and neither is downstream of the other.
Write **Hvorfor** as the problem with the component and the decision taken ("vi har utarbeidet
et nytt design for X som erstatter Y"), and mention Figma only as a place the design also
ships — never as the origin of the requirement. The same goes for any other upstream artefact
a description could be tempted to defer to: a spec, a ticket or another team's component.

Norwegian wording rules:

- Bokmål, never Nynorsk.
- Do not translate technical terms. Prop, function, keyword, type, HTML element and CSS feature names stay in English (`children`, `ref`, `disabled`, `useEffect`, `aria-live`), as do framework concepts a Norwegian developer would say in English anyway (`parent`, `state`, `hook`, `callback`, `default`, `token`, `wrapper`).
- Translate only ordinary words: component → komponent, page → side, button → knapp.
- Inflect around the English term: `props`-ene, `prop`-en, `children`-en. Never `proppene`, and never invent a Norwegian noun for something the code calls something else.
- Prefer a comma or full stop over a dash when joining clauses. When a dash is right, use an en-dash (–), never an em-dash.

If a section is genuinely not applicable (e.g. no screenshots for a tooling change), keep it with the existing N/A note or omit gracefully — don't add noise.

End the body with the attribution lines the session gives for pull requests, if any.

## Step 5: Confirm

Give the PR URL, and a short summary: created or updated, which sections changed, and the breaking-change verdict.
