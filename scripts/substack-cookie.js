#!/usr/bin/env node
/**
 * Substack 下書き一括投稿（Cookie直接指定版）
 * 使い方: node scripts/substack-cookie.js
 */

import { readFileSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root      = resolve(__dirname, "..");
const DRAFTS_DIR = resolve(root, "note-drafts");
const PUB_URL   = "https://senryaku.substack.com";

// ── Cookie ──────────────────────────────────────
const SID = "s%3A9-DMvHTI7uVT6Sd_oHa56TG5LYbbN3Jz.2mNwuva32zKfFAX8%2Fzh28g4XzyKSZqAg6ICKMcopjMg";
const COOKIE_HEADER = `substack.sid=${SID}`;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Markdown → HTML ──────────────────────────────
function mdToHtml(md) {
  const blocks = [];
  let buf = [];
  const flush = () => {
    if (!buf.length) return;
    const t = buf.join("\n").trim();
    if (t) blocks.push(`<p>${t.replace(/\n/g, "<br>")}</p>`);
    buf = [];
  };
  for (const line of md.split("\n")) {
    if      (line.startsWith("### ")) { flush(); blocks.push(`<h3>${line.slice(4).trim()}</h3>`); }
    else if (line.startsWith("## "))  { flush(); blocks.push(`<h2>${line.slice(3).trim()}</h2>`); }
    else if (line.startsWith("# "))   { flush(); blocks.push(`<h2>${line.slice(2).trim()}</h2>`); }
    else if (line.trim() === "---")   { flush(); blocks.push("<hr>"); }
    else if (line.trim() === "")      { flush(); }
    else                              { buf.push(line); }
  }
  flush();
  return blocks.join("\n");
}

// ── note-drafts/*.md パース ───────────────────────
function parseDraft(filePath) {
  const raw      = readFileSync(filePath, "utf-8");
  const stripped = raw.replace(/<!--[\s\S]*?-->/g, "").trim();
  const lines    = stripped.split("\n");
  let title = "";
  const body = [];
  for (const line of lines) {
    if (!title && line.startsWith("# ")) { title = line.replace(/^#\s+/, "").trim(); }
    else                                 { body.push(line); }
  }
  while (body.length && !body[0].trim()) body.shift();
  const bodyStr = body.join("\n").trim();
  return { title, html: mdToHtml(bodyStr) };
}

// ── Substack API で下書き作成 ─────────────────────
async function createDraft(title, html) {
  const res = await fetch(`${PUB_URL}/api/v1/draft`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cookie": COOKIE_HEADER,
    },
    body: JSON.stringify({
      draft_title:    title,
      draft_body:     html,
      draft_subtitle: "",
      audience:       "everyone",
      type:           "newsletter",
    }),
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text.slice(0, 300) }; }
  return { status: res.status, data };
}

// ── メイン ──────────────────────────────────────
async function main() {
  const files = readdirSync(DRAFTS_DIR)
    .filter(f => f.endsWith(".md") && f !== "publish-schedule.md")
    .sort();

  console.log(`📂 投稿対象: ${files.length}件\n`);

  // 認証確認
  const me = await fetch(`${PUB_URL}/api/v1/me`, {
    headers: { "Cookie": COOKIE_HEADER },
  }).then(r => r.json()).catch(() => null);

  if (!me?.id) {
    console.error("❌ 認証失敗。Cookieが期限切れかもしれません。");
    console.error("   Chrome で senryaku.substack.com を開き直してCookieを再取得してください。");
    process.exit(1);
  }
  console.log(`✅ ログイン確認: ${me.email}\n`);

  const results = [];
  for (const file of files) {
    const { title, html } = parseDraft(resolve(DRAFTS_DIR, file));
    if (!title) { console.log(`⚠️  スキップ: ${file}`); continue; }

    process.stdout.write(`📝 ${title.slice(0, 40)}... `);
    const { status, data } = await createDraft(title, html);

    if (status === 200 && data.id) {
      console.log(`✅ (id:${data.id})`);
      results.push({ file, ok: true });
    } else {
      console.log(`❌ ${status} ${JSON.stringify(data).slice(0, 120)}`);
      results.push({ file, ok: false });
    }
    await sleep(1200);
  }

  const failed = results.filter(r => !r.ok).length;
  console.log(`\n========== 結果 ==========`);
  console.log(failed === 0
    ? `🎉 全${results.length}件完了！\n📋 ${PUB_URL}/publish/drafts`
    : `⚠️  ${failed}件失敗`);
}

main().catch(console.error);
