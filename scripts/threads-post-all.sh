#!/bin/bash
# 複数のnote下書きをThreadsに順番に投稿する
# 使い方: bash scripts/threads-post-all.sh note-drafts/note_17*.md note-drafts/note_18*.md ...

for file in "$@"; do
  echo ""
  echo "========================================="
  echo "📤 投稿中: $file"
  echo "========================================="
  node scripts/threads-post.js "$file"
  echo "✅ 完了: $file"
  sleep 3
done

echo ""
echo "🎉 全ファイルの投稿が完了しました"
