---
name: n8n-executor
description: Execute and monitor n8n workflows on GitHub Actions. Use when the user wants to run a workflow, check execution status, view execution logs, trigger a workflow dispatch, or troubleshoot failed workflow executions.
---

# n8n Executor

Execute n8n workflows on GitHub Actions and manage their results.

## How Execution Works

In the Githubified model, n8n workflows execute on GitHub Actions runners:

1. A GitHub event triggers the workflow (issue, push, schedule, dispatch)
2. The Actions runner installs n8n via `npm install -g n8n`
3. Workflow JSON is imported: `n8n import:workflow --input=<file>`
4. Workflow executes headlessly: `n8n execute --id=1`
5. Output is captured and committed to `executions/`
6. Results are posted as issue comments

## Triggering Execution

### Manual Dispatch
```bash
gh workflow run n8n-execute.yml -f workflow_file=workflows/utilities/hello-world.json
```

### Via Issue Label
Add the `n8n-execute` label to an issue to trigger workflow execution.

### Scheduled
Workflows in `workflows/` can be triggered on a cron schedule via the `n8n-schedule.yml` workflow.

## Environment Variables

n8n on GitHub Actions uses these environment variables:

| Variable | Source | Purpose |
|----------|--------|---------|
| `N8N_ENCRYPTION_KEY` | GitHub Secret | Decrypt n8n credentials |
| `DB_TYPE` | Set to `sqlite` | Use ephemeral SQLite database |
| `N8N_USER_FOLDER` | Set to workspace `.n8n/` | n8n configuration directory |
| `GITHUB_TOKEN` | Automatic | GitHub API access |

## Execution Logs

Execution output is saved to `executions/latest/` with timestamps:
```
executions/latest/2026-03-19T030000Z.log
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Workflow not found | Verify the JSON file path is correct and the file is committed |
| Credential error | Check that required GitHub Secrets are set |
| Timeout | GitHub Actions jobs have a 6-hour limit; split long workflows |
| Node not available | Ensure the required n8n node package is installed |
| SQLite error | The database is ephemeral; use `n8n import:workflow` at run start |

## Execution Limits

- **Max runtime**: 6 hours per GitHub Actions job
- **Concurrency**: Controlled by GitHub Actions concurrency groups
- **Storage**: Ephemeral per-run; results must be committed to Git
- **Network**: Full outbound access; no inbound webhooks
