/**
 * fun-animations.js
 * ① 浮遊エンバー + カーソル火花（canvas）
 * ② クリック墨汁リップル
 * ③ 記事カード 3D チルト
 * ④ テキストスクランブル（h1 ホバー）
 * ⑤ グローワード（キーワード金色発光）
 * ⑥ タイピング表示
 * ⑦ 燃えるテキスト
 */

/* ══════════════════════════════════════════════
   1. PARTICLE CANVAS — エンバー & カーソル火花
   ══════════════════════════════════════════════ */
function initParticleCanvas() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particle-canvas';
  Object.assign(canvas.style, {
    position: 'fixed',
    top: '0', left: '0',
    width: '100%', height: '100%',
    pointerEvents: 'none',
    zIndex: '9990',
  });
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let W = 0, H = 0;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  /* ── パーティクル ── */
  const particles = [];

  class Ember {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = H + 10;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = -(0.4 + Math.random() * 1.2);
      this.r  = 1.2 + Math.random() * 2.5;
      this.life = 1;
      this.decay = 0.0025 + Math.random() * 0.003;
      this.hue = 15 + Math.random() * 35;   // 橙〜赤
    }
    update() {
      this.x  += this.vx + Math.sin(Date.now() * 0.002 + this.y) * 0.3;
      this.y  += this.vy;
      this.life -= this.decay;
      if (this.life <= 0 || this.y < -20) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.life * 0.8;
      ctx.shadowColor = `hsl(${this.hue},100%,60%)`;
      ctx.shadowBlur  = this.r * 4;
      ctx.fillStyle   = `hsl(${this.hue},100%,${55 + this.life * 30}%)`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r * this.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  class Spark {
    constructor(x, y) {
      this.x = x; this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const spd   = 1.5 + Math.random() * 5;
      this.vx = Math.cos(angle) * spd;
      this.vy = Math.sin(angle) * spd - 2.5;
      this.r  = 1 + Math.random() * 2;
      this.life  = 1;
      this.decay = 0.045 + Math.random() * 0.07;
      this.hue   = 38 + Math.random() * 22;  // ゴールド
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.18;          // 重力
      this.vx *= 0.97;
      this.life -= this.decay;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.life;
      ctx.shadowColor = `hsl(${this.hue},100%,70%)`;
      ctx.shadowBlur  = 6;
      ctx.fillStyle   = `hsl(${this.hue},100%,${65 + this.life * 25}%)`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r * this.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  /* エンバー常時 30 個 */
  for (let i = 0; i < 30; i++) {
    const e = new Ember();
    e.y    = Math.random() * H;   // 最初はバラバラな高さから開始
    e.life = Math.random();
    particles.push(e);
  }

  /* カーソルトラッキング */
  let mx = -9999, my = -9999, pmx = -9999, pmy = -9999;
  let sparkFrame = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  /* ループ */
  function loop() {
    ctx.clearRect(0, 0, W, H);

    /* カーソルが動いていたら火花 */
    const dx = mx - pmx, dy = my - pmy;
    if (Math.sqrt(dx * dx + dy * dy) > 6 && mx > 0) {
      sparkFrame++;
      if (sparkFrame % 3 === 0) {
        for (let i = 0; i < 3; i++) particles.push(new Spark(mx, my));
      }
    }
    pmx = mx; pmy = my;

    /* 更新 & 描画 */
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].life <= 0) {
        if (particles[i] instanceof Spark) particles.splice(i, 1);
        // Ember は reset() で再利用される
      }
    }

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

/* ══════════════════════════════════════════════
   2. INK RIPPLE — クリックで墨が広がる
   ══════════════════════════════════════════════ */
function initInkRipple() {
  document.addEventListener('click', e => {
    if (e.target.closest('a, button, input, textarea, select, label')) return;

    const r = document.createElement('div');
    r.className = 'ink-ripple';
    r.style.left = e.clientX + 'px';
    r.style.top  = e.clientY + 'px';
    document.body.appendChild(r);
    r.addEventListener('animationend', () => r.remove());
  });
}

/* ══════════════════════════════════════════════
   3. CARD TILT — 記事カードが 3D で傾く
   ══════════════════════════════════════════════ */
function initCardTilt() {
  const SELECTOR = '.article-card, [data-tilt]';

  function bind(card) {
    card.style.willChange = 'transform';
    card.style.transformStyle = 'preserve-3d';

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const rx = ((e.clientY - cy) / (rect.height / 2)) * -9;
      const ry = ((e.clientX - cx) / (rect.width  / 2)) *  9;
      card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.04)`;
      card.style.boxShadow = `${-ry * 1.5}px ${rx * 1.5}px 32px rgba(0,0,0,0.28)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.boxShadow  = '';
    });
  }

  document.querySelectorAll(SELECTOR).forEach(bind);

  /* SPA的にあとから追加されたカードにも対応 */
  new MutationObserver(mutations => {
    mutations.forEach(m => m.addedNodes.forEach(n => {
      if (n.nodeType !== 1) return;
      if (n.matches && n.matches(SELECTOR)) bind(n);
      n.querySelectorAll && n.querySelectorAll(SELECTOR).forEach(bind);
    }));
  }).observe(document.body, { childList: true, subtree: true });
}

/* ══════════════════════════════════════════════
   4. TEXT SCRAMBLE — h1 ホバーで武将名がランダムに混ざる
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
      from:  old[i]    || '',
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
   5. GLOW WORDS — キーワードをホバーで金色に光らせる
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
   6. TYPEWRITER — data-typewriter 属性でタイピング表示
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
   7. FIRE TEXT — data-fire / .fire-text に炎
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
  initParticleCanvas();
  initInkRipple();
  initCardTilt();
  initHeroScramble();
  initGlowWords();
  initTypewriterHero();
  initFire();
});
