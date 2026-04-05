#!/bin/bash
# 複数のnote下書きを順番に投稿する
# 使い方: bash scripts/note-post-all.sh note-drafts/note_09*.md note-drafts/note_10*.md ...
# または: bash scripts/note-post-all.sh note-drafts/note_0{9,10,11,12}*.md

for file in "$@"; do
  echo ""
  echo "========================================="
  echo "📤 投稿中: $file"
  echo "========================================="
  node scripts/note-post.js "$file"
  echo "✅ 完了: $file"
  sleep 2
done

echo ""
echo "🎉 全ファイルの投稿が完了しました"
