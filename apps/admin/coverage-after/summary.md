Post-change coverage snapshot (all tests including new additions)

- covered_lines_absolute: 212
- covered_lines_relative: 0.3825%
- branch_coverage_relative: 17.69%
- function_coverage_relative: 12.16%
- total_lines: 55,432

What changed
- Added unit tests for storage utils, text helpers, pub/sub service, CRUD wrapper, meta-crud builder, asset upload composition, and markdown conversion, lifting covered lines by +192.
- Services now exercised through mocked API clients; pub/sub async and once semantics validated; markdown rendering confirmed.

Outstanding issues
- The lint-style unused-imports test still flags unused imports in several Vue files (same list as baseline).
- Majority of Vue components and services remain unexecuted by tests; overall coverage is still very low.

Advice and next steps
- Fix the unused imports identified by `unused-imports.test.ts` to remove recurring warnings.
- Prioritize tests for high-impact services and composables (API client, authentication flows, routing guards, integrations data flows) to materially improve coverage.
- Consider component-level tests with shallow rendering/mocked dependencies for critical UI flows (login, asset management, plugins) to raise meaningful line coverage.
