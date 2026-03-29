import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const draftsDir = 'note-drafts'
const files = fs.readdirSync(draftsDir)
  .filter(f => f.endsWith('.md'))
  .sort()

const notes = files.map(f => {
  const content = fs.readFileSync(path.join(draftsDir, f), 'utf-8')
  const title = content.match(/^# (.+)/m)?.[1] || f
  return { file: f, title, content }
})

const escape = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const html = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>note下書き</title>
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: -apple-system, sans-serif;
  background: #f4f4f4;
  padding: 40px 20px;
}
h1 {
  font-size: 1rem;
  color: #888;
  margin-bottom: 32px;
  letter-spacing: 0.05em;
}
.note {
  background: white;
  border-radius: 10px;
  padding: 24px;
  margin-bottom: 28px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.08);
  max-width: 760px;
  margin-left: auto;
  margin-right: auto;
}
.note + .note { margin-top: 0; }
.note-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #222;
  margin-bottom: 14px;
  line-height: 1.5;
}
textarea {
  width: 100%;
  height: 360px;
  font-family: 'Menlo', monospace;
  font-size: 13px;
  line-height: 1.7;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 14px;
  resize: vertical;
  color: #333;
  background: #fafafa;
}
textarea:focus { outline: none; border-color: #aaa; background: #fff; }
.actions { margin-top: 12px; display: flex; gap: 10px; align-items: center; }
button {
  padding: 8px 22px;
  background: #222;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.15s;
}
button:hover { background: #444; }
button.copied { background: #2e7d32; }
.filename { font-size: 12px; color: #aaa; }
</style>
</head>
<body>
<h1>📝 note下書き一覧 (${notes.length}本)</h1>
${notes.map((n, i) => `
<div class="note">
  <div class="note-title">${escape(n.title)}</div>
  <textarea id="ta${i}" readonly>${escape(n.content)}</textarea>
  <div class="actions">
    <button id="btn${i}" onclick="copy(${i})">全部コピー</button>
    <span class="filename">${n.file}</span>
  </div>
</div>
`).join('\n')}
<script>
function copy(i) {
  const ta = document.getElementById('ta' + i)
  const btn = document.getElementById('btn' + i)
  navigator.clipboard.writeText(ta.value).then(() => {
    btn.textContent = 'コピーしました ✓'
    btn.classList.add('copied')
    setTimeout(() => {
      btn.textContent = '全部コピー'
      btn.classList.remove('copied')
    }, 2000)
  })
}
</script>
</body>
</html>`

const outPath = path.join(draftsDir, 'index.html')
fs.writeFileSync(outPath, html)
execSync(`open "${outPath}"`)
console.log(`✓ ${notes.length}本の下書きを表示中`)
