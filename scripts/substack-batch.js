#!/usr/bin/env node
/**
 * Substack 一括下書き投稿スクリプト（1回ログインで複数記事投稿）
 * 使い方: node scripts/substack-batch.js note-drafts/note_01.md note-drafts/note_02.md ...
 *        node scripts/substack-batch.js --all   （全ファイル）
 *
 * 事前準備:
 *   .env.local に SUBSTACK_EMAIL と SUBSTACK_PASSWORD を設定
 */

import { chromium } from "playwright";
import { readFileSync, existsSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const DRAFTS_DIR = resolve(root, "note-drafts");
const PUBLICATION_URL = "https://ketsudankeifu.substack.com";

function loadEnv() {
  const envPath = resolve(root, ".env.local");
  if (!existsSync(envPath)) {
    console.error("❌ .env.local が見つかりません");
    process.exit(1);
  }
  const lines = readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const [k, ...v] = line.split("=");
    if (k && v.length) process.env[k.trim()] = v.join("=").trim();
  }
}

function parseDraft(filePath) {
  const raw = readFileSync(resolve(root, filePath), "utf-8");
  // HTMLコメント除去
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
  const body = bodyLines.join("\n").trim();
  return { title, body };
}

async function postDraft(page, filePath) {
  const { title, body } = parseDraft(filePath);
  console.log(`\n📝 タイトル: ${title}`);
  console.log(`📄 本文: ${body.length}文字`);

  // 新規投稿エディタへ
  console.log("✏️  エディタを開いています...");
  await page.goto(`${PUBLICATION_URL}/publish/post/new`);
  await page.waitForLoadState("networkidle", { timeout: 30000 });
  await page.waitForTimeout(2000);
  console.log("🌐 エディタURL:", page.url());

  // タイトル入力
  const titleEl = page.locator('[data-testid="post-title-input"], .editor-title, h1[contenteditable="true"], [placeholder="Title"]').first();
  await titleEl.waitFor({ timeout: 20000 });
  await titleEl.click();
  await page.waitForTimeout(300);
  await titleEl.fill("");
  await titleEl.type(title, { delay: 10 });
  console.log("✅ タイトル入力完了");
  await page.waitForTimeout(500);

  // 本文エリアへ移動
  const bodyEl = page.locator('.ProseMirror').first();
  await bodyEl.waitFor({ timeout: 15000 });
  await bodyEl.click();
  await page.waitForTimeout(300);

  // クリップボード経由でペースト
  await page.evaluate((text) => {
    const dt = new DataTransfer();
    dt.setData("text/plain", text);
    const el = document.querySelector(".ProseMirror");
    if (el) {
      el.focus();
      el.dispatchEvent(new ClipboardEvent("paste", { clipboardData: dt, bubbles: true }));
    }
  }, body);
  await page.waitForTimeout(1000);

  // フォールバック: 直接タイプ（重い場合はスキップ）
  const editorText = await bodyEl.textContent().catch(() => "");
  if (!editorText || editorText.trim().length < 20) {
    console.log("📋 フォールバック: keyboard入力...");
    await bodyEl.click();
    await page.keyboard.press("Control+a");
    await page.keyboard.type(body.substring(0, 500), { delay: 5 });
    console.log("⚠️  本文が長いため先頭500文字のみ入力。手動で残りを貼り付けてください");
  }
  console.log("✅ 本文入力完了");

  // 下書き保存
  console.log("💾 下書き保存中...");
  await page.waitForTimeout(1000);

  // Substackの「Save」または自動保存を確認
  const saveBtn = page.locator('button:has-text("Save"), button:has-text("下書き保存"), [data-testid="save-button"]').first();
  const hasSaveBtn = await saveBtn.count();
  if (hasSaveBtn > 0) {
    await saveBtn.click();
    await page.waitForTimeout(2000);
    console.log("✅ 保存ボタンクリック完了");
  } else {
    // Substackは自動保存があるので少し待つ
    await page.waitForTimeout(3000);
    console.log("✅ 自動保存待機完了");
  }

  console.log(`🎉 完了！`);
}

async function main() {
  let files = process.argv.slice(2);

  if (files.includes("--all")) {
    // note-drafts/ 内の全 .md ファイル（publish-schedule.md を除く）
    files = readdirSync(DRAFTS_DIR)
      .filter((f) => f.endsWith(".md") && f !== "publish-schedule.md")
      .sort()
      .map((f) => `note-drafts/${f}`);
    console.log(`📂 全ファイル: ${files.length}件`);
  }

  if (!files.length) {
    console.error("使い方: node scripts/substack-batch.js <ファイル1> <ファイル2> ...");
    console.error("        node scripts/substack-batch.js --all");
    process.exit(1);
  }

  loadEnv();

  const email = process.env.SUBSTACK_EMAIL;
  const password = process.env.SUBSTACK_PASSWORD;
  if (!email || !password) {
    console.error("❌ .env.local に SUBSTACK_EMAIL / SUBSTACK_PASSWORD が設定されていません");
    process.exit(1);
  }

  const browser = await chromium.launch({ headless: false, slowMo: 60 });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // ログイン
    console.log("🔑 Substackにログイン中...");
    await page.goto("https://substack.com/sign-in");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2000);

    // メールアドレス入力
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    await emailInput.waitFor({ timeout: 15000 });
    await emailInput.fill(email);

    // 「続ける」ボタンまたはパスワード入力へ進む
    const continueBtn = page.locator('button:has-text("Continue"), button:has-text("続ける"), button[type="submit"]').first();
    await continueBtn.click();
    await page.waitForTimeout(2000);

    // パスワード入力（表示された場合）
    const passInput = page.locator('input[type="password"], input[name="password"]').first();
    const hasPass = await passInput.count();
    if (hasPass > 0) {
      await passInput.fill(password);
      const signInBtn = page.locator('button:has-text("Sign in"), button:has-text("ログイン"), button[type="submit"]').first();
      await signInBtn.click();
      await page.waitForTimeout(4000);
    } else {
      console.log("⚠️  パスワード欄が見つかりません。マジックリンク方式の可能性があります。");
      console.log("   ブラウザでメールを確認してログインしてください（60秒待機）...");
      await page.waitForTimeout(60000);
    }

    // ログイン確認
    const currentUrl = page.url();
    if (currentUrl.includes("sign-in") || currentUrl.includes("login")) {
      console.error("❌ ログイン失敗。メールアドレスとパスワードを確認してください");
      await browser.close();
      process.exit(1);
    }
    console.log("✅ ログイン成功");

    // 各ファイルを順番に投稿
    const results = [];
    for (const filePath of files) {
      try {
        await postDraft(page, filePath);
        results.push({ file: filePath, ok: true });
      } catch (err) {
        console.error(`❌ エラー [${filePath}]:`, err.message);
        await page.screenshot({ path: `/tmp/substack-error-${Date.now()}.png` }).catch(() => {});
        results.push({ file: filePath, ok: false, error: err.message });
      }
      // 記事間インターバル
      await page.waitForTimeout(3000);
    }

    // 結果サマリー
    console.log("\n========== 結果 ==========");
    for (const r of results) {
      const icon = r.ok ? "✅" : "❌";
      console.log(`${icon} ${r.file}`);
      if (!r.ok) console.log(`   → ${r.error}`);
    }
    const failed = results.filter((r) => !r.ok);
    if (failed.length === 0) {
      console.log("\n🎉 全件完了！");
    } else {
      console.log(`\n⚠️  ${failed.length}件失敗`);
    }
  } catch (err) {
    console.error("❌ 致命的エラー:", err.message);
    await page.screenshot({ path: `/tmp/substack-fatal-${Date.now()}.png` }).catch(() => {});
  }

  await page.waitForTimeout(2000);
  await browser.close();
}

main();
