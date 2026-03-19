# Before You Begin

## Final Warning: Important Information

**We recommend reading this document before using this software. It covers what the system does, what to be aware of, and how to use it responsibly.**

---

### What This Software Is

This is an AI-powered workflow automation infrastructure combining n8n's 400+ integration nodes with a conversational AI agent. It is intended for use by qualified developers for the purpose of building, maintaining, and automating complex workflows.

---

### Capabilities and Scope

Before deploying this system, it helps to understand what the agent can access.

> **Note:** Most of these capabilities are standard properties of any GitHub Actions workflow running on `ubuntu-latest`. They are not unique to this project. We document them here so you can make informed decisions about your security posture.

**Key areas to be aware of:**

| Dimension | Level |
|---|---|
| Code & Repository Access | 🔴 High priority |
| Supply Chain Considerations | 🔴 High priority |
| Secret Exposure | 🔴 High priority |
| n8n Credential Access | 🔴 High priority |
| Network Egress | 🟠 Moderate priority |
| Compute Resources | 🟠 Moderate priority |
| Persistence | 🟡 Low priority |

---

### Things to Keep in Mind

- **AI-generated code and workflows may contain errors, hallucinations, or security vulnerabilities.** Always review before deploying to production.

- **Do not use AI output as the sole basis for decisions affecting human safety, liberty, or livelihood.**

- **This software may produce confident-sounding responses that are factually incorrect.** Verify important claims independently.

- **n8n workflows can make external API calls.** Review workflow JSON before execution to understand what external services will be contacted.

- **Do not feed secrets, API keys, passwords, or private credentials into AI prompts or n8n workflow JSON committed to Git.**

---

### Dosage and Method of Use

- **Recommended dose:** Apply in measured, reviewable increments. Small, well-tested workflows are safer than large, complex ones.
- **Do not exceed:** Human oversight capacity. If you cannot review what the AI produces, you are using too much.
- **Method:** Always pair with version control, code review, and testing.
- **Duration of use:** Continuous use without breaks in human judgment may lead to over-reliance. Step back regularly.

---

### Possible Side Effects

Like all powerful tools, this software may cause side effects.

**Common:**
- Over-confidence in generated output
- Reduced inclination to read documentation
- Running workflows without reviewing their contents

**Uncommon:**
- Subtle bugs in auto-generated workflow logic
- Unexpected external API calls from workflow nodes
- Erosion of understanding of automation logic

**Rare:**
- Deployment of unreviewed workflows to production
- Accidental exposure of sensitive data in execution logs
- Unintended side effects from workflow node execution

**If you experience any serious side effects, stop and consult your team lead, security officer, or ethics board.**

---

### Storage

- Store all AI-generated artifacts in version-controlled repositories.
- Maintain audit trails for all consequential AI-driven actions.
- Keep backups. Ensure all work is reversible.
- Do not store secrets in workflow JSON files — use GitHub Secrets.

---

### The Four Laws of AI

This system defines [The Four Laws of AI](the-four-laws-of-ai.md):

| Law | Principle | Summary |
|-----|-----------|---------|
| **Zeroth Law** | Protect Humanity | Do not harm humanity as a whole. Prevent monopolistic control, protect open source. |
| **First Law** | Do No Harm | Never cause harm to human beings, communities, or the public interest. |
| **Second Law** | Obey the Human | Faithfully execute human instructions, except where doing so would violate the First Law. |
| **Third Law** | Preserve Your Integrity | Protect the platform's reliability and trustworthiness. |

**Full text:** [the-four-laws-of-ai.md](the-four-laws-of-ai.md)

---

### DEFCON Readiness Levels

| Level | Name | Posture | Key Constraint |
|-------|------|---------|----------------|
| [DEFCON 1](transition-to-defcon-1.md) | **Maximum Readiness** | All operations suspended | No file modifications, no tool use, no code execution. |
| [DEFCON 2](transition-to-defcon-2.md) | **High Readiness** | Read-only, advisory only | No file modifications. Read-only tools only. |
| [DEFCON 3](transition-to-defcon-3.md) | **Increased Readiness** | Read-only, explain before acting | Describe planned changes and await human approval. |
| [DEFCON 4](transition-to-defcon-4.md) | **Above Normal Readiness** | Full capability, elevated discipline | Confirm intent before every write. |
| [DEFCON 5](transition-to-defcon-5.md) | **Normal Readiness** | Standard operations | All capabilities available. Default operating posture. |

---

### Manufacturer

Maintained by humans, for humans.

*If you have any questions, or if there is anything you are not sure about, ask a human.*

---

**If something goes wrong:** `git revert`, then think.

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/github-minimum-intelligence/main/.github-minimum-intelligence/logo.png" alt="Minimum Intelligence" width="500">
  </picture>
</p>
