---
name: skill-md-improver
description: Improve SKILL.md file. Use when user asks to check, audit, update, improve, or fix SKILL.md files.
argument-hint: "<path to SKILL.md file>"
---

# SKILL.md Improver

Workflow :
0. Read the SKILL.md file and check for any associated sub-folders (like `references/` or `scripts/`).
1. Audit the SKILL.md file using the main checklist
2. Score the skill on each dimension (1-5) and output a score table.
3. Propose changes to improve the skill based on the audit and score table.

## 1. Audit using the following checklist

### Metadata & Discovery (The YAML Frontmatter)

The front matter must contain at minimum the fields `name`, `description`.

- `name`: Use a unique, short identifier, in lowercase, without spaces or accents, and must not contain special characters.
- `description`: A good description includes both what the skill does and when to trigger it. Include the specific nouns and verbs a user would actually type. Always write in third person and fit in one line, under 1024 characters.

If the skill takes arguments, include an `argument-hint` field.

- `argument-hint`: A hint about the expected argument(s) the user can provide to the SKILL. Use a very short, one-line string, ideally under 100 characters. It should be a placeholder for the argument(s) the user can provide to the skill. If the skill does not take any arguments, this field can be omitted.

### Core Structure & Sizing

- **Length Limits**: Keep the main SKILL.md file under 500 lines and around 5,000 tokens to preserve context space.
- **Coherent Scope**: Encapsulate a single, well-defined unit of work that composes cleanly with other skills.
- **Delta Principle**: Add what the agent lacks and omit general knowledge the model already possesses (e.g., skip basic syntax rules; focus strictly on project or domain-specific conventions).
**Body Organization**: Structure the body of the SKILL.md file in a logical, easy-to-follow manner. Use clear headings and subheadings to organize the content. Each section should have a clear purpose and flow naturally from one to the next. Avoid long paragraphs; use bullet points, numbered lists, and tables where appropriate to enhance readability.

### Progressive Disclosure & Modularity

- **Layered Files**: Keep core instructions in SKILL.md and push bulky reference docs, templates, or heavy assets into sub-folders like references/ or scripts/. Name files descriptively
- **One-Level Linking, with Context**: Link secondary reference files only one level deep from SKILL.md so the agent pulls them in only when necessary. Always explain in SKILL.md when the reference file is needed and how to use it.

### Execution & Reliability

- **Workflows & Guardrails**: Use explicit sequential steps, validation-fix loops, checklists, and negative guardrails to prevent common pitfalls or hallucinations. For particularly complex workflows, provide a copyable checklist — the agent can paste it into its response and track progress.
- **Scripts & Deterministic Utilities**: Provide scripts or deterministic utilities for repetitive tasks, rather than relying purely on open-ended generated code. This ensures reliability and reproducibility.

## 2. Score the skill

After auditing, score the skill on each dimension (1-5):

| Dimension | 1 (poor) | 5 (excellent) |
|-----------|----------|---------------|
| Discovery | Generic name, no description, or generic | Specific nouns/verbs, clear trigger conditions |
| Scope | Multiple unrelated tasks, file too long | Single coherent unit of work, appropriately sized |
| Specificity | Restates model knowledge | Only delta information |
| Body organization | Unstructured, long paragraphs | Clear headings, bullet points, numbered lists, tables |
| Progressive disclosure | Everything in one file or flat | Layered with references or scripts with clear "when to load" cues |
| Reliability | Open-ended instructions | Deterministic steps, validation loops, scripts |

Output a score table before proposing changes.

Each score must cite evidence (line number or quoted excerpt) and one sentence of justification.
A score of 5 requires zero identified defects on that dimension.

## 3. Propose changes

Propose changes to improve the SKILL.md file based on the audit and score table. Focus on improving the weakest dimensions first. 

After proposing changes:
1. Apply the diff (if approved).
2. Re-run the rubric scoring. When re-scoring after changes, re-read the file as if for the first time; do not assume the fixes worked.
3. Ask the user if they want to iterate further or finalize.
