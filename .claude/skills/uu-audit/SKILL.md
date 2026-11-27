---
name: uu-audit
description: Audit the design system packages and linje.entur.no for accessibility (WCAG/universell utforming) issues, test them like real users in the browser, check each finding against existing Jira issues, and draft Jira issues in Norwegian. Use when asked to audit a component, package or the documentation site for accessibility, "uu-audit", "find WCAG issues in X", before a component redesign, or for the periodic accessibility review. With input `jira`, only checks Jira's accessibility issues for missing labels, parent, components, duplicates and statement status.
---

# UU audit

Audit the packages in this repo and linje.entur.no for WCAG and universell utforming (UU) issues. Report only findings that are real, verified and not already in Jira. Never change code unless asked.

This audit supports manual testing; it does not replace it. It finds more than the automated tests, but a model misses things and over-reports, and many criteria can only be settled by a person with a real screen reader, magnifier or voice control. Never present the report as proof of conformance. A criterion it couldn't settle is _Må verifiseres manuelt_ or _Ikke testet_, never passed.

The Jira issues serve two purposes:

- **The accessibility statement for linje.entur.no.** The site uses every component, so every component error is also an error on the site.
- **Telling consumers** which errors their own pages inherit from our components.

Run it once per tertial, and before the yearly update of the accessibility statement, which is due before February. Jira is the source of truth: every UU error has `WCAG-*` labels and the epic ETU-31701 as parent. Consumers read the issues through a Jira filter on the Confluence page «Kjente UU-feil i publiserte pakker» (find it with `search_entur_internal`). Its filter is per package: component `@entur/<pakke>`, any `WCAG-P<n>` label, and status not Ferdig. An issue without the component or a `WCAG-P` label is invisible to consumers. Accessibility in a pull request is covered by the `code-review` skill.

Input: optional package names (`button`, `form`, …), paths or `website`. Default is everything: every package in `packages/` except `utils`, and linje.entur.no. For `tokens`, check the contrast of the colour pairs the docs recommend, in all three modes.

`jira` as input runs only the [Jira health check](#jira-health-check): no code, no browser, a few minutes. Run it monthly or before planning, to keep Jira complete between audits.

## Jira data

Read Jira through Entur Kompass. `list_jira_issues` gives the exact list from a nightly snapshot, with labels and parent on each row; it can't filter on those, so list the team's issues and filter them yourself. Take the Entur Team field and the Designsystem option from `list_jira_fields`; never write IDs into this repo. Read a description with `search_entur_internal` and `get_entur_internal_document`. Kompass only sees issues classified Åpen or Intern, and issues created since the last snapshot are missing; say both in the report. If Kompass refuses or is stale, stop and tell the developer – never guess from a fuzzy search. The skill can't write to Jira; it suggests changes for a person to make.

## Jira links

Give the developer a link for every Jira action in the report, so nothing has to be looked up. The repo is public: find the values below at run time and never write them into files here.

- **Site:** the host in the `url` of any `list_jira_issues` row.
- **An issue:** `https://<site>/browse/<KEY>`. Link every key in the report.
- **Several issues, for one bulk change:** `https://<site>/issues/?jql=` plus the URL-encoded `key in (<KEY>, <KEY>)`. The developer opens it, then ⋯ → Bulk change.
- **A new issue, prefilled:** `https://<site>/secure/CreateIssueDetails!init.jspa?` with `pid` (project id), `issuetype`, `summary`, `description`, `components` (id), `labels` (repeat once per label), and `customfield_<id>=<option id>` for the team. Encode every value with `encodeURIComponent`; line breaks become `%0A`. Parent can't be prefilled; the Jira automation sets it from the WCAG label.
- **Where the IDs come from:** the team field and option from `list_jira_fields`. Project, issue type and component IDs are only in Jira's API: ask the developer before using Chrome, then read `https://<site>/rest/api/3/project/<KEY>` there with a GET – nothing else on that site. Keep them for the session only. If the developer says no, give the plain create link `https://<site>/secure/CreateIssueDetails!init.jspa` and the fields as text.

Opening a link never changes Jira. Never submit a form or change an issue or a setting yourself.

## Standard

- Target: **WCAG 2.2 AA** (`apps/documentation/src/pages/universell-utforming/index.mdx`).
- Legal minimum: WCAG 2.1 A and AA, through _Forskrift om universell utforming av IKT_. Only the media criteria (1.2.x) may be exempt, and they don't apply here.
- Grade each finding: **Lovkrav** (a 2.1 A/AA criterion), **WCAG 2.2** (one of the six A/AA criteria new in 2.2: 2.4.11, 2.5.7, 2.5.8, 3.2.6, 3.3.7, 3.3.8), **Anbefaling** (AAA or best practice, such as reduced motion or forced-colors support).

## What to audit against

Read these first; they override general knowledge:

- [references/criteria.md](references/criteria.md): one row per 2.2 A/AA criterion with scope, the evidence that settles it, the pass condition, and whether it needs manual testing. This is the rubric; every finding maps to a row.
- [skills/entur-accessibility/SKILL.md](../../../skills/entur-accessibility/SKILL.md) and its `references/`
- [.github/skills/code-review/SKILL.md](../../../.github/skills/code-review/SKILL.md), section "Accessibility"
- [.github/instructions/scss.instructions.md](../../../.github/instructions/scss.instructions.md) and [tests.instructions.md](../../../.github/instructions/tests.instructions.md)
- [doc/accessibility-review-notes.adoc](../../../doc/accessibility-review-notes.adoc): what earlier reviews got wrong. Don't report a finding it lists as not an error.
- [AGENTS.md](../../../AGENTS.md) and the ADRs in [doc/adr/](../../../doc/adr/README.adoc): code that follows a recorded decision is not a finding.

Entur rules that lead to findings in code. Each is a lead until the browser confirms it:

1. **Focus:** `outline: none`/`0` needs a `:focus-visible` replacement. A focus style made only of `box-shadow` or `background` needs a `@media (forced-colors: active)` fallback.
2. **Units:** `rem` not `px`, except hairlines.
3. **Motion:** animations and transitions have a `prefers-reduced-motion` fallback (Anbefaling, 2.3.3 is AAA; 2.2.2 if it starts automatically and lasts over 5 s).
4. **Colour:** only `@entur/tokens`, never tokens from opposite contexts; works in light, dark (`data-color-mode="dark"`) and contrast (`.eds-contrast`).
5. **ARIA:** no ARIA is better than wrong ARIA. Flag ARIA that duplicates native semantics, empty or generic English `aria-label`s, stray `tabindex`, roles without their keyboard behaviour, `aria-*` pointing at missing ids.
6. **States:** `readOnly` controls stay focusable; disabled and readOnly content stays in the accessibility tree.
7. **Forms:** visible `label`; errors use `variant="negative"` with `feedback`; feedback text stands alone.
8. **Native first:** prefer `<dialog>`, `popover`, `inert`; flag a reintroduced JS focus trap.
9. **Tests:** each component and interactive variant has a `jest-axe` assertion; focus and keyboard behaviour is covered in `tests/browser/*.browser.ts`. A missing test is a Task, not a WCAG error.

## Steps

1. **Calibrate.** Read the review notes above. Ask now whether you may use Chrome to read the Jira IDs for prefilled links (see [Jira links](#jira-links)), so the links are ready when you report. List the team's issues once (see [Jira data](#jira-data)) and keep the list for steps 8 and 9. Read a few recent issues under ETU-31701, and find at least one closed as "Won't do" with `search_entur_internal`. Match their level of detail and judgement.
2. **Rank by usage.** With the [scanner-data](../scanner-data/SKILL.md) skill, count repos per component in the latest scan. Use the count to set priority (see Report). If PostHog is unavailable, say so and rank interactive components first.
3. **Fan out.** Run one subagent per package, in parallel, with steps 4 and 5 and the rules above. Each returns a list of leads, one per line, in this shape and nothing else:
   `komponent | kriterium | file:line | hva brukeren opplever | hva nettleseren må bekrefte`
   The browser check runs once in the main agent, after all subagents have returned.
4. **Collect leads.** Run `yarn oxlint packages/<name>/` and grep the package for `outline`, `px`, hex/`rgb(`, `transition`/`animation`, `tabindex`, `aria-`. Then read every component and its SCSS and reason about keyboard, focus, names, roles and states. Re-open each lead at its exact `file:line`; drop anything you can't point to.
5. **Known in code.** A `test.failing` or `FIXME` (oxlint bans `TODO`) describing the problem means it's known; still check Jira, but don't present it as new.
6. **Verify in the browser.** Run the [browser checks](#browser-checks): the core set on every component, the rest where the rubric or a lead calls for it. A finding needs an observation of the kind the rubric lists for its criterion – a measurement, an axe result, an interaction trace or the accessibility tree – recorded in the finding. Code reading alone confirms nothing. Drop leads the browser disproves, and add what it finds.
   What the observation can't settle, and every Manuell criterion without an M, I or T observation, is _Må verifiseres manuelt_: say what to test and with what (VoiceOver with Safari, NVDA with Firefox, zoom, voice control). Draft no issue for it until a person confirms it; see [Manual testing](#manual-testing).
7. **Try to disprove.** Give the findings, with their evidence, to one fresh subagent that has not seen the reasoning behind them. Its task is to argue each one is not a failure, and to check each criterion's number, level, exceptions and grade against its Understanding page (from the [WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/)). Fix a wrong label. Drop a finding it disproves, unless users still meet a real barrier: then keep it under the closest criterion (see Labels). If it raises a doubt it can't settle, move the finding to _Må verifiseres manuelt_.
8. **Check Jira.** For each finding, look in the list from step 1 for issues with the same component and `WCAG-<x.y.z>` label, then compare titles. Look in all the team's issues, not only ETU-31701: some UU issues sit elsewhere. Then search with `search_entur_internal`, e.g. `"ETU <component> <problem in Norwegian> WCAG <criterion>"`, in Norwegian and English, for issues without labels or in other teams. Classify the finding:
   - **Ny** – no matching issue.
   - **Finnes** – an issue covers it: give its key and status. If the issue is closed as done but the code still has the problem, say so.
   - **Avvist** – an issue covers it and is closed as "Won't do" (see [Won't do](#wont-do)): leave it out of the report, only count it.
   - **Utvid** – an issue covers part of it: give its key and what to add.
9. **Re-check open issues.** From the list in step 1, take the open issues with `WCAG-*` labels for the audited packages. Check in the browser whether each still shows the problem; report the ones that are gone as _Kan lukkes_. Then run the [Jira health check](#jira-health-check).

10. **Report** in the format below, then copy the Jira drafts and the Jira changes to the clipboard with `pbcopy`.

## Jira health check

Keeps Jira complete and correct, so the consumers' list and the accessibility statement are right. Runs in step 9 of the audit, and alone with input `jira`. Use the team's issue list (see [Jira data](#jira-data)); suggest changes, never claim they are made.

1. **Labels and placement.** A Jira automation adds the `WCAG-P<n>` label and sets parent ETU-31701 when an issue's labels change, so these gaps only remain on issues untouched since it started. For every issue with `WCAG-*` labels:
   - parent is not ETU-31701 – an empty parent or a missing `WCAG-P<n>` on a recently changed issue means the automation has stopped; say so first;
   - an error in a package without its `@entur/<pakke>` component; suggest one. Errors in linje.entur.no itself need no component;
   - a `WCAG-<x.y.z>` without its `WCAG-P<n>`, or the reverse; fixed by removing and re-adding the criterion label in two saves;
   - a label that is not a WCAG 2.1 or 2.2 A/AA criterion. 4.1.1 Parsing is gone from 2.2 but still law through 2.1, so keep it; add another criterion only if the barrier also breaks it;
   - type Task for a user-facing error; it should be Bug.
2. **UU issues without labels.** Take the open issues without `WCAG-*` labels that have a `UU` or `a11y` label, or words like skjermleser, tastatur, fokus, kontrast, zoom, Esc, label, aria, klikkflate, fargeblind or «lese opp» in the title. Read each description. If an end user meets a barrier, suggest criteria labels, type Bug, parent ETU-31701 and a component. A feature request or an improvement beyond AA gets a note, no labels. Also search other teams' issues with `search_entur_internal` for UU problems in `@entur/*` components, and suggest moving or copying them to ETU.
3. **Duplicates.** Issues with the same component and criterion and a similar title. Include closed ones: a new issue may repeat a fixed one.
4. **Review queue.** For each open issue in a review or test status, find merged pull requests with its key (Kompass `search_prs`). One merged means it can probably be closed after a check; say which PR.
5. **Statement status.** `i-tilgjengelighetserklæring` means the issue is in our published accessibility statement; `fjernet` means it was fixed and taken out again. Count open Lovkrav issues without the first (_Ikke i erklæringen ennå_), and closed issues with the first but not `fjernet` (_Fjern fra erklæringen_). The statement is updated once a year, before February, so these grow between updates; they are input to the next update, not errors.

**Output: Jira-endringer.** Group the suggestions by change, so each group is one Jira bulk change, with a bulk link per group and an issue link per key (see [Jira links](#jira-links)). Give the reason in a few words per issue, mark judgement calls with «(vurder)», and leave the statement counts out unless asked:

```
Sett forelder ETU-31701: ETU-80804, ETU-76910 (vurder)
Legg til WCAG-P2: ETU-78065
Sett komponent @entur/form: ETU-44625 (vurder)
Endre type til Bug: ETU-80804
Mulig duplikat: ETU-78212 ↔ ETU-78065
Kan trolig lukkes (PR flettet): ETU-78204 (PR 123)
```

## Statement update

In the audit before February, also prepare the yearly update of the accessibility statement:

- **Legg til** and **Fjern**: the two lists from step 5 of the health check, with key and title.
- **Tekst per kriterium:** for each criterion with open Lovkrav issues, a short summary in Bokmål for the statement draft – what fails, for whom, and any accessible alternative.
- **Etiketter etterpå:** the label changes to make once the statement is published.

## Browser checks

Test like real users, as far as a browser can emulate them.

**Setup.** Run `yarn build:packages` once. Add temporary pages to `tests/browser/fixture/` and `uu-audit-*.browser.ts` specs, run them with `yarn test:browser <spec>`. Fixture pages use `lang="nb"`. Delete them afterwards; never commit them. If a tool fails or returns no result, stop and report it – a failed check is never a clean one.

**What to render.** The props consumers actually use, not only defaults: take the most common prop values per component from scanner-data (`repo_prop_values`), plus every variant, size and state (disabled, readOnly, error, loading). Use realistic Norwegian content, including long text.

**Keep the run feasible.** Every component gets the **core set**, in Chromium: axe in the three modes, a Tab-through with the focus sequence, 320 px reflow, 200 % text, target size and reduced motion. Then, only where needed:

- **Firefox and WebKit** (VoiceOver users are on Safari): confirm keyboard and accessibility-tree findings, and run the keyboard scenario on composite widgets (dropdowns, datepicker, menus, tabs, modals).
- **Mobile** (`devices['iPhone 15']`, both orientations, 1.3.4): in WebKit only, since Firefox doesn't support mobile emulation.
- **Colour vision emulation:** components that show state with colour.
- **Every variant, size and state:** for scenarios a variant changes, such as contrast and target size. Other scenarios use the default and the most common props.

If the run still can't finish, audit fewer packages per session and say which are left in the report – never skip checks silently.

**Scenarios:**

- **Automated rules:** axe – inject the latest `axe-core` from a scratch install outside the repo, not the repo's own copy, which is too old and reports false combobox errors – in light, dark and contrast mode. Axe catches a minority of issues; a clean run proves little.
- **Keyboard-only user:** reach every control with Tab and Shift+Tab, operate it with Enter, Space, arrows and Escape, as its role expects. Record the focus sequence. Check focus order, a visible focus indicator (compare computed styles focused and unfocused), no keyboard trap, focus returned after close, focus not hidden behind sticky content (2.4.11).
- **Screen reader user:** compare the accessibility tree (`locator.ariaSnapshot()`) with what the user should hear – role, name, state, description. Where the tree can't show what is spoken, run [`@guidepup/virtual-screen-reader`](https://www.npmjs.com/package/@guidepup/virtual-screen-reader) from a scratch install outside the repo (it is not a dependency) through the interaction and record what it speaks. Watch live regions with a `MutationObserver` to see what is announced on errors and updates.
- **Low vision:** 400 % zoom (320 CSS px wide) without horizontal scroll, 200 % text size, text spacing override (1.4.12), computed contrast of text and UI against the real background, `forced-colors: active`, `prefers-contrast: more`.
- **Colour vision deficiency:** in Chromium, emulate deuteranopia, protanopia and achromatopsia with CDP `Emulation.setEmulatedVisionDeficiency`, and check that each state is still distinguishable.
- **Motion sensitivity:** `prefers-reduced-motion: reduce` stops or shortens every animation and transition.
- **Motor and touch:** target size from bounding boxes (2.5.8), a single-pointer alternative to dragging (2.5.7), no hover-only content, hover and focus content that can be dismissed with Escape and hovered (1.4.13).

**linje.entur.no.** Run the same scenarios against the live site, which is what users meet. Cover one page of each template (front page, component page, guide, search, navigation menu on mobile) and the examples and props tables on each component page. Also check the site's own landmarks, headings, skip link, page titles, language (`lang`), link texts and images. Read `apps/documentation` code only to find the cause of what the browser shows.

**Real screen reader, if available.** If VoiceOver has been set up for automation with [Guidepup](https://www.guidepup.dev) on this machine, use it for the screen reader scenarios. Never change system settings yourself; if it isn't set up, say so once in the report. The virtual screen reader follows the specs, not a real screen reader's quirks.

## Manual testing

Make every _Må verifiseres manuelt_ finding quick to confirm:

1. Put one scenario per finding in `apps/code-playground/src/TestBench.tsx`, following the TestBench workflow in [AGENTS.md](../../../AGENTS.md). Each scenario has a heading naming the finding and a short instruction, e.g. «Tab til feltet og hør om feilmeldingen leses opp». If the file already has content, ask before replacing it.
2. Start the playground and give the developer the preview URL, so they can test each scenario right away with the screen reader and browser named in the plan.
3. Draft one Jira Task for the audit: «Manuell UU-testing T<n> <år>», Forelder ETU-31701, no `WCAG-*` labels. The description is the test plan, one line per finding with component, what to do and with what. TestBench is not committed, so the Task describes each scenario in words.

A confirmed finding becomes a normal Jira draft; a disproved one is crossed out in the Task.

## Report

Write it in Bokmål for the developer who acts on it. They should know their next step without reading further, so lead with actions and put the evidence below.

1. **One line:** the report supports manual testing and is not a conformance statement.
2. **Oppsummert:** one line with the counts – new findings by priority, known issues, findings for manual testing, issues to close.
3. **Neste steg:** a numbered checklist in the order to do it. Each item is one action with its link (see [Jira links](#jira-links)) and nothing else. Leave out steps with nothing to do:
   1. Opprett Jira-saker – one line per new finding: priority, title, prefilled create link. Say that the drafts are also on the clipboard.
   2. Test manuelt – the TestBench link, then one line per scenario with what to do and with which screen reader and browser.
   3. Lukk eller oppdater saker – one line per issue with its link and the reason, such as «PR 580 flettet».
   4. Rydd i Jira – one bulk link per group from Jira-endringer.
   5. Gå gjennom funnene – reply here with which findings were wrong, so they go into the review notes.
   6. Anything left in the working tree: «TestBench.tsx er endret – ikke commit den».
4. **Funn:** sorted by priority, then by usage from step 2; a component no repo uses drops one level.

   - **Høy:** Lovkrav failure in a widely used interactive component, a keyboard trap, or a control without a name.
   - **Middels:** WCAG 2.2-only failure, contrast in one variant.
   - **Lav:** Anbefaling, missing test, docs examples.

   Per finding: priority, title, WCAG criterion and grade, `file:line`, the evidence (measurement, axe rule, key sequence or spoken output), the user impact in one sentence, the fix in one sentence, and the Jira status (Ny / Finnes ETU-… / Utvid ETU-…) with its link.

5. **Forkastet:** leads the disproving step dropped, one line each with the reason.
6. **Dekning:** per package, a matrix of the rubric's criteria with one status each: _Brudd_, _Ingen funn_, _Betinget_, _Må verifiseres manuelt_, _Ikke relevant_, _Ikke testet_. _Ingen funn_ means this audit found nothing, not that the criterion passes.
7. **Erklæring:** the [statement update](#statement-update), only in the audit before February.
8. **Grunnlag:** last – the Kompass snapshot date, usage data, browsers and screen readers that ran or failed, and problems with the skill itself. Counts for _Avvist_ (closed as "Won't do") and, once the developer has gone through the drafts, _Treffsikkerhet_ (accepted, rejected, corrected).

When the developer rejects or corrects a finding, add a line to the review notes with the component, what was wrong and why, and commit it on its own branch.

## Won't do

When an existing issue won't be fixed, handle it by kind:

- **Not a real error** – it doesn't break the criterion, or the code follows a recorded decision. Close the issue as "Won't do" with the reason. It drops off the consumers' list, which is right.
- **A real error we won't fix now** – for example too costly, or caused by a browser. Keep the issue open with the reason in it. Consumers still have the error and must list it in their own statement, and the law only accepts a known error with a reason, not a hidden one.

If the reason is a design system decision someone could later undo by "fixing" it, suggest recording it with `/grill-with-adr`, or as a line in AGENTS.md if it is a short rule.

## Jira drafts

Only for **Ny** findings. Our accessibility statement is built from these issues, so each issue is one problem, described as the error the end user meets – not the fix. Put a prefilled create link (see [Jira links](#jira-links)) above each draft; the text stays below it for checking and as a fallback.

- **One issue per problem per component.** A user-facing error in three components is three issues. A component error that also shows on linje.entur.no is one issue, on the component, not a second one for the site. Errors in the site itself (navigation, content, page structure) get no component. Only findings no end user sees, such as a missing jest-axe test, may be grouped into one issue across packages.
- **Title** says what is broken, as the user experiences it: «Feilmelding i TextField leses ikke opp av skjermleser», not «Få skjermleseren til å lese opp feilmeldingen».
- **Description** has only **Problemet** (what the user experiences, who is affected, a concrete example of where) and **Kontekst** (the broken criteria by number and Norwegian name, where in the code, how it was found). No solution, no acceptance criteria.
- Plain Bokmål with en-dash (–). No implementation jargon (DOM, portal, ancestor, refs); describe the visible symptom. Keep component and package names exact.
- **Labels:** two per broken criterion – `WCAG-P<n>` (the principle, the first digit: 1 Mulig å oppfatte, 2 Mulig å betjene, 3 Forståelig, 4 Robust) and `WCAG-<x.y.z>`. Never add `i-tilgjengelighetserklæring`: a person adds it once the issue is in the published accessibility statement. A barrier users meet, such as a screen reader or voice control problem, gets the closest criterion even when the link is loose, so it reaches the consumers' list. Only issues with no link to any criterion – a missing test, a code quality issue – get no `WCAG-*` labels, and stay separate issues.

```
Tittel: <hva som er feil for brukeren>
Type: Bug (WCAG-brudd) | Task (manglende test, ikke synlig for brukeren)
Komponent: @entur/<pakke> (tom for feil i selve linje.entur.no)
Etiketter: WCAG-P<n> WCAG-<x.y.z>
Team: Designsystem
Forelder: ETU-31701
Klassifisering: Åpen

Problemet
<hva brukeren opplever, hvem rammes, et konkret eksempel>

Kontekst
Bryter WCAG <x.y.z> <norsk navn> (<Lovkrav | WCAG 2.2>).
Hvor: packages/<…>:<linje>
Funnet med: <måling, axe-regel, tastesekvens eller skjermlesertest>
```

The fix stays in the report for the maintainer, not in the issue. Klassifisering Åpen keeps the issue visible to Kompass, so the next audit finds it.

The repo is public: keep consumer repo and team names out of anything that ends up in the repo or a PR.
