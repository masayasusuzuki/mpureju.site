#!/bin/bash
# ============================================================
# instagram-dl.sh
# Instagram の投稿URL から画像・動画・投稿文をダウンロードする
#
# 使い方:
#   bash scripts/instagram-dl.sh <URL> [出力フォルダ名]
#
# 例:
#   bash scripts/instagram-dl.sh https://www.instagram.com/reel/ABC123/
#   bash scripts/instagram-dl.sh https://www.instagram.com/reel/ABC123/ 003_日焼け止めと紫外線の怖い話
# ============================================================

set -e

URL="$1"
FOLDER_NAME="$2"

# ── 引数チェック ──────────────────────────────────────────
if [ -z "$URL" ]; then
  echo "使い方: bash scripts/instagram-dl.sh <Instagram URL> [フォルダ名]"
  echo "例:     bash scripts/instagram-dl.sh https://www.instagram.com/reel/ABC123/"
  exit 1
fi

# ── ショートコード抽出 ────────────────────────────────────
SHORTCODE=$(echo "$URL" | grep -oE '/(p|reel|tv)/([A-Za-z0-9_-]+)' | tail -1 | grep -oE '[A-Za-z0-9_-]+$')

if [ -z "$SHORTCODE" ]; then
  echo "❌ URLからショートコードを取得できませんでした"
  echo "   対応形式: https://www.instagram.com/reel/XXXX/ または /p/XXXX/"
  exit 1
fi

echo "📎 ショートコード: $SHORTCODE"

# ── 出力ディレクトリ ──────────────────────────────────────
if [ -n "$FOLDER_NAME" ]; then
  OUT_DIR="public/column/${FOLDER_NAME}"
else
  OUT_DIR="public/column/tmp_${SHORTCODE}"
fi

mkdir -p "$OUT_DIR"
echo "📂 保存先: $OUT_DIR"

# ── instaloader インストール確認 ──────────────────────────
if ! python3 -c "import instaloader" &>/dev/null; then
  echo "📦 instaloader をインストールしています..."
  pip3 install instaloader
  echo "✅ インストール完了"
fi
INSTALOADER="python3 -m instaloader"

# ── ダウンロード ──────────────────────────────────────────
TMP_DIR=$(mktemp -d)
echo "⬇️  ダウンロード中..."

$INSTALOADER \
  --dirname-pattern="$TMP_DIR" \
  --no-metadata-json \
  --no-video-thumbnails \
  -- "-$SHORTCODE"

# ── ファイル整理 ──────────────────────────────────────────
echo "📁 ファイルを整理中..."

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

# ── 結果表示 ──────────────────────────────────────────────
echo ""
echo "✅ 完了"
echo "   📸 画像: ${IMG_COUNT} 枚"
echo "   🎬 動画: ${VID_COUNT} 本"
echo "   📝 キャプション: $([ $CAPTION_SAVED -eq 1 ] && echo '保存済み' || echo 'なし')"
echo "   📂 保存先: $OUT_DIR"
echo ""

if [ "$CAPTION_SAVED" -eq 1 ]; then
  echo "─────── キャプション ───────"
  cat "$OUT_DIR/caption.txt"
  echo "────────────────────────────"
fi

echo ""
echo "次のステップ: /column-article-creator を実行してコラム記事を生成できます"
