#!/usr/bin/env node
/**
 * 記事フロントマターに year フィールドを一括追加するスクリプト
 * 負数 = BC（紀元前）
 */
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// ファイルパス → 年代のマッピング
const YEARS = {
  // battle
  "src/content/battle/marathon.mdx":          -490,
  "src/content/battle/thermopylae.mdx":       -480,
  "src/content/battle/gaugamela.mdx":         -331,
  "src/content/battle/cannae.mdx":            -216,
  "src/content/battle/changping.mdx":         -260,
  "src/content/battle/zama.mdx":              -202,
  "src/content/battle/agincourt.mdx":          1415,
  "src/content/battle/lepanto.mdx":            1571,
  "src/content/battle/kawanakajima.mdx":       1561,
  "src/content/battle/anegawa.mdx":            1570,
  "src/content/battle/mikatagahara.mdx":       1572,
  "src/content/battle/nagashino.mdx":          1575,
  "src/content/battle/nagashino-sequel.mdx":   1575,
  "src/content/battle/yamazaki.mdx":           1582,
  "src/content/battle/shizugatake.mdx":        1583,
  "src/content/battle/okehazama.mdx":          1560,
  "src/content/battle/sekigahara.mdx":         1600,
  "src/content/battle/osaka-no-jin.mdx":       1615,
  "src/content/battle/austerlitz.mdx":         1805,
  "src/content/battle/trafalgar.mdx":          1805,
  "src/content/battle/waterloo.mdx":           1815,
  "src/content/battle/toba-fushimi.mdx":       1868,
  "src/content/battle/midway.mdx":             1942,
  "src/content/battle/stalingrad.mdx":         1942,
  "src/content/battle/normandy.mdx":           1944,
  // world
  "src/content/world/marathon.mdx":            -490,
  "src/content/world/thermopylae.mdx":         -480,
  "src/content/world/gaugamela.mdx":           -331,
  "src/content/world/zama.mdx":               -202,
  "src/content/world/cannae.mdx":             -216,
  "src/content/world/kadesh.mdx":             -1274,
  "src/content/world/actium.mdx":              -31,
  "src/content/world/yarmouk.mdx":              636,
  "src/content/world/hastings.mdx":            1066,
  "src/content/world/ankara.mdx":              1402,
  "src/content/world/constantinople.mdx":      1453,
  "src/content/world/lepanto.mdx":             1571,
  "src/content/world/vienna1683.mdx":          1683,
  "src/content/world/plassey.mdx":             1757,
  "src/content/world/waterloo.mdx":            1815,
  "src/content/world/gettysburg.mdx":          1863,
  "src/content/world/tsushima.mdx":            1905,
};

let updated = 0;
let skipped = 0;

for (const [relPath, year] of Object.entries(YEARS)) {
  const filePath = resolve(root, relPath);
  let content;
  try {
    content = readFileSync(filePath, "utf-8");
  } catch {
    console.log(`⚠️  ファイルなし: ${relPath}`);
    skipped++;
    continue;
  }

  // すでに year: があればスキップ
  if (/^year:/m.test(content)) {
    console.log(`✓ スキップ（既存）: ${relPath}`);
    skipped++;
    continue;
  }

  // ogImage: の行の後に year: を挿入（なければ readingTime: の後）
  const insertAfter = /^ogImage:.*$/m.test(content) ? /^(ogImage:.*)/m : /^(readingTime:.*)/m;
  const newContent = content.replace(insertAfter, `$1\nyear: ${year}`);

  if (newContent === content) {
    console.log(`⚠️  挿入失敗: ${relPath}`);
    skipped++;
    continue;
  }

  writeFileSync(filePath, newContent, "utf-8");
  console.log(`✅ ${year > 0 ? year + "年" : "紀元前" + Math.abs(year) + "年"}: ${relPath}`);
  updated++;
}

console.log(`\n完了: ${updated}件更新、${skipped}件スキップ`);
