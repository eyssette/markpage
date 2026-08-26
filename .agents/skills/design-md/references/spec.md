<!-- Copié depuis https://raw.githubusercontent.com/google-labs-code/design.md/refs/heads/main/docs/spec.md -->

# DESIGN.md Format

DESIGN.md is a self-contained, plain-text representation of a design system. It defines the visual identity of a brand and product, thereby ensuring that these stylistic choices can be followed across design sessions and between different AI agents and tools. As a human-readable, open-format document, it serves as a living source of truth that both humans and AI can understand and refine.

A DESIGN.md file contains two parts: An optional YAML frontmatter, and a markdown body. The YAML front matter contains machine-readable design tokens. The markdown body sections provide human-readable design rationale and guidance. Prose may use descriptive color names (e.g., "Midnight Forest Green") that correspond to systematic token names (e.g., `primary`). The tokens are the normative values; the prose provides context for how to apply them.

# Design Tokens

Design tokens are embedded as YAML front matter at the beginning of the file. The front matter block must begin with a line containing exactly `---` and end with a line containing exactly `---`.

Example:

```yaml
---
version: alpha
name: Daylight Prestige
colors:
  primary: "#1A1C1E"
  secondary: "#6C7278"
  tertiary: "#B8422E"
typography:
  h1:
    fontFamily: Public Sans
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -0.02em
---
```

## Schema

```yaml
version: <string>          # optional, current version: "alpha"
name: <string>
description: <string>      # optional
omitted: <string[]|OmittedSection[]> # optional
colors:
  <token-name>: <Color>
typography:
  <token-name>: <Typography>
rounded:
  <scale-level>: <Dimension>
spacing:
  <scale-level>: <Dimension | number>
components:
  <component-name>:
    <token-name>: <string|token reference>
```

`<scale-level>` is a named level (xs, sm, md, lg, xl, full, or any descriptive string).

**Color**: any valid CSS color string (hex, named, rgb/hsl/hwb, oklch/oklab/lch/lab, color-mix). Hex (`#RRGGBB`) is the recommended default.

**Typography** fields:
- `fontFamily` (string)
- `fontSize` (Dimension)
- `fontWeight` (number, bare or quoted)
- `lineHeight` (Dimension | unitless number — unitless is a multiplier of fontSize, the recommended practice)
- `letterSpacing` (Dimension)
- `fontFeature` / `fontVariation` (string, optional advanced CSS settings)

**Dimension**: a string with unit suffix `px`, `em`, or `rem`.

**Omitted**: array of sections intentionally left out, to suppress linter warnings. Entries can be a string (section name) or `{ section, reason }`.

```yaml
omitted:
  - spacing
  - section: rounded
    reason: "No rounded corners defined in brand book"
```

**Token References**: wrapped in curly braces, pointing to another value in the YAML tree, e.g. `{colors.primary-60}`. Must point to a primitive value except within `components`, where references to composite values (e.g. `{typography.label-md}`) are allowed.

# Sections

Sections can be omitted if not relevant, but those present must appear in this order. All sections use `##` headings. An optional `#` (h1) title may appear but is not parsed as a section.

1. **Overview** (also: "Brand & Style")
2. **Colors**
3. **Typography**
4. **Layout** (also: "Layout & Spacing")
5. **Elevation & Depth** (also: "Elevation")
6. **Shapes**
7. **Components**
8. **Do's and Don'ts**

## Overview
Also known as "Brand & Style". A holistic description of the product's look and feel: brand personality, target audience, and the emotional response the UI should evoke (playful vs. professional, dense vs. spacious). Foundational context for decisions not covered by an explicit rule or token. Prose only, no tokens.

## Colors
Defines the color palettes. At least `primary` must be defined. When there are multiple palettes, the common convention is to name them `primary`, `secondary`, `tertiary`, `neutral`. Prose should explain each color's role using descriptive names, paired with the token's hex value. Tokens: `colors` is `map<string, Color>`.

Example prose:
```markdown
## Colors
The palette is rooted in high-contrast neutrals and a single, evocative accent color.

- **Primary (#1A1C1E):** A deep ink used for headlines and core text.
- **Secondary (#6C7278):** A sophisticated slate for borders, captions, metadata.
- **Tertiary (#B8422E):** A vibrant earthy red for primary actions only.
- **Neutral (#F7F5F2):** A warm limestone as the page foundation.
```

## Typography
Defines typography levels (most systems have 9-15). Common naming: `headline`, `display`, `body`, `label`, `caption`, each possibly split into `small`/`medium`/`large`. Tokens: `typography` is `map<string, Typography>`.

## Layout
Also known as "Layout & Spacing". Describes the layout and spacing strategy (grid-based, margins/safe-areas, etc.) and the spacing scale used to keep rhythm consistent. Tokens: `spacing` is `map<string, Dimension | number>`.

## Elevation & Depth
Also known as "Elevation". Describes how visual hierarchy/depth is conveyed: shadows (spread, blur, color) or, for flat designs, the alternative (borders, color contrast). Prose only, no dedicated token group in this schema.

## Shapes
Describes how elements are shaped (corner radius language etc.). Tokens: `rounded` is `map<string, Dimension>`.

## Components
Style guidance for component atoms: Buttons, Chips, Lists, Tooltips, Checkboxes, Radio buttons, Input fields (common types; others can be added). Tokens: `components` is `map<string, map<string, string>>` — component name → property name → value (literal or `{token.reference}`).

Variants (hover, active, pressed, etc.) get their own related key, e.g. `button-primary`, `button-primary-hover`.

Component property tokens: `backgroundColor` (Color), `textColor` (Color), `typography` (Typography ref), `rounded` (Dimension), `padding` (Dimension), `size`/`height`/`width` (Dimension).

## Do's and Don'ts
Practical guidelines and common pitfalls, as a bullet list of "Do" / "Don't" statements. Prose only.

```markdown
## Do's and Don'ts
- Do use the primary color only for the single most important action per screen
- Don't mix rounded and sharp corners in the same view
- Do maintain WCAG AA contrast ratios (4.5:1 for normal text)
- Don't use more than two font weights on a single screen
```

# Recommended Token Names (Non-Normative)
**Colors:** `primary`, `secondary`, `tertiary`, `neutral`, `surface`, `on-surface`, `error`
**Typography:** `headline-display`, `headline-lg`, `headline-md`, `body-lg`, `body-md`, `body-sm`, `label-lg`, `label-md`, `label-sm`
**Rounded:** `none`, `sm`, `md`, `lg`, `xl`, `full`

# Consumer Behavior for Unknown Content
| Scenario | Behavior |
|---|---|
| Unknown section heading | Preserve; do not error |
| Unknown color token name | Accept if value is valid |
| Unknown typography token name | Accept as valid typography |
| Unknown spacing value | Accept; store as string if not a valid dimension |
| Unknown component property | Accept with warning |
| Duplicate section heading | Error; reject the file |
