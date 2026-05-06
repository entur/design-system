# Entur Linje Skills

Skills are instruction sets that give AI coding agents specialized knowledge about the Entur Linje design system. When an agent loads a skill, it knows how to use `@entur/*` components correctly, apply Entur's visual identity, and build accessible products — without you having to explain it each time.

## Available skills

| Skill                   | What it covers                                                                              |
| ----------------------- | ------------------------------------------------------------------------------------------- |
| `entur-linje`           | Entry point — routes the agent to the right sub-skill based on task                         |
| `entur-web-development` | Installing and using `@entur/*` React packages, CSS import order, tokens, component catalog |
| `entur-accessibility`   | WCAG 2.1, universell utforming, keyboard testing, screen readers, Norwegian law compliance  |
| `entur-brand-design`    | Colors, typography, data visualization, visual identity, presentations                      |

Start with `entur-linje`. It reads the task and loads the relevant sub-skill automatically.

## How to use

Most AI coding agents read a project-level instructions file to understand your codebase. The file name varies by tool:

| Agent                                                                                                                             | Instructions file                                |
| --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| [Claude Code](https://docs.anthropic.com/en/docs/claude-code)                                                                     | `CLAUDE.md`                                      |
| [GitHub Copilot](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot) | `AGENTS.md` or `.github/copilot-instructions.md` |
| [Cursor](https://cursor.com)                                                                                                      | `.cursor/rules/*.mdc`                            |
| [Windsurf](https://windsurf.com)                                                                                                  | `.windsurfrules`                                 |

`AGENTS.md` is supported by a [large ecosystem of AI coding agents](https://agents.md).

To give your agent design system knowledge, add this to your project's instructions file:

```markdown
## Design system

When working with Entur components, branding, or accessibility, read and follow:
https://raw.githubusercontent.com/entur/design-system/main/skills/entur-linje/SKILL.md
```

The agent will fetch the skill when it encounters a relevant task — like building UI with `@entur/*` packages, choosing colors, or making something accessible.

### Alternative: use llms.txt

The documentation site publishes two machine-readable files for agents:

| URL                                  | Contents                                             |
| ------------------------------------ | ---------------------------------------------------- |
| https://linje.entur.no/llms.txt      | Structured index of all documentation pages          |
| https://linje.entur.no/llms-full.txt | Full skill content + complete page index in one file |

`llms-full.txt` is the most complete single reference — an agent reading it gets all skill guidance plus links to every page on linje.entur.no. Use it as an alternative or complement to the GitHub skill URL:

```markdown
## Design system

For full Entur design system reference, read:
https://linje.entur.no/llms-full.txt
```

If your agent cannot fetch URLs, copy the contents of the relevant `SKILL.md` files directly into your instructions file instead.

## What the agent gains

With the skill loaded, agents will:

- Install only the `@entur/*` packages needed and get CSS import order right
- Use design tokens (`@entur/tokens`) instead of hardcoded hex values
- Pick the correct component variant from the 30+ available packages
- Follow WCAG 2.1 and Norwegian UU requirements (required by law for Entur products)
- Apply Entur's color palette, typography, and identity rules correctly

## Contributing

Skills live in `skills/<skill-name>/SKILL.md` with supporting reference files in `skills/<skill-name>/references/`.

To improve a skill:

1. Edit the relevant `SKILL.md` or reference file
2. Test by asking your agent the question you want it to answer correctly
3. Submit a PR — changes go live immediately for anyone pointing to `main`

Questions? Find us in `#talk-designsystem` on Slack or open an issue.
