# Update PR Description

Sync the open PR description so it accurately reflects what the branch actually does — not what was written when the PR was first opened.

## Arguments

Optional: a PR number (e.g. `/update-pr 303`). If omitted, use the current branch's open PR.

## Step 1: Fetch the PR

Run in parallel:

- `gh pr view $PR_NUMBER --json number,title,body,headRefName,baseRefName` — get current description and branch names
- `gh repo view --json nameWithOwner` — get `owner/repo` for API calls

If no PR number was given, omit `$PR_NUMBER` (gh defaults to current branch). If no open PR exists, stop and say so.

## Step 2: Gather ground truth from the branch

Run these in parallel to understand what the branch actually does:

1. `git diff $BASE_BRANCH...HEAD --name-only` — all files changed on this branch
2. `git log $BASE_BRANCH...HEAD --oneline` — commit history for context
3. Read `.github/pull_request_template.md` — the expected structure and sections

Then read the most relevant changed files. Use judgment about which files reveal intent:

- Workflow files (`.github/workflows/`) → what CI does
- Config files, READMEs, changelogs → what changed externally
- Source files → what new behavior was introduced
- Skip test files, lockfiles, generated files unless they're the only thing changed

Read the PR template to understand which sections exist and what each one means. Don't skip this — the template is the contract.

## Step 3: Compare description against reality

Go through the current PR description section by section. For each claim, verify it against what you read:

- Does the **Hvordan** accurately describe the implementation?
- Are any steps, tools, or outputs mentioned that don't exist in the code?
- Are any steps, tools, or outputs in the code that aren't mentioned?
- Does **Type endring** correctly reflect the nature of the changes?
- Are the **Sjekkliste** checkboxes appropriate for this kind of change?

Focus on factual accuracy. Don't rewrite style or restructure unless something is genuinely wrong or missing.

## Step 4: Produce the updated description

Write the corrected body. Keep everything that's accurate. Fix only what's wrong or missing. Preserve the Norwegian language and the PR template section structure.

Norwegian wording rules:

- Bokmål, never Nynorsk.
- Do not translate technical terms. Prop, function, keyword, type, HTML element and CSS feature names stay in English (`children`, `ref`, `disabled`, `useEffect`, `aria-live`), as do framework concepts a Norwegian developer would say in English anyway (`parent`, `state`, `hook`, `callback`, `default`, `token`, `wrapper`).
- Translate only ordinary words: component → komponent, page → side, button → knapp.
- Inflect around the English term: `props`-ene, `prop`-en, `children`-en. Never `proppene`, and never invent a Norwegian noun for something the code calls something else.
- Prefer a comma or full stop over a dash when joining clauses. When a dash is right, use an en-dash (–), never an em-dash.

If a section is genuinely not applicable (e.g. no screenshots for a tooling change), keep it with the existing N/A note or omit gracefully — don't add noise.

## Step 5: Apply via REST API

**Important:** Do NOT use `gh pr edit --body`. It silently fails due to a GraphQL Projects Classic deprecation error.

Use the REST API instead:

```bash
gh api repos/OWNER/REPO/pulls/PR_NUMBER \
  --method PATCH \
  --field body="..." \
  --jq '.body' 2>&1 | grep -v "GraphQL.*Projects"
```

Pass `owner/repo` from step 1. Verify the key changed lines in the output.

## Step 6: Confirm

Show the user a brief summary of what was changed: which sections were updated and what specifically was corrected (e.g. "Removed GCS upload mention, added PostHog export to Aggregate step, updated Krever oppsett section").
