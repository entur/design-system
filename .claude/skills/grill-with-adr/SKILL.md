---
name: grill-with-adr
description: Interview the user one question at a time to stress-test a plan or design, and record what gets decided as ADRs in doc/adr/ and terms in doc/glossary.adoc. Use before a decision that spans packages, sets or changes a code pattern, changes the public API, or is hard to reverse, and when work touches code an existing ADR covers.
---

# Grill with ADR

Stress-test a plan until we agree on it, and write down what we decide while we go.

## Before the first question

1. Read [doc/adr/README.adoc](../../../doc/adr/README.adoc) and every ADR whose **Applies to** matches the plan. Note any the plan would contradict.
2. Read [doc/glossary.adoc](../../../doc/glossary.adoc), and use its terms in the questions.

## Grilling

- Ask one question at a time. Start with the decision the others depend on.
- Give your recommended answer with each question, with the reason.
- If the code, the git history or the scanner data can answer it, look it up instead of asking.
- When the user asks a question back, answer it fully, then continue.
- Stop when every branch of the plan is decided or explicitly left open.

## Writing the docs

Write as each decision is settled, not at the end.

- **New ADR** when a decision is hard to reverse, would surprise someone without the context, or picks between real alternatives. Follow the template in [doc/adr/README.adoc](../../../doc/adr/README.adoc), take the next number, and add it to the index there.
- **Changed decision**: never rewrite the decision in an accepted ADR. Write a new ADR, set the old one's status to `Deprecated`, with a line saying which ADR replaces it, and update both in the index.
- **Still true, more detail**: small clarifications to an accepted ADR, such as a retirement trigger or a link, are fine. Keep the decision itself unchanged.
- **Glossary**: add a term when the conversation needed it defined, or when code, commits or ADRs use it with a specific meaning here.
- **AGENTS.md**: if the decision sets a convention, add one short line that states the rule and links the ADR. The reasoning stays in the ADR.
- An ADR for work in a later PR goes in that PR, not this one.
- The repo is public. Follow "This repo is public" in [doc/adr/README.adoc](../../../doc/adr/README.adoc): no consumer or people names, no internal links, no security details.

Write in English, like the rest of the internal docs. Keep ADRs short: a page at most.

## Finishing

Summarise the decisions in a table: decision, result, where it is recorded. Then list the files written and which commit or PR they belong to.
