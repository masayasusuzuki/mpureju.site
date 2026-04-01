#!/bin/bash
# microCMS 一括投稿スクリプト
# 数字のみのディレクトリ（未処理）を順番に投稿してリネームする

set -e
cd "$(dirname "$0")/.."

export $(grep -v '^#' .env.local | grep -v '^image' | xargs)

SUCCESS=0
FAILED=0
FAILED_DIRS=()

for DIR in $(ls public/case/ | grep -E '^[0-9]+$' | sort -n); do
  FULL_PATH="public/case/$DIR"

  if [ ! -f "$FULL_PATH/article.md" ]; then
    echo "⏭ $DIR: article.md なし スキップ"
    continue
  fi

  echo "📤 投稿中: $DIR"

  # 投稿（429の場合は10秒待ってリトライ）
  OUTPUT=$(node scripts/microcms-case-post.js "$FULL_PATH" 2>&1)

  if echo "$OUTPUT" | grep -q "429"; then
    echo "   ⏳ レートリミット、10秒後にリトライ..."
    sleep 10
    OUTPUT=$(node scripts/microcms-case-post.js "$FULL_PATH" 2>&1)
  fi

  if echo "$OUTPUT" | grep -q "✅ 投稿完了"; then
    # タイトルを article.md から取得してリネーム
    TITLE=$(grep '^title:' "$FULL_PATH/article.md" | sed 's/^title: *"//' | sed 's/"$//' | cut -c1-25)
    NEW_NAME="${DIR}_${TITLE}"
    mv "$FULL_PATH" "public/case/$NEW_NAME"
    echo "   ✅ 完了 → $NEW_NAME"
    SUCCESS=$((SUCCESS + 1))
  else
    echo "   ❌ 失敗: $DIR"
    echo "$OUTPUT" | tail -5
    FAILED=$((FAILED + 1))
    FAILED_DIRS+=("$DIR")
  fi

  sleep 5
done

echo ""
echo "=========================================="
echo " 完了: $SUCCESS 件 / 失敗: $FAILED 件"
if [ ${#FAILED_DIRS[@]} -gt 0 ]; then
  echo " 失敗ディレクトリ: ${FAILED_DIRS[*]}"
fi
echo "=========================================="
