#!/usr/bin/env node
/**
 * Substack API 経由で下書き一括投稿
 * DOM操作なし。fetch() でAPIを直接叩く。
 * ChromeでSubstackにログイン済みであること。
 */

import { readFileSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const DRAFTS_DIR = resolve(root, "note-drafts");
const PUB_URL = "https://senryaku.substack.com";

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

/* ── AppleScript でChromeにJSを実行 ── */
function chromeJS(js) {
  const escaped = js
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "");
  const script = `tell application "Google Chrome" to execute active tab of front window javascript "${escaped}"`;
  try {
    const result = execSync(`osascript -e '${script.replace(/'/g, "'\\''")}'`, {
      encoding: "utf-8",
      timeout: 30000,
    }).trim();
    return result;
  } catch (e) {
    return `ERROR: ${e.message}`;
  }
}

function chromeNavigate(url) {
  execSync(
    `osascript -e 'tell application "Google Chrome" to set URL of active tab of front window to "${url}"'`
  );
}

/* ── Markdown → HTML（シンプル変換） ── */
function mdToHtml(md) {
  const lines = md.split("\n");
  const blocks = [];
  let buf = [];

  function flush() {
    if (!buf.length) return;
    const text = buf.join("\n").trim();
    if (text) blocks.push(`<p>${text.replace(/\n/g, "<br>")}</p>`);
    buf = [];
  }

  for (const line of lines) {
    if (line.startsWith("## ")) { flush(); blocks.push(`<h2>${line.slice(3).trim()}</h2>`); }
    else if (line.startsWith("### ")) { flush(); blocks.push(`<h3>${line.slice(4).trim()}</h3>`); }
    else if (line.startsWith("# ")) { flush(); blocks.push(`<h2>${line.slice(2).trim()}</h2>`); }
    else if (line.trim() === "---") { flush(); blocks.push("<hr>"); }
    else if (line.trim() === "") { flush(); }
    else { buf.push(line); }
  }
  flush();

  return blocks.join("\n");
}

/* ── note-drafts/*.md をパース ── */
function parseDraft(filePath) {
  const raw = readFileSync(filePath, "utf-8");
  const stripped = raw.replace(/<!--[\s\S]*?-->/g, "").trim();
  const lines = stripped.split("\n");
  let title = "";
  const bodyLines = [];

  for (const line of lines) {
    if (!title && line.startsWith("# ")) {
      title = line.replace(/^#\s+/, "").trim();
    } else {
      bodyLines.push(line);
    }
  }

  while (bodyLines.length && !bodyLines[0].trim()) bodyLines.shift();
  const body = bodyLines.join("\n").trim();
  return { title, body, html: mdToHtml(body) };
}

/* ── Substack API で下書き作成 ── */
async function createDraft(title, html) {
  // Chrome が senryaku.substack.com にいる状態で fetch() を実行
  // 同一オリジンなのでクッキーが自動送信される
  const payload = JSON.stringify({
    draft_title: title,
    draft_body: html,
    draft_subtitle: "",
    audience: "everyone",
    type: "newsletter",
    section_chosen: false,
  });

  const js = `
(async function() {
  try {
    const res = await fetch('/api/v1/draft', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: ${JSON.stringify(payload)},
    });
    const data = await res.json();
    if (data.id) return 'OK:' + data.id;
    return 'FAIL:' + JSON.stringify(data).slice(0, 200);
  } catch(e) {
    return 'ERROR:' + e.message;
  }
})()
`;

  const result = chromeJS(js);
  return result;
}

/* ── メイン ── */
async function main() {
  const files = readdirSync(DRAFTS_DIR)
    .filter(f => f.endsWith(".md") && f !== "publish-schedule.md")
    .sort();

  console.log(`📂 投稿対象: ${files.length}件`);

  // Chrome を Substack に誘導
  console.log(`\n🌐 Chromeを ${PUB_URL} に移動します...`);
  chromeNavigate(PUB_URL);
  await sleep(3000);

  // 現在のURLを確認
  let currentUrl;
  try {
    currentUrl = execSync(
      `osascript -e 'tell application "Google Chrome" to return URL of active tab of front window'`,
      { encoding: "utf-8" }
    ).trim();
  } catch {
    currentUrl = "";
  }

  console.log(`現在のURL: ${currentUrl}`);

  if (currentUrl.includes("sign-in") || currentUrl.includes("login")) {
    console.error("❌ ログインしてください");
    process.exit(1);
  }

  console.log("✅ ログイン確認OK\n");

  const results = [];

  for (const file of files) {
    const filePath = resolve(DRAFTS_DIR, file);
    const { title, html } = parseDraft(filePath);

    if (!title) {
      console.log(`⚠️  スキップ（タイトルなし）: ${file}`);
      continue;
    }

    process.stdout.write(`📝 ${title} ... `);
    const result = await createDraft(title, html);

    if (result && result.startsWith("OK:")) {
      const id = result.slice(3);
      console.log(`✅ 作成 (id: ${id})`);
      results.push({ file, title, ok: true, id });
    } else {
      console.log(`❌ 失敗: ${result}`);
      results.push({ file, title, ok: false, error: result });
    }

    await sleep(1500); // API過負荷防止
  }

  console.log("\n========== 結果 ==========");
  results.forEach(r => {
    console.log(`${r.ok ? "✅" : "❌"} ${r.title}`);
  });

  const failed = results.filter(r => !r.ok).length;
  if (failed === 0) {
    console.log(`\n🎉 全${results.length}件完了！`);
    console.log(`📋 下書き確認: ${PUB_URL}/publish/drafts`);
  } else {
    console.log(`\n⚠️  ${failed}件失敗`);
  }
}

main().catch(console.error);
