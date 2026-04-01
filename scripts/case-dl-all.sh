#!/bin/bash
# ============================================================
# case-dl-all.sh
# public/case/urls.txt の未処理URLを空の番号ディレクトリに順番にDL
#
# 使い方:
#   bash scripts/case-dl-all.sh                    # 全未処理を実行
#   bash scripts/case-dl-all.sh --login USERNAME   # ログイン付き
#   bash scripts/case-dl-all.sh --dry-run          # 確認のみ
# ============================================================

set -e

URLS_FILE="public/case/urls.txt"
DRY_RUN=false
LOGIN_ARG=""

# ── 引数パース ──────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY_RUN=true; shift ;;
    --login)   LOGIN_ARG="--login $2"; shift 2 ;;
    *)         shift ;;
  esac
done

# ── ファイル存在確認 ──────────────────────────────────────
if [ ! -f "$URLS_FILE" ]; then
  echo "❌ $URLS_FILE が見つかりません"
  exit 1
fi

echo "=================================================="
echo " 症例写真 一括ダウンロード"
echo "=================================================="
echo ""

# ── 空の番号ディレクトリを番号順に取得 ────────────────────
EMPTY_DIRS=()
while IFS= read -r d; do
  BASENAME=$(basename "$d")
  if [[ "$BASENAME" =~ ^[0-9]+$ ]]; then
    MEDIA_COUNT=$(find "$d" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.mp4" \) 2>/dev/null | wc -l | tr -d ' ')
    HAS_ARTICLE=$([ -f "$d/article.md" ] && echo "1" || echo "0")
    if [ "$MEDIA_COUNT" -eq 0 ] && [ "$HAS_ARTICLE" = "0" ]; then
      EMPTY_DIRS+=("$BASENAME")
    fi
  fi
done < <(find public/case -maxdepth 1 -type d | sort -V)

if [ ${#EMPTY_DIRS[@]} -eq 0 ]; then
  echo "⚠️  空の番号ディレクトリが見つかりません"
  exit 0
fi

LAST_IDX=$((${#EMPTY_DIRS[@]} - 1))
echo "📂 空きディレクトリ: ${#EMPTY_DIRS[@]} 件 (${EMPTY_DIRS[0]}〜${EMPTY_DIRS[$LAST_IDX]})"
echo ""

# ── URLリストを読み込む ────────────────────────────────────
URLS=()
while IFS= read -r line; do
  [[ "$line" =~ ^#.*$ || -z "$line" ]] && continue
  # Gyazo等の非InstagramURLはスキップ
  if [[ ! "$line" =~ instagram\.com ]]; then
    echo "⏭️  非InstagramURL スキップ: $line"
    continue
  fi
  URLS+=("$line")
done < "$URLS_FILE"

if [ ${#URLS[@]} -eq 0 ]; then
  echo "⚠️  urls.txt に処理するURLがありません"
  exit 0
fi

echo "🔗 対象URL: ${#URLS[@]} 件"
echo ""

# ── instaloader 確認 ──────────────────────────────────────
if ! python3 -c "import instaloader" &>/dev/null; then
  echo "📦 instaloader をインストールしています..."
  pip3 install instaloader
fi
INSTALOADER="python3 -m instaloader"

# ── ダウンロード実行 ──────────────────────────────────────
TOTAL=${#URLS[@]}
PROCESSED=0
ERRORS=0

for i in "${!URLS[@]}"; do
  URL="${URLS[$i]}"
  NUM="${EMPTY_DIRS[$i]:-}"

  if [ -z "$NUM" ]; then
    echo "⚠️  空きディレクトリが不足（${URL} をスキップ）"
    ERRORS=$((ERRORS + 1))
    continue
  fi

  # ショートコード抽出
  SHORTCODE=$(echo "$URL" | grep -oE '/(p|reel|tv)/([A-Za-z0-9_-]+)' | tail -1 | grep -oE '[A-Za-z0-9_-]+$')
  if [ -z "$SHORTCODE" ]; then
    echo "❌ [$NUM] ショートコード取得失敗: $URL"
    ERRORS=$((ERRORS + 1))
    continue
  fi

  echo "📌 [$NUM] $SHORTCODE ← $URL"

  if [ "$DRY_RUN" = true ]; then
    echo "   [DRY RUN] スキップ"
    PROCESSED=$((PROCESSED + 1))
    continue
  fi

  # ダウンロード
  TMP_DIR=$(mktemp -d)
  if $INSTALOADER $LOGIN_ARG \
    --dirname-pattern="$TMP_DIR" \
    --no-metadata-json \
    --no-video-thumbnails \
    -- "-$SHORTCODE" 2>&1; then

    # ファイル整理
    OUT_DIR="public/case/$NUM"
    IMG_COUNT=0
    VID_COUNT=0
    CAPTION_SAVED=0

    for f in "$TMP_DIR"/*; do
      [ -f "$f" ] || continue
      ext="${f##*.}"
      ext_lower=$(echo "$ext" | tr '[:upper:]' '[:lower:]')
      case "$ext_lower" in
        jpg|jpeg|png|webp)
          IMG_COUNT=$((IMG_COUNT + 1))
          cp "$f" "$OUT_DIR/image_${IMG_COUNT}.${ext_lower}"
          ;;
        mp4|mov|m4v)
          VID_COUNT=$((VID_COUNT + 1))
          cp "$f" "$OUT_DIR/video_${VID_COUNT}.${ext_lower}"
          ;;
        txt)
          if [ "$CAPTION_SAVED" -eq 0 ]; then
            cp "$f" "$OUT_DIR/caption.txt"
            CAPTION_SAVED=1
          fi
          ;;
      esac
    done

    rm -rf "$TMP_DIR"
    PROCESSED=$((PROCESSED + 1))
    echo "   ✅ 画像${IMG_COUNT}枚 動画${VID_COUNT}本 キャプション$([ $CAPTION_SAVED -eq 1 ] && echo 'あり' || echo 'なし')"
  else
    rm -rf "$TMP_DIR"
    ERRORS=$((ERRORS + 1))
    echo "   ❌ ダウンロード失敗"
  fi

  # レート制限回避: 3秒待機
  [ "$DRY_RUN" = false ] && sleep 3

  echo ""
done

# ── サマリー ──────────────────────────────────────────────
echo "=================================================="
echo " 完了サマリー"
echo "=================================================="
echo "   成功: $PROCESSED 件"
echo "   失敗: $ERRORS 件"
echo ""
echo "次のステップ: Claude で記事生成・microCMS投稿を実行してください"
