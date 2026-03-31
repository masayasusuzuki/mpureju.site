#!/bin/bash
# ============================================================
# column-pipeline.sh
# urls.txt のURLを空の番号ディレクトリに順番に割り当てて一括ダウンロード
#
# 使い方:
#   bash scripts/column-pipeline.sh           # 全未処理を実行
#   bash scripts/column-pipeline.sh --dry-run # 実行内容を確認のみ
# ============================================================

set -e

URLS_FILE="public/column/urls.txt"
DRY_RUN=false
[ "$1" = "--dry-run" ] && DRY_RUN=true

# ── ファイル存在確認 ──────────────────────────────────────
if [ ! -f "$URLS_FILE" ]; then
  echo "❌ $URLS_FILE が見つかりません"
  exit 1
fi

echo "=================================================="
echo " コラム一括ダウンロードパイプライン"
echo "=================================================="
echo ""

# ── 空の番号ディレクトリを番号順に取得 ────────────────────
# 条件: 名前が数字のみ、かつ article.md も画像もない
EMPTY_DIRS=()
while IFS= read -r d; do
  BASENAME=$(basename "$d")
  # 数字のみのディレクトリ名か
  if [[ "$BASENAME" =~ ^[0-9]+$ ]]; then
    # article.md も画像もなければ「空」とみなす
    MEDIA_COUNT=$(find "$d" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.mp4" \) 2>/dev/null | wc -l | tr -d ' ')
    HAS_ARTICLE=$([ -f "$d/article.md" ] && echo "1" || echo "0")
    if [ "$MEDIA_COUNT" -eq 0 ] && [ "$HAS_ARTICLE" = "0" ]; then
      EMPTY_DIRS+=("$BASENAME")
    fi
  fi
done < <(find public/column -maxdepth 1 -type d | sort -V)

if [ ${#EMPTY_DIRS[@]} -eq 0 ]; then
  echo "⚠️  空の番号ディレクトリが見つかりません"
  exit 0
fi

echo "📂 空きディレクトリ: ${EMPTY_DIRS[*]}"
echo ""

# ── URLリストを読み込む ────────────────────────────────────
URLS=()
while IFS= read -r line; do
  [[ "$line" =~ ^#.*$ || -z "$line" ]] && continue
  URLS+=("$line")
done < "$URLS_FILE"

if [ ${#URLS[@]} -eq 0 ]; then
  echo "⚠️  urls.txt に処理するURLがありません"
  exit 0
fi

echo "🔗 対象URL: ${#URLS[@]} 件"
echo ""

# ── 割り当てと実行 ────────────────────────────────────────
TOTAL=${#URLS[@]}
PROCESSED=0
ERRORS=0

for i in "${!URLS[@]}"; do
  URL="${URLS[$i]}"
  NUM="${EMPTY_DIRS[$i]:-}"

  if [ -z "$NUM" ]; then
    echo "⚠️  空きディレクトリが不足しています（${URL} をスキップ）"
    ERRORS=$((ERRORS + 1))
    continue
  fi

  echo "📌 [$NUM] ← $URL"

  if [ "$DRY_RUN" = true ]; then
    echo "   [DRY RUN] bash scripts/instagram-dl.sh $URL $NUM"
    PROCESSED=$((PROCESSED + 1))
    continue
  fi

  if bash scripts/instagram-dl.sh "$URL" "$NUM"; then
    PROCESSED=$((PROCESSED + 1))
    echo "   ✅ [$NUM] ダウンロード完了"
  else
    ERRORS=$((ERRORS + 1))
    echo "   ❌ [$NUM] ダウンロード失敗"
  fi

  echo ""
done

# ── サマリー ──────────────────────────────────────────────
echo "=================================================="
echo " 完了サマリー"
echo "=================================================="
echo "   ダウンロード: $PROCESSED 件"
echo "   エラー:       $ERRORS 件"
echo ""

if [ "$PROCESSED" -gt 0 ] && [ "$DRY_RUN" = false ]; then
  echo "次のステップ: Claude で /column-pipeline を実行して記事を生成してください"
fi
