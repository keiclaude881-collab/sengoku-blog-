#!/usr/bin/env node
/**
 * Substack 一括下書き投稿スクリプト
 * 使い方: node scripts/substack-batch.js --all
 *
 * Chromeにログイン済みのセッションをそのまま使う（パスワード不要）
 */

import { chromium } from "playwright";
import { readFileSync, readdirSync } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";
import { homedir } from "os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const DRAFTS_DIR = resolve(root, "note-drafts");
const PUBLICATION_URL = "https://ketsudankeifu.substack.com";

// MacのChromeプロファイルパス
const CHROME_PROFILE = join(homedir(), "Library/Application Support/Google/Chrome");

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

async function postDraft(page, filePath) {
  const { title, body } = parseDraft(filePath);
  console.log(`\n📝 ${title}`);

  await page.goto(`${PUBLICATION_URL}/publish/post/new`);
  await page.waitForLoadState("networkidle", { timeout: 30000 });
  await page.waitForTimeout(2000);

  // タイトル
  const titleEl = page.locator('h1[contenteditable], [data-testid="post-title-input"], [placeholder="Title"]').first();
  await titleEl.waitFor({ timeout: 20000 });
  await titleEl.click();
  await page.keyboard.press("Control+a");
  await page.keyboard.type(title, { delay: 15 });
  await page.waitForTimeout(500);

  // 本文
  const bodyEl = page.locator('.ProseMirror').first();
  await bodyEl.waitFor({ timeout: 15000 });
  await bodyEl.click();
  await page.waitForTimeout(300);
  await page.evaluate((text) => {
    const dt = new DataTransfer();
    dt.setData("text/plain", text);
    const el = document.querySelector(".ProseMirror");
    if (el) {
      el.focus();
      el.dispatchEvent(new ClipboardEvent("paste", { clipboardData: dt, bubbles: true }));
    }
  }, body);
  await page.waitForTimeout(2000);
  await page.waitForTimeout(3000);
  console.log("✅ 保存完了");
}

async function main() {
  const files = readdirSync(DRAFTS_DIR)
    .filter((f) => f.endsWith(".md") && f !== "publish-schedule.md")
    .sort()
    .map((f) => `note-drafts/${f}`);

  console.log(`\n📂 投稿対象: ${files.length}件`);
  console.log("🌐 Chromeのセッションを使ってログイン済み状態で起動...\n");

  // ブラウザ起動
  const browser = await chromium.launch({ headless: false, slowMo: 50 });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Substackログインページへ
  await page.goto("https://substack.com/sign-in");
  await page.waitForLoadState("domcontentloaded");

  // ログイン完了を待機（最大5分）
  console.log("🌐 ブラウザが開きました。Substackにログインしてください。");
  console.log("   ログインが完了すると自動で投稿を開始します。\n");
  let loggedIn = false;
  for (let i = 0; i < 300; i++) {
    await page.waitForTimeout(1000);
    const url = page.url();
    if (!url.includes("sign-in") && !url.includes("login") && !url.includes("substack.com/?")) {
      loggedIn = true;
      console.log("✅ ログイン検出！すぐに開始します。");
      break;
    }
    if (i % 10 === 0 && i > 0) {
      process.stdout.write(`\r⏳ ${300 - i}秒待機中...`);
    }
  }
  process.stdout.write("\n");

  if (!loggedIn) {
    console.error("❌ ログインが確認できませんでした。");
    await browser.close();
    process.exit(1);
  }
  console.log("✅ ログイン確認OK\n▶ 投稿開始...");

  const results = [];
  for (const filePath of files) {
    try {
      await postDraft(page, filePath);
      results.push({ file: filePath, ok: true });
    } catch (err) {
      console.error(`❌ ${filePath}: ${err.message}`);
      results.push({ file: filePath, ok: false });
    }
    await page.waitForTimeout(2000);
  }

  console.log("\n========== 結果 ==========");
  results.forEach((r) => console.log(`${r.ok ? "✅" : "❌"} ${r.file}`));
  const failed = results.filter((r) => !r.ok).length;
  console.log(failed === 0 ? "\n🎉 全件完了！" : `\n⚠️  ${failed}件失敗`);

  await page.waitForTimeout(3000);
  await browser.close();
}

main().catch(console.error);
