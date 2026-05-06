#!/usr/bin/env node
/**
 * note.com 自動下書き投稿スクリプト
 * 使い方: node scripts/note-post.js note-drafts/note_01_cannae_beginner.md
 *
 * 事前準備:
 *   .env.local に NOTE_EMAIL と NOTE_PASSWORD を設定
 *   例: NOTE_EMAIL=your@email.com
 *       NOTE_PASSWORD=yourpassword
 */

import { chromium } from "playwright";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// .env.local 読み込み
function loadEnv() {
  const envPath = resolve(root, ".env.local");
  if (!existsSync(envPath)) {
    console.error("❌ .env.local が見つかりません");
    console.error("   .env.local に NOTE_EMAIL と NOTE_PASSWORD を設定してください");
    process.exit(1);
  }
  const lines = readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const [k, ...v] = line.split("=");
    if (k && v.length) process.env[k.trim()] = v.join("=").trim();
  }
}

// Markdownファイルをパース
function parseDraft(filePath) {
  const raw = readFileSync(resolve(root, filePath), "utf-8");

  // OGPコメントブロック除去
  const stripped = raw.replace(/<!--[\s\S]*?-->/g, "").trim();

  // 1行目の # タイトルを抽出
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

  // 先頭の空行を除去
  while (bodyLines.length && !bodyLines[0].trim()) bodyLines.shift();

  const body = bodyLines.join("\n").trim();
  return { title, body };
}

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error("使い方: node scripts/note-post.js <ファイルパス>");
    console.error("例:     node scripts/note-post.js note-drafts/note_01_cannae_beginner.md");
    process.exit(1);
  }

  loadEnv();

  const email = process.env.NOTE_EMAIL;
  const password = process.env.NOTE_PASSWORD;
  if (!email || !password) {
    console.error("❌ .env.local に NOTE_EMAIL / NOTE_PASSWORD が設定されていません");
    process.exit(1);
  }

  const { title, body } = parseDraft(filePath);
  console.log(`📝 タイトル: ${title}`);
  console.log(`📄 本文: ${body.length}文字`);

  // editor.note.com は headless だとロードしないため headless: false
  const browser = await chromium.launch({ headless: false, slowMo: 60 });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // --- ログイン ---
    console.log("🔑 note.comにログイン中...");
    await page.goto("https://note.com/login?redirectPath=%2F");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2000);

    const emailInput = page.locator('#email');
    await emailInput.waitFor({ timeout: 15000 });
    await emailInput.fill(email);

    const passInput = page.locator('#password');
    await passInput.fill(password);

    const loginBtn = page.locator('button:has-text("ログイン")').first();
    await loginBtn.click();
    await page.waitForTimeout(4000);

    if (page.url().includes("login")) {
      console.error("❌ ログイン失敗。メールアドレスとパスワードを確認してください");
      await browser.close();
      process.exit(1);
    }
    console.log("✅ ログイン成功");

    // --- 新規投稿ページ（editor.note.com へリダイレクト）---
    console.log("✏️  エディタを開いています...");
    await page.goto("https://note.com/notes/new");
    // editor.note.com へのリダイレクト完了を待つ
    await page.waitForURL("**/editor.note.com/**", { timeout: 20000 }).catch(() => {});
    console.log("🌐 エディタURL:", page.url());

    // エディタのロード完了待ち（最大25秒）
    await page.waitForSelector('textarea[placeholder="記事タイトル"]', { timeout: 25000 });
    await page.waitForTimeout(1000);
    console.log("✅ エディタ読み込み完了");

    // --- タイトル入力 ---
    const titleEl = page.locator('textarea[placeholder="記事タイトル"]');
    await titleEl.click();
    await titleEl.fill(title);
    console.log("✅ タイトル入力完了");
    await page.waitForTimeout(500);

    // --- 本文入力（ProseMirrorエディタ）---
    const bodyEl = page.locator('.ProseMirror');
    await bodyEl.click();
    await page.waitForTimeout(300);

    // クリップボード経由でペースト（最も確実）
    await page.evaluate((text) => {
      const dt = new DataTransfer();
      dt.setData('text/plain', text);
      const el = document.querySelector('.ProseMirror');
      if (el) el.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true }));
    }, body);
    await page.waitForTimeout(800);

    // クリップボードペーストが効かない場合のフォールバック
    const editorText = await bodyEl.textContent().catch(() => "");
    if (!editorText || editorText.trim().length < 10) {
      console.log("📋 フォールバック: Ctrl+V でペースト...");
      await page.evaluate((text) => navigator.clipboard.writeText(text), body);
      await bodyEl.click();
      await page.keyboard.press("Control+a");
      await page.keyboard.press("Control+v");
      await page.waitForTimeout(1000);
    }
    console.log("✅ 本文入力完了");

    // --- 下書き保存 ---
    console.log("💾 下書き保存中...");
    await page.waitForTimeout(1000);
    const saveBtn = page.locator('button:has-text("下書き保存")').first();
    await saveBtn.waitFor({ timeout: 5000 });
    await saveBtn.click();
    await page.waitForTimeout(2000);
    console.log("✅ 下書き保存完了");

    console.log(`\n🎉 完了！note.comの下書きに保存されました。`);
    await page.waitForTimeout(2000);

  } catch (err) {
    console.error("❌ エラー:", err.message);
    await page.screenshot({ path: "/tmp/note-error.png" }).catch(() => {});
    await page.waitForTimeout(2000);
  }

  await browser.close();
}

main();
