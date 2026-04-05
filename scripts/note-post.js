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

  const browser = await chromium.launch({ headless: false, slowMo: 80 });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // --- ログイン ---
    console.log("🔑 note.comにログイン中...");
    await page.goto("https://note.com/login?redirectPath=%2F");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2000);

    // メールアドレス入力欄 (id="email", type="text")
    const emailInput = page.locator('#email');
    await emailInput.waitFor({ timeout: 15000 });
    await emailInput.fill(email);

    // パスワード入力欄
    const passInput = page.locator('#password');
    await passInput.fill(password);

    // ログインボタン（text="ログイン"）
    const loginBtn = page.locator('button:has-text("ログイン")').first();
    await loginBtn.click();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    if (page.url().includes("login")) {
      console.error("❌ ログイン失敗。メールアドレスとパスワードを確認してください");
      await browser.close();
      process.exit(1);
    }
    console.log("✅ ログイン成功");

    // --- 新規投稿ページへ ---
    console.log("✏️  新規投稿ページを開いています...");
    await page.goto("https://note.com/notes/new");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // --- タイトル入力 ---
    const titleSelector = 'textarea[placeholder], [data-placeholder="タイトル"], .p-articleEditor__title textarea, .editor-title';
    await page.waitForSelector(titleSelector, { timeout: 10000 }).catch(() => null);

    // タイトル欄をクリックして入力
    const titleEl = page.locator('textarea').first();
    await titleEl.click();
    await titleEl.fill(title);
    console.log("✅ タイトル入力完了");

    await page.waitForTimeout(500);

    // --- 本文入力（クリップボード経由）---
    // note.comのエディタはcontenteditable。クリップボードペーストが最も確実
    await page.evaluate((text) => {
      navigator.clipboard.writeText(text).catch(() => {});
    }, body);

    // 本文エリアをクリック（Tabキーでフォーカス移動も試みる）
    await page.keyboard.press("Tab");
    await page.waitForTimeout(300);

    // Cmd+V でペースト
    await page.keyboard.press("Meta+v");
    await page.waitForTimeout(1000);

    // ペーストできていなければ直接タイプ（フォールバック）
    const editorContent = await page.evaluate(() => {
      const editor = document.querySelector('[contenteditable="true"]');
      return editor ? editor.textContent.trim() : "";
    });

    if (!editorContent) {
      console.log("📋 クリップボードペースト失敗。直接入力を試みます...");
      const editorEl = page.locator('[contenteditable="true"]').last();
      await editorEl.click();
      await editorEl.pressSequentially(body.substring(0, 500), { delay: 5 }); // 最初の500文字だけ（確認用）
    } else {
      console.log("✅ 本文ペースト完了");
    }

    await page.waitForTimeout(1000);

    // --- 下書き保存 ---
    console.log("💾 下書き保存中...");
    // note.comは自動保存されるが、明示的に保存ボタンがあれば押す
    const saveButton = page.locator('button:has-text("下書き保存"), button:has-text("保存")').first();
    const hasSaveButton = await saveButton.isVisible().catch(() => false);
    if (hasSaveButton) {
      await saveButton.click();
      await page.waitForTimeout(2000);
      console.log("✅ 下書き保存ボタンをクリックしました");
    } else {
      // 自動保存を待つ
      await page.waitForTimeout(3000);
      console.log("✅ 自動保存を待ちました");
    }

    console.log(`\n🎉 完了！ブラウザを確認してください`);
    console.log("   問題なければ Ctrl+C で終了してください\n");

    // ブラウザを開いたまま待機
    await page.waitForTimeout(3000);

  } catch (err) {
    console.error("❌ エラー:", err.message);
    console.log("   ブラウザを確認してください（30秒後に閉じます）");
    await page.waitForTimeout(3000);
  }

  await browser.close();
}

main();
