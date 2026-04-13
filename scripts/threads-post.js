#!/usr/bin/env node
/**
 * Threads 自動投稿スクリプト
 * 使い方: node scripts/threads-post.js note-drafts/note_17_lanchester_paper.md
 *
 * 事前準備:
 *   .env.local に THREADS_EMAIL と THREADS_PASSWORD を設定
 *   例: THREADS_EMAIL=your@email.com
 *       THREADS_PASSWORD=yourpassword
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
    process.exit(1);
  }
  const lines = readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const [k, ...v] = line.split("=");
    if (k && v.length) process.env[k.trim()] = v.join("=").trim();
  }
}

// Markdownをパースしてথreads用テキストを生成
function toThreadsText(filePath) {
  const raw = readFileSync(resolve(root, filePath), "utf-8");

  // コメントブロック除去
  const stripped = raw.replace(/<!--[\s\S]*?-->/g, "").trim();
  const lines = stripped.split("\n").filter(l => l.trim());

  // タイトル抽出
  let title = "";
  const bodyLines = [];
  for (const line of lines) {
    if (!title && line.startsWith("# ")) {
      title = line.replace(/^#\s+/, "").trim();
    } else if (!line.startsWith("#") && !line.startsWith("▷")) {
      bodyLines.push(line.trim());
    }
  }

  // 本文から段落を抽出（---区切りを除く）
  const paragraphs = bodyLines
    .filter(l => l && l !== "---" && !l.startsWith("##"))
    .slice(0, 6);

  // Threads用テキストを組み立て（500文字以内）
  const intro = paragraphs.slice(0, 4).join("\n\n");
  const cta = "\n\n続きはnoteで読めます。";

  let text = `${title}\n\n${intro}${cta}`;

  // 500文字を超えたらトリム
  if (text.length > 500) {
    const maxBody = 500 - title.length - cta.length - 4;
    const trimmed = intro.substring(0, maxBody).replace(/[^\n]*$/, "…");
    text = `${title}\n\n${trimmed}${cta}`;
  }

  return text;
}

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error("使い方: node scripts/threads-post.js <ファイルパス>");
    console.error("例:     node scripts/threads-post.js note-drafts/note_17_lanchester_paper.md");
    process.exit(1);
  }

  loadEnv();

  const email = process.env.THREADS_EMAIL;
  const password = process.env.THREADS_PASSWORD;
  if (!email || !password) {
    console.error("❌ .env.local に THREADS_EMAIL / THREADS_PASSWORD が設定されていません");
    process.exit(1);
  }

  const text = toThreadsText(filePath);
  console.log("📝 投稿テキスト（プレビュー）:");
  console.log("─────────────────────────────");
  console.log(text);
  console.log("─────────────────────────────");
  console.log(`文字数: ${text.length}`);
  console.log("");

  const browser = await chromium.launch({ headless: false, slowMo: 80 });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // --- ログイン（手動）---
    console.log("🔑 ブラウザが開きます。Threadsにログインしてください。");
    await page.goto("https://www.threads.net/login");
    await page.waitForLoadState("domcontentloaded");

    console.log("   ➡  ログインが完了したら Enter を押してください...");
    await new Promise(resolve => {
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.once("data", () => {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        resolve();
      });
    });

    // ログイン確認
    const currentUrl = page.url();
    if (currentUrl.includes("login") || currentUrl.includes("accounts.instagram")) {
      console.error("❌ まだログインされていないようです。再度試してください");
      await browser.close();
      process.exit(1);
    }
    console.log("✅ ログイン確認");

    // --- 新規スレッド作成 ---
    console.log("✏️  新規スレッドを作成中...");
    await page.waitForTimeout(2000);

    // 投稿ボタン or 入力エリアをクリック
    const newThreadBtn = page.locator(
      'a[href="/intent/post"], [aria-label="新しいスレッド"], [aria-label="New thread"], svg[aria-label*="スレッド"], div[role="button"]:has-text("スレッドを投稿"), div[role="button"]:has-text("What\'s new")'
    ).first();

    const hasBtn = await newThreadBtn.isVisible({ timeout: 5000 }).catch(() => false);
    if (hasBtn) {
      await newThreadBtn.click();
      await page.waitForTimeout(1500);
    } else {
      // ホームの入力エリアを直接クリック
      const homeInput = page.locator('div[contenteditable="true"], textarea[placeholder]').first();
      await homeInput.click();
    }

    // --- テキスト入力 ---
    await page.waitForTimeout(1000);
    const editor = page.locator('div[contenteditable="true"], textarea').first();
    await editor.waitFor({ timeout: 10000 });
    await editor.click();

    // クリップボード経由でペースト
    await page.evaluate((t) => {
      navigator.clipboard.writeText(t).catch(() => {});
    }, text);
    await page.keyboard.press("Meta+v");
    await page.waitForTimeout(1000);

    // ペーストできていなければ直接入力
    const content = await editor.textContent().catch(() => "");
    if (!content?.trim()) {
      await editor.pressSequentially(text.substring(0, 200), { delay: 10 });
    }
    console.log("✅ テキスト入力完了");

    await page.waitForTimeout(2000);

    console.log(`\n🎉 完了！ブラウザで確認して「投稿」または「下書き保存」してください`);
    console.log("   確認できたら Ctrl+C で終了してください\n");

    // ブラウザを開いたまま待機
    await page.waitForTimeout(60000);

  } catch (err) {
    console.error("❌ エラー:", err.message);
    await page.waitForTimeout(5000);
  }

  await browser.close();
}

main();
