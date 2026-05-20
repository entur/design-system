# Commit

Create a conventional commit following this repository's exact conventions.

## Step 1: Read conventions

Read `AGENTS.md` in the repo root. The "Commit Conventions" and "AI Attribution" sections are the source of truth. Rules may change — always read fresh, never rely on cached knowledge.

## Step 2: Gather context

Run these in parallel:

1. `git status` — see all changed/untracked files (never use `-uall`)
2. `git diff` and `git diff --staged` — see what changed
3. `git log --oneline -5` — see recent commit style for reference

## Step 3: Draft commit message

Analyze the changes and craft a message following AGENTS.md conventions exactly. Key principles:

- **Format:** `type(scope): short description`
- **Type selection:** `fix` and `feat` are ONLY for consumer-facing changes inside `packages/` or `skills/`. Everything else uses `chore`, `refactor`, `test`, `docs`, etc. When in doubt, use `chore`.
- **Scope:** `package/component` in lowercase. Check AGENTS.md for the full scope rules (beta components, repo-wide, docs site, GHA workflows, skills, etc.).
- **Description:** imperative form ("add X", not "added X"). For `feat`/`fix`, write consumer-focused descriptions — what it means for users of the design system, not internal implementation details.
- **AI attribution:** Follow the rules in AGENTS.md for when and how to add AI attribution trailers. The format and rules for when to include them live there — do not hardcode assumptions.

## Step 4: Stage and commit

- Stage specific files by name. Never use `git add -A` or `git add .`.
- Do not stage files that look like secrets (`.env`, credentials, tokens).
- Pass the commit message via HEREDOC for correct formatting:

```bash
git commit -m "$(cat <<'EOF'
type(scope): description

optional body

optional trailers
EOF
)"
```

## Step 5: Verify

Run `git status` after committing to confirm success. If a pre-commit hook fails, diagnose the issue, fix it, re-stage, and create a NEW commit (never amend).

## Important

- Do NOT push unless explicitly asked.
- If there are no changes to commit, say so and stop.
- If the scope or type is ambiguous, explain your reasoning briefly.
