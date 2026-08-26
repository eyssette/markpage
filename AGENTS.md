---
description: "General Rules to Follow : coding, tests, build, lint, i18n, docs, release notes, and commit conventions."
name: "Developer Guidelines"
---

# Developer Guidelines

## Stack and runtime

- Use Node.js 22+ for local work, build, and CI compatibility.
- Use npm as package manager.
- Keep source code in `app/js` and `app/css`.
- Entry point: `app/js/main.mjs` (imports other JS modules and main CSS).

## Project structure

- `app` : application source code
- `dist` : generated build output (never edit by hand)
- `features` : Gherkin scenarios for e2e tests
- `i18n/messages` : translation files (ParaGlideJS)
- `scripts` : automation scripts backing Taskfile tasks
- `tests/unit` : unit tests (Jasmine)
- `tests/e2e/step_definitions` : e2e step implementations (CodeceptJS)

## Working style

- Actively interact with the user to clearly understand their needs and ensure they validate your suggestions before implementation.
- If a request is ambiguous or has multiple valid interpretations, state your assumption or ask — don't pick silently.
- Write the minimum code that solves the problem: no speculative features, abstractions, or configurability that wasn't asked for.
- When editing existing code, touch only what the task requires. Don't reformat, refactor, or "improve" adjacent code — Oxfmt/Oxlint already handle style on save. Remove only the imports/variables your own change made unused; leave pre-existing dead code, just mention it.
- Use the tasks already defined in `Taskfile.yml` (via `npx task <name>`) as much as possible.
- If needed, use the SKILLS defined in `.agents/skills/` to guide your actions.

## Commands to prefer

Always use `npx task <name>` (do not assume `task` is installed globally).

- Install dependencies: `npm install`
- Dev server (watch mode): `npx task dev`
- Build: `npx task build`
- Full test suite: `npx task tests`
- Unit tests only: `npx task tests:unit`
- E2E tests only: `npx task tests:e2e`
- E2E tests tagged @CURRENT only (fast iteration on one scenario): `npx task tests:e2e:current`
- Lint (blocking errors only): `npx task lint`
- Lint (all issues, including warnings): `npx task lint:all`
- HTML validation: `npx task html-validate`
- Check ECMAScript compatibility of source: `npx task ecma:source`
- Check ECMAScript compatibility of build output: `npx task ecma:dist`
- Unit test coverage report: `npx task coverage`
- Review a file : `npx task review:file -- <file_path>`

⚠️ If `task <name>` fails with "command not found" or similar, check `Taskfile.yml` for the exact task name before assuming a different command — do not invent substitute commands.

## Commands requiring explicit user approval — never run autonomously

- `npx task push` — pushes to **multiple configured Git remotes**, and requires passing lint/tests first.
- `npx task bump` — bumps the project version, creates a Git tag, rewrites `CHANGELOG.md`, `VERSION`, `package.json`.
- `git push`, `git commit --no-verify`, or anything bypassing Husky hooks.

Only run these if the user explicitly asks for them in this exact turn, with an explicit WARNING that they are about to run a command that will push to remotes or change the version.

## Commands that may be unavailable in this environment

These require external tools not installed via npm (semgrep, bearer, trivy, lighthouse, pngquant/jpegoptim/svgo). Attempt only if the user asks, and report clearly if the underlying tool is missing rather than retrying or masking the error:

- `npx task security`, `npx task security:semgrep`, `npx task security:bearer`, `npx task security:trivy`
- `npx task perf`, `npx task perf:desktop`, `npx task perf:mobile`
- `npx task images:compress`
- `npx task a11y`

## Skills and knowledge to have

Skills are defined in `.agents/skills/` folder.

Structure: `.agents/skills/<skill>/SKILL.md` where `<skill>` is the name of the skill and the name of the command that uses it.

For example, the skill for fixing a bug is in `.agents/skills/fix-this/SKILL.md` and is used by the `/fix-this` command.

SKILLS you should know about:
- `code`: write code following the project's conventions
- `css`: write or check CSS code
- `design-md`: write or improve a DESIGN.md file that defines the application's design
- `documentation`: write documentation
- `e2e-test`: write E2E test
- `fix-this`: fix a bug
- `optimize-this`: optimize code
- `refactor-this`: refactor code
- `release-draft`: write a release draft
- `review-this`: review code
- `roadmap`: suggest a roadmap (features, improvements, refactors, etc.)
- `think-and-plan`: help the user clarify their vision and plan for a new application or feature
- `unit-test`: write unit test

Before running one of these commands, read the corresponding skill file if it exists. If no skill file exists yet, fall back to the general rules in this document.


## Code quality expectations

- Write modular JavaScript with explicit imports/exports.
- Keep functions small, testable, and low in cognitive complexity.
- Maintain compatibility with the project's ECMAScript target (see `ECMA_VERSION` in `rolldown.config.mjs`, `Taskfile.yml`, and `oxlint.config.mjs`).
- If you encounter a lint rule (inline, per-file, or globally in `oxlint.config.mjs`) :
  - Do not disable it.
  - If it's an ERROR rule, fix the underlying code
  - If it's a WARNING rule, consider whether the code can be improved to satisfy the rule : if not, ask the user whether they want to disable it.
  - In all cases, explain to the user what you are doing and why.
- `npx task lint` covers JS (Oxlint), CSS (Stylelint), and HTML (HTML-Validate) together; use `npx task lint:all` to also see non-blocking warnings before considering a task complete.

## Svelte Components

To manage increasing complexity, especially when advanced reactivity or complex state management is required, the application supports the integration of Svelte components. 

Implementation Guidelines:
- Naming convention:
  - Use PascalCase for component names (e.g., `ComponentName.svelte`).
  - Define the custom element name in `kebab-case` using `<svelte:options customElement="component-name" />`.
- Use Svelte 5 syntax: leverage `$props` to define component properties, `$state`, `$derived`, `$effect` to manage fine-grained reactivity efficiently,`$host` to access the host element (e.g., for event dispatching).

## Internationalization

- Use ParaGlideJS for user-facing text — never hardcode user-facing strings.
- Add or update translations in `i18n/messages`.

## Testing and validation

- Do not add a function without warning the user that it will require unit tests and/or E2E scenarios.
- Do not change unit tests or E2E scenarios just to make them pass — they must reflect the actual behavior of the code.
- For bug fixes, write a test that reproduces the bug before fixing it, then confirm it passes.
- Add or update unit tests for logic changes in `tests/unit`.
- Add or update E2E scenarios in `features` : write Gherkin scenarios for new or changed behaviors. Keep scenarios clear, concise, and user-oriented. Use the style of existing scenarios as a reference.
- Add or update step definitions in `tests/e2e/step_definitions` when behavior changes.
- Before considering a change finished, run in this order:
  1. `npx task lint:all`
  2. `npx task tests:unit`
  3. `npx task ecma:source` if you touched syntax that might not be supported
- When iterating on a single e2e scenario, tag it `@CURRENT` and use
  `npx task tests:e2e:current` instead of the full e2e suite.

## Commit and changelog conventions

- Follow Conventional Commits.
- For `feat` and `fix`, a scope is required.
- Use clear, user-oriented wording in commit messages and changelog entries.
- Husky hooks automatically re-check commit message format, lint, and formatting on commit — do not bypass them with `--no-verify`. If a hook fails, fix the reported issue rather than working around the hook.

## Documentation changes

- Keep README, task names, and examples aligned with actual commands in `Taskfile.yml`.
- Prefer concise French documentation style used in this repository.

## Language

- Use French when communicating with the user, unless the user is talking in an other language.
- Use English for code (functions, variables, classes, etc.).
- Use French for comments and documentation, unless the user asked for another language.
- Use French for commit messages and changelog entries, unless the user asked for another language.
- Style : be concise, don't be verbose.