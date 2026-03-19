---
name: skill-creator
description: Create or update AgentSkills. Use when designing, structuring, or packaging skills with scripts, references, and assets.
---

# Skill Creator

This skill provides guidance for creating effective skills for the n8n Intelligence agent.

## About Skills

Skills are modular, self-contained packages that extend the agent's capabilities by providing specialized knowledge, workflows, and tools. They transform the agent from a general-purpose assistant into a specialized agent equipped with procedural knowledge.

### What Skills Provide

1. Specialized workflows - Multi-step procedures for specific domains
2. Tool integrations - Instructions for working with specific file formats or APIs
3. Domain expertise - Company-specific knowledge, schemas, business logic
4. Bundled resources - Scripts, references, and assets for complex tasks

## Anatomy of a Skill

Every skill consists of a required SKILL.md file and optional bundled resources:

```
skill-name/
├── SKILL.md (required)
│   ├── YAML frontmatter metadata (required)
│   │   ├── name: (required)
│   │   └── description: (required)
│   └── Markdown instructions (required)
└── Bundled Resources (optional)
    ├── scripts/          - Executable code
    ├── references/       - Documentation for context
    └── assets/           - Files used in output
```

## Skill Naming

- Use lowercase letters, digits, and hyphens only
- Keep under 64 characters
- Prefer short, verb-led phrases
- Name the skill folder exactly after the skill name

## Creating a Skill

1. Run the init script: `scripts/init_skill.py <name> --path <output-dir>`
2. Edit SKILL.md to complete TODO items
3. Add resources as needed (scripts, references, assets)
4. Package: `scripts/package_skill.py <path/to/skill-folder>`

## Frontmatter Guidelines

The YAML frontmatter `description` is the primary triggering mechanism:
- Include both what the skill does AND when to use it
- Include all trigger scenarios in the description
- The body is only loaded after triggering
