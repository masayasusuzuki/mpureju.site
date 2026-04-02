#!/bin/bash
# microCMS 一括投稿スクリプト
# 数字のみのディレクトリ（未処理）を順番に投稿してリネームする
#
# 安全策（2026-04-02 URLズレ事件の教訓）:
#   - 投稿前に microCMS 上の slug 重複を確認
#   - article.md の instagram_url がディレクトリ番号に対応する urls.txt の行と一致するか検証
#   - 不整合があれば投稿せずスキップ

set -e
cd "$(dirname "$0")/.."

export $(grep -v '^#' .env.local | grep -v '^image' | xargs)

SUCCESS=0
FAILED=0
SKIPPED=0
FAILED_DIRS=()

# urls.txt から Instagram URL を順番に抽出（行番号 = ディレクトリ番号）
URLS_FILE="public/case/urls.txt"
declare -a URL_LIST
if [ -f "$URLS_FILE" ]; then
  POS=0
  while IFS= read -r line; do
    url=$(echo "$line" | grep -oE 'https://www.instagram.com/p/[^"[:space:]]+' || true)
    if [ -n "$url" ]; then
      POS=$((POS + 1))
      URL_LIST[$POS]="$url"
    fi
  done < "$URLS_FILE"
  echo "📋 urls.txt: ${POS}件のURLを読み込み"
fi

for DIR in $(ls public/case/ | grep -E '^[0-9]+$' | sort -n); do
  FULL_PATH="public/case/$DIR"
  DIR_NUM=$((10#$DIR))

  if [ ! -f "$FULL_PATH/article.md" ]; then
    echo "⏭ $DIR: article.md なし スキップ"
    continue
  fi

  # ── URL整合性チェック ──
  ARTICLE_URL=$(grep -oE 'https://www.instagram.com/p/[^"]+' "$FULL_PATH/article.md" | head -1)
  EXPECTED_URL="${URL_LIST[$DIR_NUM]}"

  if [ -n "$EXPECTED_URL" ] && [ -n "$ARTICLE_URL" ]; then
    # shortcode だけで比較（?img_index等のパラメータを無視）
    ARTICLE_SC=$(echo "$ARTICLE_URL" | grep -oE '/p/[^/?]+' )
    EXPECTED_SC=$(echo "$EXPECTED_URL" | grep -oE '/p/[^/?]+' )
    if [ "$ARTICLE_SC" != "$EXPECTED_SC" ]; then
      echo "⚠️  $DIR: URL不整合！ article.md=$ARTICLE_SC, urls.txt[$DIR_NUM]=$EXPECTED_SC → スキップ"
      SKIPPED=$((SKIPPED + 1))
      continue
    fi
  fi

  # ── slug重複チェック ──
  SLUG=$(grep '^slug:' "$FULL_PATH/article.md" | sed 's/slug: *"//' | sed 's/"//')
  if [ -n "$SLUG" ] && [ -n "$MICROCMS_WRITE_API_KEY" ]; then
    DUP_COUNT=$(curl -s "https://${MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/cases?filters=slug[equals]${SLUG}&fields=id&limit=1" \
      -H "X-MICROCMS-API-KEY: ${MICROCMS_WRITE_API_KEY}" | grep -oE '"totalCount":[0-9]+' | grep -oE '[0-9]+')
    if [ -n "$DUP_COUNT" ] && [ "$DUP_COUNT" -gt 0 ]; then
      echo "⚠️  $DIR: slug '$SLUG' は既にmicroCMSに存在（${DUP_COUNT}件）→ スキップ"
      SKIPPED=$((SKIPPED + 1))
      continue
    fi
  fi

  echo "📤 投稿中: $DIR ($SLUG)"

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
echo " 完了: $SUCCESS 件 / 失敗: $FAILED 件 / スキップ: $SKIPPED 件"
if [ ${#FAILED_DIRS[@]} -gt 0 ]; then
  echo " 失敗ディレクトリ: ${FAILED_DIRS[*]}"
fi
echo "=========================================="
