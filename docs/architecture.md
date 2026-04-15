# 技術仕様書

## 1. テクノロジースタック

| レイヤー | 技術 | バージョン |
|---------|------|----------|
| ランタイム | Node.js | 20.x LTS |
| フレームワーク | Next.js（App Router） | 15系 |
| 言語 | TypeScript | 5系 |
| CSSフレームワーク | Tailwind CSS | 4系 |
| パッケージ管理 | npm | Node.js 同梱版 |
| テスト | Vitest | 2系 |
| テストユーティリティ | @testing-library/react | 16系 |
| ホスティング | Vercel | — |

> **バージョン方針：** 各ライブラリの採用メジャーバージョンは上記の通り。実際のパッチバージョンは `package.json` を正とする。

---

## 2. アーキテクチャ方針

### レンダリング戦略

Next.js App Router を使用する。時計アプリはすべての状態をクライアントサイドで管理するため、Server Component はレイアウトシェルのみに留め、動的部分は Client Component に閉じ込める。

| コンポーネント | レンダリング | 理由 |
|---------------|------------|------|
| `layout.tsx` | Server Component | フォント・メタデータ・noscript の静的シェル |
| `page.tsx` | Server Component | `ClockContainer` を配置する静的シェル |
| `ClockContainer` | Client Component（`'use client'`） | Hooks（useState / useEffect）が必要 |
| `ClockDisplay` | クライアント側で実行（`'use client'` 宣言不要） | `ClockContainer` の内側で使われる Presentational Component |

### アクセシビリティ方針

アクセシビリティの詳細設計（`<time>` 要素の使い方、`dateTime` 属性、読み上げ順など）は `functional-design.md` に従う。

### データフロー

外部 API・データベースは一切使用しない。すべての状態はブラウザのローカルタイム（`new Date()`）から生成される。

```
Browser Date API
  → useClock（now: Date | null）
    → ClockContainer（formatTime / formatDate / datetime 値を組み立て）
      → ClockDisplay（Props を受けて描画）
```

---

## 3. ディレクトリ構成方針

```
src/
├── app/                  # Next.js App Router（ルーティング・レイアウト）
├── components/           # Presentational Components
├── containers/           # Client Components（状態・ロジックを持つ）
├── hooks/                # カスタムフック
└── lib/                  # 純粋関数ユーティリティ（フォーマット等）
```

詳細は `repository-structure.md` を参照。

---

## 4. 開発ツールと手法

| ツール | 用途 |
|-------|------|
| TypeScript | 型安全な実装 |
| ESLint（Next.js 組み込み設定） | コード品質チェック |
| Prettier | コードフォーマット |
| Vitest | ユニットテスト（fake timers・@testing-library/react） |

---

## 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開く。

---

## 6. ビルド・デプロイ

```bash
# 本番ビルド
npm run build

# ビルド結果の動作確認
npm run start
```

### デプロイ先

Vercel にデプロイする。`main` ブランチへの push で自動デプロイ。
静的サイトに近い構成（外部 API なし）のため、無料プランで運用可能。

---

## 7. 技術的制約と要件

- 時刻取得・表示はすべてクライアントサイドで完結する。バックエンドへの API リクエストは不要
- タイムゾーンはブラウザのローカルタイムゾーンに従う（v1 固定。変更不可）
- ロケールは `ja-JP` 固定（v1 固定。i18n 対応は v2 以降）
- JavaScript が無効な環境では `<noscript>` タグで利用不可メッセージを表示する
- SSR と CSR の Hydration 差分を防ぐため、時刻の初期値は `null` とし `useEffect` 内で初期化する

---

## 8. パフォーマンス要件

| 項目 | 区分 | 要件 | 測定条件 |
|------|------|------|----------|
| 時刻の初回表示 | リリースブロッカー | 1秒以内 | Vercel Preview 環境、モバイル設定、Lighthouse デフォルト（Fast 3G 相当） |
| 時刻更新精度 | リリースブロッカー | システム時刻との差分 ±1秒以内 | setInterval 1000ms |
| Lighthouse Performance | ストレッチゴール | 90以上（未達でもリリース可） | 本番ビルドのトップページをモバイル設定で計測 |
| Lighthouse Accessibility | ストレッチゴール | 90以上（未達でもリリース可） | 同上 |

---

## 9. ブラウザ対応

| ブラウザ | 対応バージョン | 備考 |
|---------|-------------|------|
| Chrome | 最新2バージョン | Android Chrome を含む |
| Firefox | 最新2バージョン | — |
| Safari | 最新2バージョン | iOS Safari を含む |
| Edge | 最新2バージョン | — |

---

## 10. 将来的な技術拡張（v2以降）

| 機能 | 候補技術 |
|------|---------|
| テーマ切り替え（ダークモード） | `next-themes` |
| タイムゾーン選択 | `Intl.DateTimeFormat` の `timeZone` オプション |
| 国際化（i18n） | `next-intl` |
| E2E テスト | Playwright |
