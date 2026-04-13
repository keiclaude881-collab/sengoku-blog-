#!/usr/bin/env node
/**
 * 既存記事の category フィールドを悩み軸5カテゴリに変換する
 *
 * decide   — 迷い・判断・意思決定
 * lead     — リーダーシップ・部下・人間関係
 * recover  — 逆境・失敗・立て直し
 * strategy — 戦略・情報戦・競合
 * change   — 変革・革新・自分を変える
 *
 * books / movie / anime / novel はそのまま保持
 */
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// ファイルごとのテーマ手動マッピング（自動判定の上書き用）
const MANUAL = {
  // battle
  "battle/okehazama":           "decide",
  "battle/sekigahara":          "strategy",
  "battle/kawanakajima":        "lead",
  "battle/nagashino":           "change",
  "battle/nagashino-sequel":    "change",
  "battle/yamazaki":            "decide",
  "battle/shizugatake":         "strategy",
  "battle/osaka-no-jin":        "strategy",
  "battle/mikatagahara":        "recover",
  "battle/anegawa":             "strategy",
  "battle/toba-fushimi":        "change",
  "battle/marathon":            "strategy",
  "battle/thermopylae":         "decide",
  "battle/gaugamela":           "strategy",
  "battle/cannae":              "strategy",
  "battle/changping":           "strategy",
  "battle/agincourt":           "change",
  "battle/lepanto":             "strategy",
  "battle/zama":                "strategy",
  "battle/waterloo":            "recover",
  "battle/stalingrad":          "recover",
  "battle/midway":              "strategy",
  "battle/normandy":            "decide",
  "battle/austerlitz":          "strategy",
  "battle/trafalgar":           "strategy",
  "battle/azuchi-momoyama-complete": "change",
  // world
  "world/actium":               "strategy",
  "world/ankara":               "recover",
  "world/cannae":               "strategy",
  "world/constantinople":       "change",
  "world/gettysburg":           "decide",
  "world/gaugamela":            "strategy",
  "world/hastings":             "strategy",
  "world/kadesh":               "strategy",
  "world/lepanto":              "strategy",
  "world/marathon":             "strategy",
  "world/plassey":              "strategy",
  "world/thermopylae":          "decide",
  "world/tsushima":             "strategy",
  "world/vienna1683":           "recover",
  "world/waterloo":             "recover",
  "world/yarmouk":              "strategy",
  "world/zama":                 "strategy",
};

// ディレクトリ→デフォルトテーマ
const DIR_DEFAULT = {
  leader:   "lead",
  strategy: "strategy",
  whatif:   "decide",
  anime:    "anime",
  movie:    "movie",
  novel:    "novel",
  books:    "books",
};

// 保持するカテゴリ（変換不要）
const KEEP = new Set(["anime", "movie", "novel", "books"]);

const COLLECTIONS = ["battle","world","leader","strategy","whatif","anime","movie","novel","books"];

let updated = 0, skipped = 0;

for (const col of COLLECTIONS) {
  const dir = resolve(root, `src/content/${col}`);
  let files;
  try {
    files = readdirSync(dir).filter(f => f.endsWith(".mdx") || f.endsWith(".md"));
  } catch { continue; }

  for (const file of files) {
    const slug = file.replace(/\.mdx?$/, "");
    const key = `${col}/${slug}`;
    const filePath = resolve(dir, file);
    let content = readFileSync(filePath, "utf-8");

    // 現在のcategoryを取得
    const match = content.match(/^category:\s*(.+)$/m);
    if (!match) { skipped++; continue; }
    const current = match[1].trim();

    // 保持カテゴリはスキップ
    if (KEEP.has(current)) { skipped++; continue; }
    // すでに新カテゴリならスキップ
    if (["decide","lead","recover","strategy","change"].includes(current)) {
      skipped++; continue;
    }

    // テーマ決定
    const theme = MANUAL[key] ?? DIR_DEFAULT[col] ?? "strategy";

    // category フィールドを置換
    const newContent = content.replace(/^category:\s*.+$/m, `category: ${theme}`);
    if (newContent === content) { skipped++; continue; }

    writeFileSync(filePath, newContent, "utf-8");
    console.log(`✅ ${key}: ${current} → ${theme}`);
    updated++;
  }
}

console.log(`\n完了: ${updated}件更新、${skipped}件スキップ`);
