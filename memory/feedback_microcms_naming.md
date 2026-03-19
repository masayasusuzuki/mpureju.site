---
name: microCMS命名規則
description: microCMSのAPI名は日本語、エンドポイントは英語で統一する
type: feedback
---

microCMSのAPI作成時、API名（管理画面に表示される名前）は必ず日本語にする。エンドポイント（APIリクエストに使うパス）は英語。

- API名: 採用情報 / エンドポイント: recruit
- API名: 施術情報 / エンドポイント: treatments
- API名: お知らせ / エンドポイント: news

**Why:** ユーザーが明確に指示。microCMS管理画面を日本語で運用するため。

**How to apply:** スキーマ提案時・ドキュメント記載時に、API名とエンドポイントを区別して両方明記する。API名を英語で書かない。
