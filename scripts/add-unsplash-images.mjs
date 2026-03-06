/**
 * Unsplash画像自動付与スクリプト
 * 実行: node scripts/add-unsplash-images.mjs
 *
 * - ogImageが未設定の記事のみ処理（再実行可能）
 * - Unsplash無料枠：50req/時。超えたら自動停止→再実行してください
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// .envからキー読み込み
const envContent = fs.readFileSync(path.join(ROOT, '.env'), 'utf-8');
const ACCESS_KEY = envContent.match(/UNSPLASH_ACCESS_KEY=(.+)/)?.[1]?.trim();

if (!ACCESS_KEY) {
  console.error('❌ UNSPLASH_ACCESS_KEY が .env に見つかりません');
  process.exit(1);
}

// カテゴリ別の英語検索キーワード
const CATEGORY_QUERIES = {
  battle:   'ancient battle war military sword',
  leader:   'warrior armor historical portrait commander',
  strategy: 'ancient map military strategy scroll',
  movie:    'cinema dramatic film dark cinematic',
  whatif:   'history ancient war dramatic fog',
  books:    'ancient book manuscript history parchment',
};

// 記事タイトル・タグから英語キーワードを抽出
function buildQuery(category, tags) {
  const base = CATEGORY_QUERIES[category] || 'history ancient';
  // タグから英字のみ抽出（日本語タグは除外）
  const engTags = tags.filter(t => /[a-zA-Z]/.test(t)).slice(0, 2).join(' ');
  return engTags ? `${engTags} ${base}` : base;
}

// Unsplash APIを呼ぶ
function fetchImage(query) {
  return new Promise((resolve, reject) => {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape&client_id=${ACCESS_KEY}`;
    https.get(url, { headers: { 'Accept-Version': 'v1' } }, res => {
      // レート制限チェック
      const remaining = res.headers['x-ratelimit-remaining'];
      if (remaining !== undefined) process.stdout.write(` [残${remaining}req]`);

      if (res.statusCode === 403 || res.statusCode === 429) {
        reject(new Error('RATE_LIMIT'));
        return;
      }
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          // ランダム性を出すためにtop3からスラッグのhashで選ぶ
          const results = json.results || [];
          if (results.length === 0) { resolve(null); return; }
          resolve(results[0].urls.regular);
        } catch(e) { reject(e); }
      });
    }).on('error', reject);
  });
}

// frontmatterにogImageを追加
function addOgImage(content, imageUrl) {
  // 既にあればスキップ
  if (/^ogImage:/m.test(content)) return content;
  // featured: の行の後に追加
  return content.replace(/^(featured:.+)$/m, `$1\nogImage: "${imageUrl}"`);
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  const categories = ['battle', 'leader', 'strategy', 'movie', 'whatif', 'books'];
  let done = 0, skipped = 0, failed = 0;

  for (const cat of categories) {
    const dir = path.join(ROOT, 'src/content', cat);
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir).filter(f => f.match(/\.mdx?$/));
    console.log(`\n📂 ${cat} (${files.length}件)`);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const content = fs.readFileSync(filePath, 'utf-8');

      // 既にogImageがあればスキップ
      if (/^ogImage:/m.test(content)) {
        process.stdout.write(`  ⏭️  ${file}\n`);
        skipped++;
        continue;
      }

      // tagsを抽出
      const tagsMatch = content.match(/^tags:\s*\[(.+?)\]/m);
      const tags = tagsMatch
        ? tagsMatch[1].split(',').map(t => t.trim().replace(/['"「」]/g, ''))
        : [];

      const query = buildQuery(cat, tags);
      process.stdout.write(`  🔍 ${file} → "${query}"`);

      try {
        const url = await fetchImage(query);
        if (url) {
          const updated = addOgImage(content, url);
          fs.writeFileSync(filePath, updated, 'utf-8');
          console.log(` ✅`);
          done++;
        } else {
          console.log(` ❌ 結果なし`);
          failed++;
        }
      } catch(e) {
        if (e.message === 'RATE_LIMIT') {
          console.log(`\n\n⚠️  レート制限に達しました（50req/時）`);
          console.log(`✅ ここまで処理: ${done}件`);
          console.log(`⏳ 1時間後に再実行してください（処理済みはスキップされます）`);
          process.exit(0);
        }
        console.log(` ❌ ${e.message}`);
        failed++;
      }

      // 1.5秒待機（安全マージン）
      await sleep(1500);
    }
  }

  console.log(`\n✅ 完了！ 処理:${done}件 スキップ:${skipped}件 失敗:${failed}件`);
  console.log('次は git add & commit & push してVercelにデプロイしてください');
}

main();
