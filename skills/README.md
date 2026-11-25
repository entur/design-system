# Entur Linje Skills

Skills are instruction sets that give AI coding agents specialized knowledge about the Entur Linje design system. When an agent loads a skill, it knows how to use `@entur/*` components correctly, apply Entur's visual identity, and build accessible products — without you having to explain it each time.

## Available skills

| Skill                   | What it covers                                                                              |
| ----------------------- | ------------------------------------------------------------------------------------------- |
| `entur-linje`           | Entry point — routes the agent to the right sub-skill based on task                         |
| `entur-web-development` | Installing and using `@entur/*` React packages, CSS import order, tokens, component catalog |
| `entur-accessibility`   | WCAG 2.1, universell utforming, keyboard testing, screen readers, Norwegian law compliance  |
| `entur-brand-design`    | Colors, typography, data visualization, visual identity, presentations                      |
| `migrate-react-18`      | Step-by-step migration for projects upgrading @entur/\* packages to React 18 major versions |
| `migrate-typography`    | Step-by-step migration to the new typography and the layout beta spacing scale              |

Start with `entur-linje`. It reads the task and loads the relevant sub-skill automatically. The migration skills change a lot of code, so you start them yourself, for example `/entur-linje:migrate-typography`.

## How to use

The skills are supported in [Claude Code](https://docs.anthropic.com/en/docs/claude-code), installed as a plugin from Entur's marketplace in [entur/ai](https://github.com/entur/ai):

```
/plugin marketplace add entur/ai
/plugin install entur-linje@entur
```

This installs all six skills with their reference files on disk. The marketplace pins the plugin to a reviewed commit in this repo, so a new version reaches you when entur/ai moves that pin. Run `/plugin update` to get it.

The skills only read their own files from the installed plugin. Pointing an agent at a skill on GitHub or linje.entur.no is not supported.

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
2. Run `yarn verify:skills` — it typechecks every code example against the real `@entur/*` types and checks that referenced exports and tokens exist
3. Test by asking your agent the question you want it to answer correctly
4. Submit a PR
5. After it is merged, open a PR in [entur/ai](https://github.com/entur/ai) that moves the `sha` for `entur-linje` in `.claude-plugin/marketplace.json` to the merge commit. Until then, users don't get the change. A bot comment on your PR reminds you.

Questions? Find us in `#talk-designsystem` on Slack or open an issue.
