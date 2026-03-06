/**
 * fix-affiliate-asins.mjs
 * Amazon ASINの誤りを一括修正する
 *
 * 確認済み誤ASIN → 正しいASIN のマッピング
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ────────────────────────────────────────────────────────────
// 確認済みの誤ASIN → 正しいASIN マッピング
// ※ 戦争論のみ title+asin のペアで判定（同ASINが失敗の本質にも使われるため）
// ────────────────────────────────────────────────────────────
const SIMPLE_FIXES = {
  // 確認: アクセスしたら全く別の本だった
  '4003272013': '4003343514',  // ラサリーリョ → ナポレオン言行録（岩波文庫 青435-1）
  '4003320611': '4003300211',  // 荘子 → 五輪書（岩波文庫）
  '4004140455': '4003400313',  // ギリシアの詩 → 君主論（岩波文庫）
  '4101382018': '4101110034',  // 帝王が消えた日 → 山本五十六 上（新潮文庫）
  '4101351503': '4103096101',  // 404 → ローマ人の物語Ⅰ（単行本）
  '4101351511': '410309611X',  // 404 → ローマ人の物語Ⅱ ハンニバル戦記（単行本）
  '4101351538': '4103096128',  // 404 → ローマ人の物語Ⅲ 勝者の混迷（単行本）

  // 司馬遼太郎系（確認済み or 404）
  '4167102013': '4167105675',  // されどわれらが日々 → 竜馬がゆく（1）新装版（文春文庫）
  '4167102099': '4167105659',  // 404 → 最後の将軍 徳川慶喜 新装版（文春文庫）
  '4101152015': '4167105764',  // 404 → 坂の上の雲（1）新装版（文春文庫）
  '4101152023': '4101152128',  // 404 → 関ケ原（上）（新潮文庫）
  '4101152058': '4167105934',  // 404 → 幕末 新装版（文春文庫）
  '4101152074': '4101152047',  // 404 → 国盗り物語（一）（新潮文庫）
  '4101152112': '4101152381',  // 404 → 覇王の家（上）（新潮文庫）
  '4101152187': '4101152314',  // 不一致 → 項羽と劉邦（上）（新潮文庫）
  '4101152244': '4062739321',  // 404 → 播磨灘物語（1）新装版（講談社文庫）
  '4101131139': '4167112302',  // 古版 → 武田信玄 風の巻 新装版（文春文庫）
};

// 戦争論（クラウゼヴィッツ）の誤ASIN修正
// asin=4122018331 は「失敗の本質」に正しく使われる場合もあるため
// title に "戦争論" を含む場合のみ修正
const CLAUSEWITZ_OLD = '4122018331';
const CLAUSEWITZ_NEW = '4122039398'; // 戦争論 上（中公文庫）清水多吉訳

const DIRS = [
  'src/content/battle',
  'src/content/leader',
  'src/content/strategy',
  'src/content/movie',
  'src/content/whatif',
  'src/content/books',
];

let totalFixed = 0;
let totalFiles = 0;

for (const dir of DIRS) {
  const dirPath = path.join(ROOT, dir);
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.mdx')).sort();
  const cat = dir.split('/').pop();
  console.log(`\n📂 ${cat}`);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let fixed = 0;

    // 1. シンプル置換（タイトル問わず ASIN を一括修正）
    for (const [oldAsin, newAsin] of Object.entries(SIMPLE_FIXES)) {
      const regex = new RegExp(`asin: "${oldAsin}"`, 'g');
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, `asin: "${newAsin}"`);
        fixed += matches.length;
      }
    }

    // 2. 戦争論のASIN修正（タイトルに "戦争論" を含む場合のみ）
    const warBlockPattern = /- title: "((?:(?!").)*戦争論(?:(?!").)*)"(\n    asin: "4122018331")/g;
    let warMatch;
    while ((warMatch = warBlockPattern.exec(content)) !== null) {
      const fullMatch = warMatch[0];
      const newMatch = fullMatch.replace(`"${CLAUSEWITZ_OLD}"`, `"${CLAUSEWITZ_NEW}"`);
      content = content.replace(fullMatch, newMatch);
      fixed++;
    }

    if (fixed > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`  ✅ ${file} (${fixed}件修正)`);
      totalFixed += fixed;
      totalFiles++;
    } else {
      console.log(`  ⏭️  ${file}`);
    }
  }
}

console.log(`\n✅ 完了！ ${totalFiles}ファイル、合計${totalFixed}件のASINを修正しました`);
console.log('次は git add & commit & push してください');
