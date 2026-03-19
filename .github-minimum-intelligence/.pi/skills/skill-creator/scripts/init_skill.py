#!/usr/bin/env python3
"""
Skill Initializer - Creates a new skill from template

Usage:
    init_skill.py <skill-name> --path <path> [--resources scripts,references,assets] [--examples]
"""

import argparse
import re
import sys
from pathlib import Path

MAX_SKILL_NAME_LENGTH = 64
ALLOWED_RESOURCES = {"scripts", "references", "assets"}

SKILL_TEMPLATE = """---
name: {skill_name}
description: [TODO: Complete description of what the skill does and when to use it.]
---

# {skill_title}

## Overview

[TODO: 1-2 sentences explaining what this skill enables]
"""


def normalize_skill_name(skill_name):
    normalized = skill_name.strip().lower()
    normalized = re.sub(r"[^a-z0-9]+", "-", normalized)
    normalized = normalized.strip("-")
    normalized = re.sub(r"-{2,}", "-", normalized)
    return normalized


def title_case_skill_name(skill_name):
    return " ".join(word.capitalize() for word in skill_name.split("-"))


def parse_resources(raw_resources):
    if not raw_resources:
        return []
    resources = [item.strip() for item in raw_resources.split(",") if item.strip()]
    invalid = sorted({item for item in resources if item not in ALLOWED_RESOURCES})
    if invalid:
        print(f"[ERROR] Unknown resource type(s): {', '.join(invalid)}")
        sys.exit(1)
    return list(dict.fromkeys(resources))


def init_skill(skill_name, path, resources, include_examples):
    skill_dir = Path(path).resolve() / skill_name
    if skill_dir.exists():
        print(f"[ERROR] Skill directory already exists: {skill_dir}")
        return None

    try:
        skill_dir.mkdir(parents=True, exist_ok=False)
    except Exception as e:
        print(f"[ERROR] Error creating directory: {e}")
        return None

    skill_title = title_case_skill_name(skill_name)
    skill_content = SKILL_TEMPLATE.format(skill_name=skill_name, skill_title=skill_title)
    (skill_dir / "SKILL.md").write_text(skill_content)

    for resource in resources:
        (skill_dir / resource).mkdir(exist_ok=True)

    print(f"[OK] Skill '{skill_name}' initialized at {skill_dir}")
    return skill_dir


def main():
    parser = argparse.ArgumentParser(description="Create a new skill directory.")
    parser.add_argument("skill_name", help="Skill name (normalized to hyphen-case)")
    parser.add_argument("--path", required=True, help="Output directory")
    parser.add_argument("--resources", default="", help="Comma-separated: scripts,references,assets")
    parser.add_argument("--examples", action="store_true", help="Create example files")
    args = parser.parse_args()

    skill_name = normalize_skill_name(args.skill_name)
    if not skill_name:
        print("[ERROR] Skill name must include at least one letter or digit.")
        sys.exit(1)
    if len(skill_name) > MAX_SKILL_NAME_LENGTH:
        print(f"[ERROR] Skill name too long ({len(skill_name)} chars). Max is {MAX_SKILL_NAME_LENGTH}.")
        sys.exit(1)

    resources = parse_resources(args.resources)
    result = init_skill(skill_name, args.path, resources, args.examples)
    sys.exit(0 if result else 1)


if __name__ == "__main__":
    main()
