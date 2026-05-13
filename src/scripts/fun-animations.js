/**
 * fun-animations.js
 * テキストスクランブル・タイピング・グロー・燃える・猫イタズラ
 */

/* ──────────────────────────────────────────
   1. TextScramble: 文字がランダムに変化して確定する
   ────────────────────────────────────────── */
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '織田信長豊臣秀吉徳川家康武田信玄上杉謙信真田幸村明智光秀石田三成伊達政宗';
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const old = this.el.innerText;
    const length = Math.max(old.length, newText.length);
    const promise = new Promise(resolve => this.resolve = resolve);
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = old[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 10);
      const end = start + Math.floor(Math.random() * 10);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = '';
    let complete = 0;
    for (let i = 0; i < this.queue.length; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += `<span class="scramble-done">${to}</span>`;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += `<span class="scramble-char">${char}</span>`;
      } else {
        output += `<span class="scramble-char">${from}</span>`;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
}

/* ──────────────────────────────────────────
   2. typeWriter: タイピング風テキスト表示
   ────────────────────────────────────────── */
function typeWriter(el, text, speed = 60) {
  el.textContent = '';
  el.classList.add('typewriter-active');
  let i = 0;
  function tick() {
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(tick, speed + Math.random() * 40);
    } else {
      el.classList.remove('typewriter-active');
      el.classList.add('typewriter-done');
    }
  }
  tick();
}

/* ──────────────────────────────────────────
   3. initHeroScramble: ヒーロータイトルをスクランブル
   ────────────────────────────────────────── */
function initHeroScramble() {
  const hero = document.querySelector('.hero-title, h1.site-title, [data-scramble]');
  if (!hero) return;
  const original = hero.textContent.trim();
  const fx = new TextScramble(hero);

  // ページロード時に1回スクランブル
  setTimeout(() => fx.setText(original), 600);

  // ホバーでもスクランブル
  hero.addEventListener('mouseenter', () => fx.setText(original));
}

/* ──────────────────────────────────────────
   4. initGlowWords: キーワードをホバー時に光らせる
   ────────────────────────────────────────── */
const GLOW_WORDS = ['決断', '信長', '孫子', '戦略', '勝利', '敗北', '革命', '生死', '情報', '覚悟', '知略', '秀吉', '家康', 'カンナエ', '関ヶ原', '桶狭間'];

function initGlowWords() {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        // scriptやstyleの中は無視
        const p = node.parentElement;
        if (!p) return NodeFilter.FILTER_REJECT;
        const tag = p.tagName;
        if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE'].includes(tag)) return NodeFilter.FILTER_REJECT;
        if (p.closest('script, style, noscript')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach(node => {
    let html = node.textContent;
    let replaced = false;
    GLOW_WORDS.forEach(word => {
      if (html.includes(word)) {
        html = html.replaceAll(word, `<span class="glow-word">${word}</span>`);
        replaced = true;
      }
    });
    if (replaced) {
      const span = document.createElement('span');
      span.innerHTML = html;
      node.parentNode.replaceChild(span, node);
    }
  });
}

/* ──────────────────────────────────────────
   5. initGlitch: 見出しにランダムグリッチ
   ────────────────────────────────────────── */
function initGlitch() {
  const headings = document.querySelectorAll('h1, h2, h3');
  headings.forEach(h => {
    h.addEventListener('mouseenter', () => {
      h.classList.add('glitch');
      h.setAttribute('data-text', h.textContent);
      setTimeout(() => h.classList.remove('glitch'), 600);
    });
  });
}

/* ──────────────────────────────────────────
   6. initFire: 特定要素に燃えるエフェクト
   ────────────────────────────────────────── */
function initFire() {
  const targets = document.querySelectorAll('[data-fire], .fire-text');
  targets.forEach(el => {
    el.classList.add('fire-active');
  });
}

/* ──────────────────────────────────────────
   7. initCat: 猫がスクリーンを駆け抜けてイタズラ
   ────────────────────────────────────────── */
function initCat() {
  // 猫DOM作成
  const cat = document.createElement('div');
  cat.id = 'site-cat';
  cat.innerHTML = `
    <div class="cat-body">
      <div class="cat-head">
        <div class="cat-ear left"></div>
        <div class="cat-ear right"></div>
        <div class="cat-face">
          <div class="cat-eye left"></div>
          <div class="cat-eye right"></div>
          <div class="cat-nose"></div>
          <div class="cat-whisker left"></div>
          <div class="cat-whisker right"></div>
        </div>
      </div>
      <div class="cat-torso"></div>
      <div class="cat-tail"></div>
      <div class="cat-leg fl"></div>
      <div class="cat-leg fr"></div>
      <div class="cat-leg bl"></div>
      <div class="cat-leg br"></div>
    </div>
    <div class="cat-speech"></div>
  `;
  document.body.appendChild(cat);

  const speeches = [
    '⚔️ 決断せよ！', '📜 孫子曰く…', '🔥 燃えよ！', '👁️ 情報が命だ', '🏯 天下を狙う', '⚡ 電光石火！', 'にゃ〜ん', '🎌 勝つのは誰だ？'
  ];

  let running = false;

  function runCat() {
    if (running) return;
    running = true;

    const direction = Math.random() > 0.5 ? 'ltr' : 'rtl';
    cat.classList.remove('cat-ltr', 'cat-rtl', 'cat-attack');
    cat.classList.add(direction === 'ltr' ? 'cat-ltr' : 'cat-rtl');
    cat.style.display = 'block';

    // ロゴを攻撃するかランダム決定
    const willAttack = Math.random() > 0.4;
    if (willAttack) {
      setTimeout(() => {
        cat.classList.add('cat-attack');
        const logo = document.querySelector('.site-logo, nav .logo, header h1, .nav-brand');
        if (logo) {
          logo.classList.add('cat-attacked');
          setTimeout(() => logo.classList.remove('cat-attacked'), 1200);
        }
        // フキダシ
        const speech = cat.querySelector('.cat-speech');
        speech.textContent = speeches[Math.floor(Math.random() * speeches.length)];
        speech.classList.add('show');
        setTimeout(() => speech.classList.remove('show'), 1800);
      }, 1400);
    }

    // 走り終わったら非表示
    setTimeout(() => {
      cat.style.display = 'none';
      cat.classList.remove('cat-ltr', 'cat-rtl', 'cat-attack');
      running = false;
    }, 3200);
  }

  // 最初は15秒後に走る
  setTimeout(runCat, 15000);

  // その後はランダム間隔（30〜90秒）
  function scheduleNext() {
    const wait = 30000 + Math.random() * 60000;
    setTimeout(() => {
      runCat();
      scheduleNext();
    }, wait);
  }
  scheduleNext();

  // ロゴクリックで即走る（Easter egg）
  const logo = document.querySelector('.site-logo, nav .logo, header h1, .nav-brand');
  if (logo) {
    logo.addEventListener('click', (e) => {
      if (!running) runCat();
    });
  }
}

/* ──────────────────────────────────────────
   8. initTypewriterHero: ヒーロースローガンをタイピング表示
   ────────────────────────────────────────── */
function initTypewriterHero() {
  const el = document.querySelector('[data-typewriter]');
  if (!el) return;
  const text = el.getAttribute('data-typewriter') || el.textContent;
  el.textContent = '';
  setTimeout(() => typeWriter(el, text, 55), 1200);
}

/* ──────────────────────────────────────────
   INIT ALL
   ────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initHeroScramble();
  initGlowWords();
  initGlitch();
  initFire();
  initCat();
  initTypewriterHero();
});
