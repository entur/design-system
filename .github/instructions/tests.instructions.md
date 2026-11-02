---
applyTo: '**/*.test.{ts,tsx},tests/**'
---

# Reviewing tests

Follow AGENTS.md "Testing Conventions". In review, flag:

- Deleted class or `className` assertions. The class is the contract between
  props and styling, so they are not cosmetic.
- Removed regression tests, and bug fixes without a test that fails on the old
  code.
- `test.skip` on a known bug instead of `test.failing` with a Jira link.
- Tests that cannot fail: no assertion, an assertion that only reads back a
  prop the test passed in, or a mock that replaces the behavior under test.
- Queries on a library's internal ids or markup instead of role, label or text.
- A new component or interactive variant without a `jest-axe` assertion.
- New checks that do not run in CI.
