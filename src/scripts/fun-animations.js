/**
 * fun-animations.js
 * ① テキストスクランブル（h1 ホバー）
 * ② グローワード（キーワード金色発光）
 * ③ タイピング表示
 * ④ 燃えるテキスト
 */

/* ══════════════════════════════════════════════
   1. TEXT SCRAMBLE — h1 ホバーで武将名がランダムに混ざる
   ══════════════════════════════════════════════ */
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '織田信長豊臣秀吉徳川家康武田信玄上杉謙信真田幸村明智光秀石田三成伊達政宗';
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const old = this.el.innerText;
    const len = Math.max(old.length, newText.length);
    this.resolve && this.resolve();
    const p = new Promise(r => this.resolve = r);
    this.queue = Array.from({ length: len }, (_, i) => ({
      from:  old[i]     || '',
      to:    newText[i] || '',
      start: Math.floor(Math.random() * 10),
      end:   Math.floor(Math.random() * 10) + 10,
      char:  '',
    }));
    cancelAnimationFrame(this.raf);
    this.frame = 0;
    this.update();
    return p;
  }
  update() {
    let out = '', done = 0;
    for (const q of this.queue) {
      if (this.frame >= q.end) {
        done++;
        out += `<span class="scramble-done">${q.to}</span>`;
      } else if (this.frame >= q.start) {
        if (!q.char || Math.random() < 0.28)
          q.char = this.chars[Math.floor(Math.random() * this.chars.length)];
        out += `<span class="scramble-char">${q.char}</span>`;
      } else {
        out += `<span class="scramble-char">${q.from}</span>`;
      }
    }
    this.el.innerHTML = out;
    if (done === this.queue.length) { this.resolve(); return; }
    this.raf = requestAnimationFrame(this.update);
    this.frame++;
  }
}

function initHeroScramble() {
  const hero = document.querySelector('.hero-title, h1.site-title, [data-scramble]');
  if (!hero) return;
  const orig = hero.textContent.trim();
  const fx   = new TextScramble(hero);
  setTimeout(() => fx.setText(orig), 700);
  hero.addEventListener('mouseenter', () => fx.setText(orig));
}

/* ══════════════════════════════════════════════
   2. GLOW WORDS — キーワードをホバーで金色に光らせる
   ══════════════════════════════════════════════ */
const GLOW_WORDS = [
  '決断', '信長', '孫子', '戦略', '勝利', '敗北', '革命', '生死',
  '情報', '覚悟', '知略', '秀吉', '家康', 'カンナエ', '関ヶ原', '桶狭間',
];

function initGlowWords() {
  const skip = new Set(['SCRIPT','STYLE','NOSCRIPT','CODE','PRE','A','BUTTON']);
  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      const p = n.parentElement;
      return (!p || skip.has(p.tagName) || p.closest('script,style'))
        ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    },
  });
  const nodes = [];
  while (walk.nextNode()) nodes.push(walk.currentNode);
  for (const n of nodes) {
    let html = n.textContent, hit = false;
    for (const w of GLOW_WORDS) {
      if (html.includes(w)) {
        html = html.replaceAll(w, `<span class="glow-word">${w}</span>`);
        hit = true;
      }
    }
    if (hit) {
      const s = document.createElement('span');
      s.innerHTML = html;
      n.parentNode.replaceChild(s, n);
    }
  }
}

/* ══════════════════════════════════════════════
   3. TYPEWRITER — data-typewriter 属性でタイピング表示
   ══════════════════════════════════════════════ */
function typeWriter(el, text, speed = 58) {
  el.textContent = '';
  el.classList.add('typewriter-active');
  let i = 0;
  (function tick() {
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(tick, speed + Math.random() * 38);
    } else {
      el.classList.replace('typewriter-active', 'typewriter-done');
    }
  })();
}

function initTypewriterHero() {
  const el = document.querySelector('[data-typewriter]');
  if (!el) return;
  const text = el.getAttribute('data-typewriter') || el.textContent;
  el.textContent = '';
  setTimeout(() => typeWriter(el, text, 55), 1200);
}

/* ══════════════════════════════════════════════
   4. FIRE TEXT — data-fire / .fire-text に炎
   ══════════════════════════════════════════════ */
function initFire() {
  document.querySelectorAll('[data-fire], .fire-text').forEach(el => {
    el.classList.add('fire-active');
  });
}

/* ══════════════════════════════════════════════
   BOOT
   ══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initHeroScramble();
  initGlowWords();
  initTypewriterHero();
  initFire();
});
