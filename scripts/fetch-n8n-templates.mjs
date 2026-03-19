#!/usr/bin/env node

/**
 * fetch-n8n-templates.mjs
 *
 * Fetches all n8n community workflow templates from the official n8n.io API
 * and stores them as individual JSON files in workflows/templates/.
 *
 * API endpoints:
 *   Search:  GET https://api.n8n.io/api/templates/search?page=N&rows=M
 *   Detail:  GET https://api.n8n.io/api/workflows/templates/{id}
 *
 * Usage:
 *   node scripts/fetch-n8n-templates.mjs              # fetch all templates
 *   node scripts/fetch-n8n-templates.mjs --resume      # skip already-downloaded
 *   node scripts/fetch-n8n-templates.mjs --dry-run     # list templates without downloading
 */

import { writeFileSync, readFileSync, mkdirSync, existsSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..");

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
const API_BASE = "https://api.n8n.io/api";
const SEARCH_ENDPOINT = `${API_BASE}/templates/search`;
const DETAIL_ENDPOINT = (id) => `${API_BASE}/workflows/templates/${id}`;

const TEMPLATES_DIR = join(ROOT, "workflows", "templates");
const CATALOG_FILE = join(TEMPLATES_DIR, "catalog.json");

const PAGE_SIZE = 50; // max rows per search page
const RATE_LIMIT_MS = 200; // ms between API calls
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const FLAG_RESUME = args.includes("--resume");
const FLAG_DRY_RUN = args.includes("--dry-run");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJSON(url, retries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText} for ${url}`);
      }
      return await res.json();
    } catch (err) {
      if (attempt === retries) throw err;
      const delay = RETRY_DELAY_MS * attempt;
      console.warn(
        `  ⚠ Attempt ${attempt}/${retries} failed: ${err.message}. Retrying in ${delay}ms…`
      );
      await sleep(delay);
    }
  }
}

/** Sanitise a workflow name into a safe filename component. */
function slugify(name) {
  return name
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/(^_|_$)/g, "")
    .substring(0, 120);
}

function existingTemplateIds() {
  if (!existsSync(TEMPLATES_DIR)) return new Set();
  const ids = new Set();
  for (const f of readdirSync(TEMPLATES_DIR)) {
    const m = f.match(/^(\d+)_/);
    if (m) ids.add(Number(m[1]));
  }
  return ids;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log("🔄 n8n Template Fetcher");
  console.log("=".repeat(50));

  mkdirSync(TEMPLATES_DIR, { recursive: true });

  // ---- 1. Discover total template count ----
  console.log("\n📡 Querying n8n template library…");
  const firstPage = await fetchJSON(`${SEARCH_ENDPOINT}?page=1&rows=1`);
  const totalWorkflows = firstPage.totalWorkflows;
  console.log(`   Found ${totalWorkflows} workflow templates`);

  // ---- 2. Fetch all template metadata (search pages) ----
  console.log("\n📥 Fetching template metadata…");
  const templates = []; // { id, name, description, ... }
  const totalPages = Math.ceil(totalWorkflows / PAGE_SIZE);

  for (let page = 1; page <= totalPages; page++) {
    process.stdout.write(
      `   Page ${page}/${totalPages} (${templates.length}/${totalWorkflows})…\r`
    );
    const data = await fetchJSON(
      `${SEARCH_ENDPOINT}?page=${page}&rows=${PAGE_SIZE}`
    );
    if (data.workflows) {
      templates.push(...data.workflows);
    }
    await sleep(RATE_LIMIT_MS);
  }
  console.log(`\n   ✅ Collected metadata for ${templates.length} templates`);

  if (FLAG_DRY_RUN) {
    console.log("\n🏁 Dry run — skipping downloads.");
    console.log(`   Would download ${templates.length} workflows.`);
    process.exit(0);
  }

  // ---- 3. Download full workflow definitions ----
  const existingIds = FLAG_RESUME ? existingTemplateIds() : new Set();
  if (FLAG_RESUME && existingIds.size > 0) {
    console.log(`\n♻️  Resume mode — skipping ${existingIds.size} already-downloaded templates`);
  }

  console.log("\n📦 Downloading workflow definitions…");
  const catalog = [];
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < templates.length; i++) {
    const tmpl = templates[i];
    const id = tmpl.id;

    if (FLAG_RESUME && existingIds.has(id)) {
      skipped++;
      continue;
    }

    const slug = slugify(tmpl.name || `workflow_${id}`);
    const filename = `${String(id).padStart(4, "0")}_${slug}.json`;
    const filepath = join(TEMPLATES_DIR, filename);

    process.stdout.write(
      `   [${i + 1}/${templates.length}] #${id} ${(tmpl.name || "").substring(0, 50)}…\r`
    );

    try {
      const detail = await fetchJSON(DETAIL_ENDPOINT(id));
      const workflow = detail.workflow || detail;

      // Enrich with template metadata
      const record = {
        _templateId: id,
        _templateName: tmpl.name,
        _templateDescription: tmpl.description || "",
        _templateCreatedAt: tmpl.createdAt,
        _templateTotalViews: tmpl.totalViews,
        _templateCategory: tmpl.categories
          ? tmpl.categories.map((c) => c.name || c)
          : [],
        _fetchedAt: new Date().toISOString(),
        ...workflow,
      };

      writeFileSync(filepath, JSON.stringify(record, null, 2) + "\n");
      downloaded++;

      catalog.push({
        id,
        name: tmpl.name,
        description: tmpl.description || "",
        categories: record._templateCategory,
        filename,
      });
    } catch (err) {
      console.error(`\n   ❌ Failed #${id}: ${err.message}`);
      failed++;
    }

    await sleep(RATE_LIMIT_MS);
  }

  // If resuming, merge existing catalog entries
  if (FLAG_RESUME && existsSync(CATALOG_FILE)) {
    try {
      const prev = JSON.parse(readFileSync(CATALOG_FILE, "utf-8"));
      const newIds = new Set(catalog.map((c) => c.id));
      for (const entry of prev.workflows || []) {
        if (!newIds.has(entry.id)) {
          catalog.push(entry);
        }
      }
    } catch {
      // ignore corrupt catalog
    }
  }

  // Sort catalog by id
  catalog.sort((a, b) => a.id - b.id);

  // ---- 4. Write catalog index ----
  const catalogData = {
    _generatedAt: new Date().toISOString(),
    totalTemplates: catalog.length,
    source: "https://n8n.io/workflows",
    apiBase: API_BASE,
    workflows: catalog,
  };
  writeFileSync(CATALOG_FILE, JSON.stringify(catalogData, null, 2) + "\n");

  // ---- 5. Summary ----
  console.log("\n\n" + "=".repeat(50));
  console.log("📊 Fetch Summary");
  console.log(`   ✅ Downloaded: ${downloaded}`);
  if (skipped) console.log(`   ♻️  Skipped:    ${skipped}`);
  if (failed) console.log(`   ❌ Failed:     ${failed}`);
  console.log(`   📁 Total in catalog: ${catalog.length}`);
  console.log(`   📂 Location: workflows/templates/`);
  console.log(`   📋 Catalog:  workflows/templates/catalog.json`);

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("\n💥 Fatal error:", err);
  process.exit(1);
});
