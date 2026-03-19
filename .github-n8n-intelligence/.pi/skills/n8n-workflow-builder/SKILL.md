---
name: n8n-workflow-builder
description: Build, modify, and validate n8n workflow JSON files. Use when the user wants to create a new automation workflow, modify an existing workflow, add nodes, connect nodes, or describe an automation in natural language that should be converted to n8n workflow format.
---

# n8n Workflow Builder

Build n8n workflow JSON files from natural language descriptions or modify existing ones.

## Workflow JSON Structure

Every n8n workflow is a JSON document with this structure:

```json
{
  "name": "Workflow Name",
  "nodes": [
    {
      "parameters": {},
      "id": "unique-id",
      "name": "Node Name",
      "type": "n8n-nodes-base.nodeType",
      "typeVersion": 1,
      "position": [x, y]
    }
  ],
  "connections": {
    "Source Node Name": {
      "main": [
        [{ "node": "Target Node Name", "type": "main", "index": 0 }]
      ]
    }
  },
  "settings": {
    "executionOrder": "v1"
  }
}
```

## Common Node Types

| Node Type | Purpose |
|-----------|---------|
| `n8n-nodes-base.start` | Workflow entry point |
| `n8n-nodes-base.function` | Custom JavaScript logic |
| `n8n-nodes-base.httpRequest` | Make HTTP/API calls |
| `n8n-nodes-base.if` | Conditional branching |
| `n8n-nodes-base.set` | Set/transform data fields |
| `n8n-nodes-base.merge` | Combine multiple inputs |
| `n8n-nodes-base.splitInBatches` | Process items in chunks |
| `n8n-nodes-base.github` | GitHub API operations |
| `n8n-nodes-base.slack` | Slack messaging |
| `n8n-nodes-base.emailSend` | Send emails |
| `n8n-nodes-base.cron` | Scheduled triggers |
| `n8n-nodes-base.webhook` | HTTP webhook triggers |

## GitHub Node Operations

The `n8n-nodes-base.github` node supports:
- **File**: create, delete, edit, get, list
- **Issue**: create, createComment, edit, get, lock
- **Repository**: get, getIssues, getLicense, getProfile
- **Release**: getAll
- **Review**: create, dismiss, get, list, update
- **Workflow**: dispatchAndWait, get, list, listRuns, triggerDispatch
- **User**: getUserIssues, getRepositories

## Building a Workflow

1. Start with a `start` node at position [240, 300]
2. Add processing nodes, incrementing x by 220 for each step
3. Connect nodes via the `connections` object
4. Save to `workflows/` directory as `.json`

## Credential References

In Githubified n8n, credentials map to GitHub Secrets:
- `GITHUB_TOKEN` → GitHub API access
- `OPENAI_API_KEY` → AI model access
- `N8N_ENCRYPTION_KEY` → n8n credential encryption

## Validation

Before saving, verify:
- Every node has a unique `id` and `name`
- All referenced nodes in `connections` exist in `nodes`
- Node `type` values are valid n8n node types
- `settings.executionOrder` is set to `"v1"`
