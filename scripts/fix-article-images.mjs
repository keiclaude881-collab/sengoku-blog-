/**
 * fix-article-images.mjs
 * 各記事にスラッグ固有クエリで Unsplash 画像を割り当てる
 *  - ogImage をより記事に合った写真に更新
 *  - 本文中の --- の後に画像を 1〜2 枚挿入
 * 50req/hour 制限を自動検知し、続きから再実行可能
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ENV = fs.readFileSync(path.join(ROOT, '.env'), 'utf8');
const KEY = ENV.match(/UNSPLASH_ACCESS_KEY=(.+)/)?.[1]?.trim();

if (!KEY) { console.error('UNSPLASH_ACCESS_KEY が .env にありません'); process.exit(1); }

// ──────────────────────────────────────────
// 記事スラッグ → 英語検索クエリ のマッピング
// ──────────────────────────────────────────
const QUERIES = {
  // battle
  agincourt:           'agincourt battle medieval archers longbow',
  anegawa:             'river samurai warrior japan',
  austerlitz:          'napoleon austerlitz battle french army',
  cannae:              'cannae battle ancient rome carthage hannibal',
  changping:           'ancient china qin dynasty battle war',
  gaugamela:           'alexander great persia battle ancient cavalry',
  kawanakajima:        'samurai battle mountain japan river',
  lepanto:             'naval battle sailing ships sea cannon',
  marathon:            'ancient greece warrior running athletics',
  midway:              'midway pacific ocean aircraft carrier battle',
  mikatagahara:        'samurai winter battle japan snow warrior',
  nagashino:           'nagashino battle guns samurai japan muskets',
  'nagashino-sequel':  'guns rifle battle japan samurai historical',
  normandy:            'normandy dday beach landing soldiers',
  okehazama:           'rain storm battle ambush samurai',
  'osaka-no-jin':      'castle siege battle japan samurai',
  sekigahara:          'sekigahara battle mist plains samurai',
  shizugatake:         'mountain battle samurai japan spear',
  stalingrad:          'stalingrad russia winter ruins battle',
  thermopylae:         'spartan warrior ancient helmet shield',
  'toba-fushimi':      'japan civil war sword battle meiji',
  trafalgar:           'sailing ship ocean waves dramatic sea',
  waterloo:            'waterloo battle napoleon cannon field',
  yamazaki:            'mountain battle samurai japan decisive',
  zama:                'ancient rome elephant battle dramatic',

  // leader
  alexander:           'conqueror warrior ancient empire dramatic',
  caesar:              'julius caesar rome ancient empire senate',
  'cao-cao':           'ancient china three kingdoms warrior general',
  chinggis:            'mongol horseman steppe warrior central asia',
  'frederick-great':   'prussian military king european battle',
  'gustav-adolf':      'sweden king warrior battle 17th century',
  hannibal:            'hannibal elephant carthage alps ancient',
  hideyoshi:           'japan castle samurai unification feudal lord',
  ieyasu:              'tokugawa ieyasu japan shogun samurai',
  kenshin:             'samurai warrior spirit sword battle',
  'kuroda-kanbei':     'samurai strategist adviser japan castle',
  'li-shimin':         'tang emperor china ancient palace warrior',
  'liu-bang':          'han dynasty china emperor founding',
  masamune:            'samurai armor warrior dramatic japan',
  mitsuhide:           'akechi mitsuhide samurai betrayal honnoji',
  mouri:               'samurai castle strategic japan west',
  napoleon:            'napoleon emperor france military portrait',
  nobunaga:            'castle fire dramatic japan warrior night',
  'richard-lionheart': 'richard lionheart crusade medieval castle',
  saladin:             'crusades jerusalem medieval castle warrior',
  sanada:              'red samurai warrior armor japan',
  scipio:              'scipio africanus rome general ancient',
  shingen:             'samurai general warrior japan helmet',
  'takeda-katsuyori':  'samurai battlefield defeat japan warrior',
  'takenaka-hanbei':   'castle advisor japan samurai strategy',
  'tokugawa-yoshinobu':'japan shogun meiji restoration samurai sword',
  'wang-jian':         'qin dynasty china general ancient conquest',
  wellington:          'duke wellington british general waterloo',
  'yamamoto-isoroku':  'admiral navy japan pacific warship ocean',
  'zhuge-liang':       'ancient china adviser wise strategist war',

  // strategy
  blitzkrieg:          'tank blitzkrieg germany speed lightning attack',
  'bochiku-hen':       'castle fortress siege defensive wall medieval',
  clausewitz:          'war theory military philosophy strategy book',
  'coalition-building':'alliance diplomacy handshake political meeting',
  'divide-conquer':    'divide conquer empire chess strategy',
  'gorin-no-sho':      'miyamoto musashi sword book samurai wisdom',
  guerrilla:           'guerrilla jungle mountain hidden warfare stealth',
  'information-war':   'intelligence espionage spy information secret',
  kyojitsu:            'deception illusion shadow strategy art',
  lanchester:          'military mathematics numbers equation strategy',
  machiavelli:         'machiavelli prince politics power florence renaissance',
  porter:              'business competition strategy market chess',
  'psychological-war': 'psychological mind mental pressure battle',
  'retreat-strategy':  'retreat withdrawal strategic military movement',
  'supply-line':       'logistics supply food army horses caravan',

  // movie
  '300':               '300 spartan warrior helmet ancient battle',
  braveheart:          'scotland highlands medieval sword freedom',
  dune:                'dune desert sand dunes epic vast landscape',
  dunkirk:             'dunkirk beach sea evacuation boat soldiers',
  fury:                'tank armored warfare world war field',
  gladiator:           'gladiator colosseum rome ancient arena',
  'hacksaw-ridge':     'pacific cliff courage world war soldier',
  kingdom:             'kingdom china ancient sword battle drama',
  'last-samurai':      'samurai mountain mist japan meiji sunset',
  patton:              'general army tank world war desert command',
  'red-cliff':         'ancient china river fire battle ship',
  'seven-samurai':     'seven samurai japan village rain sword',
  'star-wars-strategy':'space galaxy stars nebula cosmos dramatic',
  'tora-tora-tora':    'pearl harbor aircraft attack explosion ship',
  troy:                'troy ancient greece siege wooden horse',

  // whatif
  'alexander-longlife-if':  'alexander great empire ancient world vast',
  'cao-cao-if':             'ancient china three kingdoms power map',
  'hannibal-rome-if':       'rome carthage ancient battle elephant map',
  'honnoji-if':             'honnoji temple fire betrayal samurai japan',
  'midway-if':              'pacific ocean carrier fleet naval dramatic',
  'napoleon-russia-if':     'napoleon russia winter snow frozen retreat',
  'normandy-fail-if':       'normandy beach storm waves dramatic war',
  'ryoma-survival-if':      'sakamoto ryoma samurai japan meiji harbor',
  'sekigahara-if-west':     'sekigahara mist autumn battlefield samurai',
  'shingen-longlife-if':    'takeda shingen tiger warrior mount fuji',

  // books
  'gorin-no-sho-review':    'musashi book dojo sword ancient wisdom',
  kunshiron:                'machiavelli prince politics book renaissance',
  'shippai-no-honshitsu':   'japan military history analysis thinking',
  'sonshi-kanzen-kaisetsu': 'sun tzu art of war ancient strategy',
  'strategy-no-honshitsu':  'military strategy history book analysis',
};

const CAT_FALLBACK = {
  battle:   'ancient battle war dramatic history',
  leader:   'warrior leader historical dramatic portrait',
  strategy: 'strategy military planning chess war',
  movie:    'film cinema dramatic epic',
  whatif:   'history dramatic fog alternative',
  books:    'ancient book wisdom history',
};

const DIRS = {
  battle:   'src/content/battle',
  leader:   'src/content/leader',
  strategy: 'src/content/strategy',
  movie:    'src/content/movie',
  whatif:   'src/content/whatif',
  books:    'src/content/books',
};

// ──────────────────────────────────────────
// Unsplash API
// ──────────────────────────────────────────
async function fetchImages(query) {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=3&client_id=${KEY}`;
  const res = await fetch(url);
  const remaining = parseInt(res.headers.get('X-Ratelimit-Remaining') || '50', 10);
  const data = await res.json();

  if (data.errors || !data.results?.length) return { images: [], remaining };
  return { images: data.results.map(r => r.urls.regular), remaining };
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ──────────────────────────────────────────
// MDX 本文への画像挿入
// ──────────────────────────────────────────
function hasInlineImages(body) {
  return /!\[.*?\]\(https?:/.test(body);
}

function insertImagesInBody(body, img1, img2) {
  if (!img1 && !img2) return body;

  // ## ヘッダーの位置を見つけて挿入
  const headingPattern = /\n(## .+)/g;
  const matches = [...body.matchAll(headingPattern)];

  if (matches.length < 2) return body; // セクションが少なすぎる

  let result = body;
  let offset = 0;

  // 2番目のセクション前に img1 を挿入
  if (img1 && matches[1]) {
    const pos = matches[1].index + offset;
    const insertion = `\n\n![](${img1})\n`;
    result = result.slice(0, pos) + insertion + result.slice(pos);
    offset += insertion.length;
  }

  // 4番目のセクション前に img2 を挿入（存在する場合）
  if (img2 && matches[3]) {
    const pos = matches[3].index + offset;
    const insertion = `\n\n![](${img2})\n`;
    result = result.slice(0, pos) + insertion + result.slice(pos);
  }

  return result;
}

// ──────────────────────────────────────────
// frontmatter の ogImage を更新
// ──────────────────────────────────────────
function updateOgImage(frontmatter, url) {
  if (frontmatter.includes('ogImage:')) {
    return frontmatter.replace(/ogImage:.*\n/, `ogImage: "${url}"\n`);
  }
  return frontmatter.replace(/(featured:.*\n)/, `$1ogImage: "${url}"\n`);
}

// ──────────────────────────────────────────
// メイン
// ──────────────────────────────────────────
async function main() {
  let processed = 0, skipped = 0, failed = 0;

  for (const [cat, dir] of Object.entries(DIRS)) {
    const dirPath = path.join(ROOT, dir);
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.mdx')).sort();
    console.log(`\n📂 ${cat} (${files.length}件)`);

    for (const file of files) {
      const slug = file.replace('.mdx', '');
      const filePath = path.join(dirPath, file);
      const content = fs.readFileSync(filePath, 'utf8');

      // frontmatter / body を分割
      const fmStart = content.indexOf('---');
      const fmEnd   = content.indexOf('---', fmStart + 3);
      const frontmatter = content.slice(0, fmEnd + 3);
      const body        = content.slice(fmEnd + 3);

      // 既にogImage(Unsplash)があればスキップ
      if (frontmatter.includes('ogImage:') && frontmatter.includes('unsplash.com')) {
        console.log(`  ⏭️  ${file} (スキップ)`);
        skipped++;
        continue;
      }

      const query = QUERIES[slug] ?? CAT_FALLBACK[cat];
      const { images, remaining } = await fetchImages(query);
      console.log(`  🔍 ${file} → "${query}" [残${remaining}req]`);

      if (remaining <= 5) {
        console.log('\n⚠️  レート制限に近い。1時間後に再実行してください。');
        process.exit(0);
      }

      if (!images.length) {
        console.log('    ❌ 画像なし');
        failed++;
        await sleep(1500);
        continue;
      }

      const newFm   = updateOgImage(frontmatter, images[0]);
      const newBody = insertImagesInBody(body, images[1], images[2]);

      fs.writeFileSync(filePath, newFm + newBody, 'utf8');
      console.log(`    ✅ 更新 (ogImage + 本文画像)`);
      processed++;

      await sleep(1500);
    }
  }

  console.log(`\n✅ 完了！ 処理:${processed}件 スキップ:${skipped}件 失敗:${failed}件`);
  console.log('次は git add & commit & push してVercelにデプロイしてください');
}

main().catch(console.error);
