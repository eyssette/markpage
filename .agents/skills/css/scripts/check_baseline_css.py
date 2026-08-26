#!/usr/bin/env python3
"""
check_baseline_css.py — Flags CSS features that are not "Baseline 2020"
(i.e. features that did not reach Baseline "Newly available" status on or
before 2020-12-31, according to the web-features dataset maintained by the
WebDX Community Group).

Usage:
    python3 check_baseline_css.py path/to/style.css [more.css ...]
    python3 check_baseline_css.py --json path/to/style.css   # machine-readable output
    cat style.css | python3 check_baseline_css.py -          # read from stdin

Exit code: 0 if no risky features found, 1 if at least one is found,
2 on usage/parsing error. This makes the script usable as a CI gate.

Limitations (read before trusting this blindly):
- This is a lightweight regex-based scanner, not a full CSS parser. It is
  good at catching real-world usage but can miss edge cases inside deeply
  nested functions, unusual strings, or minified CSS with pathological
  formatting. Always sanity-check a genuinely borderline finding against
  https://caniuse.com or the Baseline widget on MDN before ripping a
  feature out.
- "Safe" means Baseline-safe, not "good practice". A property can be
  perfectly Baseline 2020 and still be a bad idea (e.g. deprecated).
- Media feature names (e.g. `min-width` inside @media) are matched by the
  same property-name pass as real declarations. This is harmless: media
  feature names are a subset of long-standing property names, so this
  never produces a false "risky" flag.
"""

import argparse
import json
import re
import sys
from pathlib import Path

BASE_DIR = Path.cwd().resolve()
DATA_PATH = Path(__file__).parent.parent / "references" / "baseline_2020_data.json"

# The web-features dataset sometimes bundles a handful of rare/late-added
# keyword values together with a long-standing property or selector under a
# single feature ID, which drags the *whole* feature's Baseline status down
# even though the base property/selector itself has been safe for years
# (e.g. "cursor" is marked non-Baseline only because of a few exotic cursor
# keywords, not because `cursor: pointer` is risky). These are manually
# confirmed safe overrides for cases like that — verified against MDN/caniuse
# by hand, not derived automatically. Keyed by (kind, token).
MANUAL_SAFE_OVERRIDES = {
    ("property", "cursor"),
    ("property", "outline"),
    ("property", "resize"),
    ("property", "user-select"),
    ("selector", "not"),
    ("selector", "selection"),
}


def load_data():
    with open(DATA_PATH, encoding="utf-8") as f:
        return json.load(f)


def strip_comments_and_strings(css: str) -> str:
    """Remove /* ... */ comments and quoted string contents (keep quotes as
    empty strings so positions/braces stay roughly aligned), so identifiers
    inside comments/strings are never mistaken for real CSS tokens."""
    css = re.sub(r"/\*.*?\*/", " ", css, flags=re.DOTALL)
    css = re.sub(r'"(?:[^"\\]|\\.)*"', '""', css)
    css = re.sub(r"'(?:[^'\\]|\\.)*'", "''", css)
    return css


def split_top_level_blocks(css: str):
    """Yield (prelude, body, is_at_rule) for every {...} block at any
    nesting depth, plus the raw at-rule preludes for at-rules with no body
    (e.g. `@import url(...);`)."""
    blocks = []
    depth = 0
    start = None
    prelude_start = 0
    i = 0
    n = len(css)
    while i < n:
        ch = css[i]
        if ch == "{":
            if depth == 0:
                prelude = css[prelude_start:i]
                start = i + 1
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0 and start is not None:
                body = css[start:i]
                blocks.append((prelude, body))
                prelude_start = i + 1
                start = None
        elif ch == ";" and depth == 0:
            prelude_start = i + 1
        i += 1
    return blocks


IDENT = r"[a-zA-Z-][a-zA-Z0-9-]*"


def find_at_rules(css: str):
    return sorted(set(m.group(1).lower() for m in re.finditer(r"@(" + IDENT + r")", css)))


def find_selectors_pseudo(css: str, prelude_or_full: str):
    """Find :pseudo-class / ::pseudo-element names anywhere (safe to scan
    the whole file since pseudo syntax never legitimately appears outside
    selectors once comments/strings are stripped)."""
    return sorted(set(m.group(1).lower() for m in re.finditer(r":{1,2}(" + IDENT + r")", prelude_or_full)))


def find_nesting(css: str, blocks):
    """Heuristic: a literal '&' anywhere in the (comment/string-stripped)
    source signals CSS nesting syntax. '&' has no other legitimate meaning
    in plain CSS once strings are stripped, so this is safe and also
    catches nesting several levels deep (which split_top_level_blocks
    does not enumerate individually)."""
    return "&" in css


def find_functions(css: str):
    return sorted(set(m.group(1).lower() for m in re.finditer(r"\b(" + IDENT + r")\s*\(", css)))


def find_declarations(css: str, blocks):
    """Return list of (property, value) from declaration blocks (skip
    blocks whose prelude starts with '@' and has no ':' pattern typical of
    declarations, e.g. @keyframes step selectors like `50%` are harmless
    since they won't match IDENT: pattern)."""
    decls = []
    for _prelude, body in blocks:
        for m in re.finditer(r"(" + IDENT + r")\s*:\s*([^;{}]+);?", body):
            decls.append((m.group(1).lower(), m.group(2).strip()))
    return decls


def tokenize_value(value: str):
    return set(t.lower() for t in re.findall(r"[a-zA-Z][a-zA-Z0-9-]*", value))


UNIT_RE = re.compile(r"(?<![a-zA-Z0-9_-])[+-]?\d*\.?\d+([a-zA-Z%]+)")


def find_units(css: str):
    """Extract unit suffixes attached to numbers (e.g. 100dvh -> 'dvh')."""
    return sorted(set(m.group(1).lower() for m in UNIT_RE.finditer(css)))


def analyze(css_text: str, data: dict):
    clean = strip_comments_and_strings(css_text)
    blocks = split_top_level_blocks(clean)

    findings = []  # each: dict(kind, token, status_info)

    def add(kind, token, info):
        findings.append({"kind": kind, "token": token, **info})

    # at-rules
    for token in find_at_rules(clean):
        info = data["atRules"].get(token)
        if info and info["status"] == "risky":
            add("at-rule", "@" + token, info)

    # selectors (pseudo-classes / pseudo-elements)
    for token in find_selectors_pseudo(clean, clean):
        info = data["selectors"].get(token)
        if info and info["status"] == "risky":
            add("selector", ":" + token, info)

    # nesting via '&'
    if find_nesting(clean, blocks):
        info = data["selectors"].get("nesting")
        if info and info["status"] == "risky":
            add("selector", "& (CSS nesting)", info)

    # functions/values used anywhere in the file
    for token in find_functions(clean):
        info = data["functions"].get(token)
        if info and info["status"] == "risky":
            add("function", token + "()", info)

    # numeric units (e.g. 100dvh, 5cqw)
    for token in find_units(clean):
        info = data["units"].get(token)
        if info and info["status"] == "risky":
            add("unit", token, info)

    # properties + property:value combos
    seen_props = set()
    for prop, value in find_declarations(clean, blocks):
        if prop not in seen_props:
            seen_props.add(prop)
            info = data["properties"].get(prop)
            if info and info["status"] == "risky":
                add("property", prop, info)
        for word in tokenize_value(value):
            info = data["propertyValues"].get(prop + ":" + word)
            if info and info["status"] == "risky":
                add("value", f"{prop}: {word}", info)

    # drop manually-confirmed-safe overrides (see MANUAL_SAFE_OVERRIDES above)
    def is_overridden(f):
        kind, token = f["kind"], f["token"]
        bare = token.lstrip(":@").split("(")[0].split(":")[0].strip()
        if (kind, bare) in MANUAL_SAFE_OVERRIDES:
            return True
        if kind == "value":
            prop = token.split(":")[0].strip()
            if ("property", prop) in MANUAL_SAFE_OVERRIDES:
                return True
        return False

    findings = [f for f in findings if not is_overridden(f)]

    # de-duplicate findings on (kind, token)
    deduplicates = {}
    for f in findings:
        deduplicates[(f["kind"], f["token"])] = f
    return sorted(deduplicates.values(), key=lambda f: (f["kind"], f["token"]))


def format_text_report(filename, findings):
    lines = []
    if not findings:
        lines.append(f"✅ {filename}: no post-2020 or non-Baseline CSS features detected.")
        return "\n".join(lines)
    lines.append(f"⚠️  {filename}: {len(findings)} feature(s) not in Baseline 2020:")
    for f in findings:
        baseline = f.get("baseline")
        low_date = f.get("low_date")
        if baseline is False:
            support = "not yet Baseline (limited/inconsistent browser support)"
        elif f.get("discouraged"):
            support = "discouraged/deprecated"
        elif low_date:
            support = f"Baseline since {low_date[:7]}"
        else:
            support = "not Baseline 2020"
        lines.append(f"  - [{f['kind']}] {f['token']}  →  {support}  ({f.get('feature', '')})")
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("files", nargs="+", help="CSS file(s) to check, or '-' for stdin")
    parser.add_argument("--json", action="store_true", help="output machine-readable JSON instead of text")
    args = parser.parse_args()

    data = load_data()
    any_risky = False
    all_results = {}

    for filename in args.files:
        if filename == "-":
            css_text = sys.stdin.read()
            label = "<stdin>"
        else:
            requested_path = Path(filename).resolve()

            if not requested_path.is_relative_to(BASE_DIR):
                print(f"error: access denied to path: {filename}", file=sys.stderr)
                sys.exit(2)

            if not requested_path.exists():
                print(f"error: file not found: {filename}", file=sys.stderr)
                sys.exit(2)
            
            css_text = requested_path.read_text(encoding="utf-8", errors="replace")
            label = filename

        findings = analyze(css_text, data)
        all_results[label] = findings
        if findings:
            any_risky = True

        if not args.json:
            print(format_text_report(label, findings))
            print()

    if args.json:
        print(json.dumps(all_results, indent=2))

    sys.exit(1 if any_risky else 0)


if __name__ == "__main__":
    main()
