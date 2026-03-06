/**
 * add-body-images.mjs
 * ogImageがあるが本文画像がない記事に、## ヘッダーを使って画像を挿入する
 * API不要（ogImage URLを再利用）
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const DIRS = [
  'src/content/battle',
  'src/content/leader',
  'src/content/strategy',
  'src/content/movie',
  'src/content/whatif',
  'src/content/books',
];

function extractOgImage(frontmatter) {
  const m = frontmatter.match(/ogImage:\s*"([^"]+)"/);
  return m ? m[1] : null;
}

function hasInlineImages(body) {
  return /!\[.*?\]\(https?:/.test(body);
}

function insertImagesInBody(body, img) {
  const headingPattern = /\n(## .+)/g;
  const matches = [...body.matchAll(headingPattern)];

  if (matches.length < 2) return body;

  let result = body;
  let offset = 0;

  // 2番目の ## の前に img を挿入
  if (matches[1]) {
    const pos = matches[1].index + offset;
    const insertion = `\n\n![](${img})\n`;
    result = result.slice(0, pos) + insertion + result.slice(pos);
    offset += insertion.length;
  }

  // 4番目の ## の前に img を挿入（存在する場合）
  if (matches[3]) {
    const pos = matches[3].index + offset;
    const insertion = `\n\n![](${img})\n`;
    result = result.slice(0, pos) + insertion + result.slice(pos);
  }

  return result;
}

let processed = 0, skipped = 0;

for (const dir of DIRS) {
  const dirPath = path.join(ROOT, dir);
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.mdx')).sort();
  const cat = dir.split('/').pop();
  console.log(`\n📂 ${cat} (${files.length}件)`);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const content = fs.readFileSync(filePath, 'utf8');

    const fmStart = content.indexOf('---');
    const fmEnd = content.indexOf('---', fmStart + 3);
    const frontmatter = content.slice(0, fmEnd + 3);
    const body = content.slice(fmEnd + 3);

    if (hasInlineImages(body)) {
      console.log(`  ⏭️  ${file} (スキップ - 既に本文画像あり)`);
      skipped++;
      continue;
    }

    const ogImage = extractOgImage(frontmatter);
    if (!ogImage) {
      console.log(`  ⚠️  ${file} (ogImageなし)`);
      skipped++;
      continue;
    }

    const newBody = insertImagesInBody(body, ogImage);
    if (newBody === body) {
      console.log(`  ⚠️  ${file} (## セクション不足)`);
      skipped++;
      continue;
    }

    fs.writeFileSync(filePath, frontmatter + newBody, 'utf8');
    console.log(`  ✅ ${file} (本文画像挿入)`);
    processed++;
  }
}

console.log(`\n✅ 完了！ 処理:${processed}件 スキップ:${skipped}件`);
console.log('次は git add & commit & push してください');
