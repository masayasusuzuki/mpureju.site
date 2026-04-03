#!/bin/bash
# microCMS staff_blog 一括投稿スクリプト
# public/staff/ 配下の全ディレクトリを順番に投稿する

cd "$(dirname "$0")/.."

export $(grep -v '^#' .env.local | grep -v '^image' | xargs)

SUCCESS=0
FAILED=0
SKIPPED=0
FAILED_DIRS=()

find public/staff -maxdepth 1 -type d -name '[0-9]*' | sort | while IFS= read -r FULL_PATH; do
  DIR=$(basename "$FULL_PATH")

  if [ ! -f "$FULL_PATH/article.md" ]; then
    echo "⏭ $DIR: article.md なし スキップ"
    SKIPPED=$((SKIPPED + 1))
    continue
  fi

  # ── slug重複チェック ──
  SLUG=$(grep '^slug:' "$FULL_PATH/article.md" | sed 's/slug: *"//' | sed 's/"//')
  if [ -n "$SLUG" ] && [ -n "$MICROCMS_WRITE_API_KEY" ]; then
    DUP_COUNT=$(curl -s "https://${MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/staff_blog?filters=slug[equals]${SLUG}&fields=id&limit=1" \
      -H "X-MICROCMS-API-KEY: ${MICROCMS_WRITE_API_KEY}" | grep -oE '"totalCount":[0-9]+' | grep -oE '[0-9]+')
    if [ -n "$DUP_COUNT" ] && [ "$DUP_COUNT" -gt 0 ]; then
      echo "⚠️  $DIR: slug '$SLUG' は既にmicroCMSに存在 → スキップ"
      SKIPPED=$((SKIPPED + 1))
      continue
    fi
  fi

  echo "📤 投稿中: $DIR ($SLUG)"

  # 投稿（429の場合は10秒待ってリトライ）
  OUTPUT=$(node scripts/microcms-staff-blog-post.js "$FULL_PATH" 2>&1)

  if echo "$OUTPUT" | grep -q "429"; then
    echo "   ⏳ レートリミット、10秒後にリトライ..."
    sleep 10
    OUTPUT=$(node scripts/microcms-staff-blog-post.js "$FULL_PATH" 2>&1)
  fi

  if echo "$OUTPUT" | grep -q "✅ 投稿完了"; then
    echo "   ✅ 完了: $DIR"
    SUCCESS=$((SUCCESS + 1))
  else
    echo "   ❌ 失敗: $DIR"
    echo "$OUTPUT" | tail -5
    FAILED=$((FAILED + 1))
    FAILED_DIRS+=("$DIR")
  fi

  sleep 3
done

echo ""
echo "=========================================="
echo " 完了: $SUCCESS 件 / 失敗: $FAILED 件 / スキップ: $SKIPPED 件"
if [ ${#FAILED_DIRS[@]} -gt 0 ]; then
  echo " 失敗ディレクトリ: ${FAILED_DIRS[*]}"
fi
echo "=========================================="
