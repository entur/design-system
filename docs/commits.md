# Commit Conventions

Uses conventional-commits enforced by Commitizen + commitlint (Husky lints on push).

`yarn gc:format` is the standard way to commit (interactive Commitizen prompt). AI agents that cannot use interactive input should manually craft commit messages following this format:

```
type(scope): short description in imperative form

optional longer description

optional breaking changes
```

- **type**: `fix`, `feat`, `chore`, `docs`, `refactor`, etc. Drives version bumps: `fix` → patch, `feat` → minor, `BREAKING CHANGE` → major. `fix` and `feat` are ONLY for code that affects consumers (i.e. within `packages/` or `skills/`). Use `test`, `refactor`, `chore`, etc. for non-consumer-facing changes.
- **scope**: `package/component` format in lowercase. For components inside a `beta/` directory, use `package/beta/component` (e.g. `layout/beta/sidebar`). Single component: `travel/travel tag`. Beta component: `layout/beta/sidebar`. Entire package: `travel`. Entire repo: `root`. Documentation site: `website`. Skills: `skills`. Multiple: `travel/travel tag, travel/travel header`.
- **short description**: one sentence, imperative form (e.g. "add new variant", not "added new variant").
- **Descriptions for `feat` and `fix`**: These end up in the changelog and are read by consumers. Keep them **consumer-focused** — explain what the change means for them and how to use it. Avoid internal technical details.

Branch naming: start with Jira issue ID, e.g. `ETU-38373-branch-name`.

## AI Attribution

Do NOT use `Co-authored-by` trailers for AI tools — reserved for human collaborators.

When the majority of a commit's changes were produced by an AI tool, add:

```
AI-assistant: <tool> (<model>)
```

No trailer needed for minor AI assistance.
