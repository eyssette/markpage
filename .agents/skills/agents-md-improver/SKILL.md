---
description: Review and improve an existing AGENTS.md file, using project evidence and general instruction-writing principles. Use when asked to audit, refine, reorganize, shorten, or strengthen agent guidance.
name: agents-md-improver
argument-hint: "<path-to-agents-md>"
---

# Improve an `AGENTS.md`

## Purpose

Make agent instructions more accurate, actionable, consistent, discoverable, and proportionate to the project. Optimize for better agent decisions and reliable execution.

Treat the repository's actual practices as the source of truth.

## Workflow

### 1. Inspect before editing

When a repository is available:

1. If the user provides a file path, read that file first. If the user provides only a repository, locate the main `AGENTS.md` or equivalent instruction file and read it first.
2. Read the full target file and inspect nearby sources of truth as needed: project documentation, package/build scripts, task runners, lint and formatter configuration, tests, CI workflows, directory structure, and existing skills.
3. Distinguish verified project facts from assumptions. Do not invent commands, paths, tools, architecture, policies, or capabilities.
4. Check whether the same guidance already exists in a more authoritative place. Prefer referencing a maintained source over copying a long or frequently changing catalog.
5. Consider the instruction file's scope: rules should apply to the files and tasks governed by that file.

### 2. Identify high-value issues first

Prioritize issues that can materially change agent behavior:

- **Incorrect or stale instructions:** commands, paths, versions, tools, or workflows that conflict with the repository.
- **Contradictions:** rules that prescribe incompatible actions or use conflicting standards.
- **Ambiguity:** wording that leaves important decisions, permissions, or completion criteria unclear.
- **Missing operational guidance:** essential setup, validation, project conventions, boundaries, or safety precautions that cannot reasonably be inferred.
- **Poor actionability:** vague advice that does not tell the agent what to do, when to do it, or what to do if it cannot comply.
- **Duplication and excessive detail:** repeated rules, exhaustive reference material, or task-specific procedures that obscure the most important guidance.
- **Weak verification:** unclear expectations for tests, builds, linting, review, or reporting the limits of validation.
- **Scope mismatch:** global rules placed in a local file, local exceptions applied too broadly, or agent-specific preferences mixed into shared project requirements.

Do not treat every stylistic preference as a defect. Focus on likely effects on correctness, safety, maintainability, and agent efficiency.

### 3. Evaluate each instruction

For each important rule, ask:

1. Is it relevant to the work covered by this file?
2. Is it factually correct and supported by repository evidence or an explicit user decision?
3. Is it clear enough to follow without guessing?
4. Does it specify an action, condition, or decision criterion where needed?
5. Does it conflict with another rule or duplicate it without adding value?
6. Is it located where an agent is likely to find it?
7. Would a shorter formulation preserve its meaning?
8. Is it a durable instruction, or would it be better maintained in project configuration, documentation, a task-specific guide, or a skill?

Keep useful existing guidance. Do not rewrite a sound file merely to make it look different.

### 4. Improve structure and information placement

Use a structure that matches the project rather than forcing a universal section template. A practical order often moves from essential context to execution:

- Project purpose and important structure, where needed.
- Working principles and expected agent behavior.
- Architecture, coding, and domain-specific conventions.
- Common development, build, and validation commands.
- Testing and completion criteria.
- Security, permissions, protected files, and other guardrails.
- Communication, delivery, or review expectations, if relevant.

Adapt, merge, omit, or reorder sections as appropriate. Not every project needs every section.

Keep broadly applicable, always-relevant rules in `AGENTS.md`.
Put detailed procedures that apply only to a particular task in a suitable skill or focused document when the project supports that organization.
Keep command definitions in scripts or task-runner configuration where possible, and refer to those sources rather than maintaining duplicate catalogs.

For repositories with nested instruction files, preserve clear scope and precedence. Put a rule in the narrowest location that reliably covers the work it governs; avoid unnecessary fragmentation.

### 5. Make rules precise and internally consistent

Prefer direct, testable wording over slogans such as "write clean code" or "test thoroughly." When useful, state:

- The expected action.
- The condition under which it applies.
- The relevant command, path, or source of truth.
- The fallback when the action is impossible or the tool is unavailable.
- What the agent should report if it cannot meet the requirement.

Resolve conflicts explicitly. For example, if a rule says to fix every warning while another says not to make risky or disproportionate changes, define how to handle warnings that cannot reasonably be fixed.
Do not leave the agent to reconcile conflicting requirements silently.

Use consistent terms for approval, prohibition, recommendation, and obligation. Distinguish clearly between "must," "should," and optional guidance. Do not turn a recommendation into an absolute requirement unless the project supports that policy.

Keep autonomy rules balanced: let the agent proceed on clear, in-scope, reversible work; ask when ambiguity materially affects behavior, scope, architecture, or risk; and require explicit authorization for consequential actions when appropriate.

### 6. Review safety and side effects

Check whether the file gives the agent enough guidance for the project's actual risks, such as:

- Destructive commands, publishing, deployment, releases, or remote changes.
- Secrets, credentials, personal data, or sensitive configuration.
- Generated files and files owned by automated workflows.
- Changes to tests, validation rules, or security controls.
- Dependency, schema, API, infrastructure, or compatibility changes.
- Existing uncommitted user changes.

Do not impose the same restrictions on every project. Derive safeguards from the repository and user requirements. Where authorization is required, define the relevant class of action and the expected approval clearly; avoid relying only on a brittle list of command spellings when equivalent actions could have the same side effects.

An `AGENTS.md` is guidance, not a security boundary. Do not imply that written instructions alone enforce permissions; use actual tooling, access controls, or sandboxing when enforcement is required.

### 7. Set useful validation and completion criteria

When appropriate for the project, state which checks to run for which kinds of changes. Prefer relevant, proportional validation over blindly running every expensive check after every edit.

Useful distinctions may include:

- Formatting and linting for changed files.
- Unit or integration tests for affected logic.
- End-to-end tests for important user-visible behavior.
- Build, type, compatibility, accessibility, security, or other checks when the change warrants them.

Make clear what to do when a check fails, is unavailable, or is unrelated to the change. Do not encourage hiding failures, disabling rules, weakening tests, or changing tests merely to obtain a passing result. Require the final report to distinguish checks that passed, failed, were skipped, or could not run when that information matters.

Avoid duplicating a complete test matrix if a reliable project script or dedicated guide already owns it.

### 8. Edit conservatively

- Preserve correct project-specific decisions, established terminology, and useful conventions.
- Make the smallest set of changes that materially improves the file.
- Remove duplicates and resolve contradictions before adding new rules.
- Do not add speculative requirements, technologies, workflows, or process overhead.
- Do not force an arbitrary line-count target. Concision matters because it improves signal, but completeness depends on project complexity and risk.
- Preserve valid frontmatter or metadata required by the target environment; do not invent unsupported fields.
- Use standard Markdown headings, lists, tables, and code formatting consistently.
- Keep examples short and ensure they match the project's real tools and conventions.

If asked only to review, provide recommendations without silently rewriting the file. If asked to improve it, make the changes when editing is available and appropriate.

### 9. Verify the result

After editing:

1. Re-read the complete file, not only the changed sections.
2. Check for contradictions, duplicated rules, broken references, invalid Markdown, malformed frontmatter, and inconsistent terminology.
3. Verify commands, paths, version claims, and project-specific examples against the available sources.
4. Confirm that each new rule has a clear purpose and that no existing essential constraint was lost.
5. Check that the file remains within the relevant agent's instruction-discovery and context limits when those limits are known.
6. Summarize the most consequential changes and any assumptions or unresolved questions. Do not claim to have run checks or verified facts that were not actually checked.

## Review checklist

Use this as a final quality gate; do not add every checklist item to the
resulting `AGENTS.md`.

- [ ] Accurate: project-specific facts are verified or explicitly marked uncertain.
- [ ] Relevant: instructions apply to the file's scope and the project's actual workflow.
- [ ] Actionable: important rules tell the agent what to do and when.
- [ ] Consistent: no unresolved contradictions or competing definitions of completion.
- [ ] Concise: duplicates and low-value detail are removed without losing essential context.
- [ ] Discoverable: important guidance is placed where the agent is likely to find it.
- [ ] Maintainable: frequently changing facts remain in authoritative project sources where practical.
- [ ] Safe: consequential side effects and protected resources have proportionate safeguards.
- [ ] Verifiable: validation expectations and failure reporting are clear.
- [ ] Proportionate: complexity, process, and length fit the project's size and risk.
- [ ] Honest: no invented repository facts or unsupported claims of verification.

## Output expectations

Tailor the output to the user's request:

- **Review only:** report the highest-value findings, why they matter, and suggested changes. Separate verified issues from recommendations that need repository context.
- **Improve existing file:** make focused edits, then summarize material changes and any remaining concerns.
- **Create a new file:** inspect the project first if available; otherwise provide a general baseline that avoids invented project-specific details.
- **No material issues found:** say so. Do not manufacture changes to appear useful.

Prefer a small number of high-impact improvements over an exhaustive list of cosmetic preferences.
