# n8n Workflow Templates

This directory holds workflow templates fetched from the official [n8n.io template library](https://n8n.io/workflows).

## How it works

The GitHub Action **Fetch n8n Workflow Templates** (`fetch-n8n-templates.yml`) runs the script `scripts/fetch-n8n-templates.mjs` which:

1. Queries `api.n8n.io/api/templates/search` to discover all published templates.
2. Downloads each full workflow definition from `api.n8n.io/api/workflows/templates/{id}`.
3. Saves every workflow as `{id}_{slug}.json` in this directory.
4. Writes `catalog.json` — a searchable index of every captured template.

## Triggering a fetch

| Method | How |
|---|---|
| **Manual** | Actions → *Fetch n8n Workflow Templates* → Run workflow |
| **Scheduled** | Automatically every Sunday at 04:00 UTC |

## File naming

```
{id}_{slugified_name}.json
```

Example: `0042_Send_Slack_message_on_new_GitHub_star.json`

## Resume mode

By default the script runs with `--resume` so it skips templates already present in this directory, making incremental updates fast.
