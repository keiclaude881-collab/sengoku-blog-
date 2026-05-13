#!/usr/bin/env node
/**
 * Substack 一括下書き投稿スクリプト（AppleScript経由でChrome操作）
 * 使い方: node scripts/substack-batch.js --all
 *
 * 事前条件: ChromeでSubstackにログイン済みであること
 */

import { readFileSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const DRAFTS_DIR = resolve(root, "note-drafts");
const PUBLICATION_URL = "https://senryaku.substack.com";

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function runAppleScript(script) {
  return execSync(`osascript -e '${script.replace(/'/g, "'\\''")}'`, { encoding: "utf-8" }).trim();
}


function chromeJS(js) {
  // AppleScriptでChromeにJSを実行させる
  const escaped = js.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
  const script = `tell application "Google Chrome" to execute active tab of front window javascript "${escaped}"`;
  try {
    return execSync(`osascript -e '${script.replace(/'/g, "'\\''")}'`, { encoding: "utf-8" }).trim();
  } catch (e) {
    return null;
  }
}

function chromeNavigate(url) {
  execSync(`osascript -e 'tell application "Google Chrome" to set URL of active tab of front window to "${url}"'`);
}

function parseDraft(filePath) {
  const raw = readFileSync(resolve(root, filePath), "utf-8");
  const stripped = raw.replace(/<!--[\s\S]*?-->/g, "").trim();
  const lines = stripped.split("\n");
  let title = "";
  let bodyLines = [];
  for (let i = 0; i < lines.length; i++) {
    if (!title && lines[i].startsWith("# ")) {
      title = lines[i].replace(/^#\s+/, "").trim();
    } else {
      bodyLines.push(lines[i]);
    }
  }
  while (bodyLines.length && !bodyLines[0].trim()) bodyLines.shift();
  return { title, body: bodyLines.join("\n").trim() };
}

async function postDraft(filePath) {
  const { title, body } = parseDraft(filePath);
  console.log(`\n📝 ${title}`);

  // 新規投稿ページへ
  chromeNavigate(`${PUBLICATION_URL}/publish/post/new`);
  await sleep(4000);

  // タイトル入力
  const titleJs = `
    (function() {
      var titleEl = document.querySelector('[data-testid="post-title-input"], h1[contenteditable="true"], [placeholder="Title"], .editor-title, div[data-placeholder="Title"]');
      if (!titleEl) return 'NOT_FOUND';
      titleEl.focus();
      titleEl.click();
      document.execCommand('selectAll', false, null);
      document.execCommand('insertText', false, ${JSON.stringify(title)});
      return 'OK';
    })()
  `;
  const titleResult = chromeJS(titleJs);
  if (titleResult === "NOT_FOUND") {
    throw new Error("タイトル欄が見つかりません");
  }
  await sleep(500);

  // 本文入力
  const bodyJs = `
    (function() {
      var bodyEl = document.querySelector('.ProseMirror');
      if (!bodyEl) return 'NOT_FOUND';
      bodyEl.focus();
      bodyEl.click();
      var dt = new DataTransfer();
      dt.setData('text/plain', ${JSON.stringify(body)});
      bodyEl.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true }));
      return 'OK';
    })()
  `;
  const bodyResult = chromeJS(bodyJs);
  if (bodyResult === "NOT_FOUND") {
    throw new Error("本文欄が見つかりません");
  }

  // 自動保存待ち
  await sleep(5000);
  console.log("✅ 保存完了");
}

async function main() {
  const files = readdirSync(DRAFTS_DIR)
    .filter((f) => f.endsWith(".md") && f !== "publish-schedule.md")
    .sort()
    .map((f) => `note-drafts/${f}`);

  console.log(`📂 投稿対象: ${files.length}件\n`);

  // Chromeでログイン確認
  let currentUrl;
  try {
    currentUrl = runAppleScript("tell application \"Google Chrome\" to return URL of active tab of front window");
  } catch {
    // Chromeを起動してSubstackへ
    execSync(`open -a "Google Chrome" "${PUBLICATION_URL}"`);
    await sleep(3000);
    currentUrl = runAppleScript("tell application \"Google Chrome\" to return URL of active tab of front window");
  }

  console.log("現在のURL:", currentUrl);
  if (currentUrl.includes("sign-in") || currentUrl.includes("login")) {
    console.error("❌ Substackにログインしてください。ChromeでSubstackを開いてログインしてから再実行してください。");
    process.exit(1);
  }
  console.log("✅ ログイン確認OK\n▶ 投稿開始...\n");

  const results = [];
  for (const filePath of files) {
    try {
      await postDraft(filePath);
      results.push({ file: filePath, ok: true });
    } catch (err) {
      console.error(`❌ ${filePath}: ${err.message}`);
      results.push({ file: filePath, ok: false });
    }
    await sleep(2000);
  }

  console.log("\n========== 結果 ==========");
  results.forEach((r) => console.log(`${r.ok ? "✅" : "❌"} ${r.file}`));
  const failed = results.filter((r) => !r.ok).length;
  console.log(failed === 0 ? "\n🎉 全件完了！" : `\n⚠️  ${failed}件失敗`);
}

main().catch(console.error);
