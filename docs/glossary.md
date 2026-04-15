# ユビキタス言語定義

## 1. ドメイン用語

| 日本語 | 英語 | 定義 |
|--------|------|------|
| 時計 | Clock | ブラウザのローカルタイムゾーンに基づく現在時刻をリアルタイムで表示する機能 |
| 現在時刻 | Current Time | `setInterval` で1秒ごとに更新される時・分・秒の値（24時間表記・ゼロパディングあり） |
| 日付 | Date | 年・月・日・曜日を日本語（ja-JP ロケール）で表示した文字列 |
| 曜日 | Weekday | 月曜日〜日曜日の漢字表記（`Intl.DateTimeFormat` の `weekday: 'long'` オプションで取得） |
| タイムゾーン | Timezone | ブラウザのローカルタイムゾーン。v1 では変更不可 |
| ロケール | Locale | 言語・地域設定。v1 では `ja-JP` 固定 |

---

## 2. 技術用語

| 日本語 | 英語 | 定義 |
|--------|------|------|
| 時刻更新フック | useClock | 現在時刻（`now: Date \| null`）を管理するカスタムフック。タイマー管理・visibilitychange 監視を担う |
| 時刻コンテナ | ClockContainer | `useClock` を呼び出し、表示用文字列と機械可読値を組み立てて `ClockDisplay` に渡す Client Component |
| 時計表示 | ClockDisplay | `time` / `date` / `timeDateTime` / `dateDateTime` を Props として受け取り描画する Presentational Component |
| 時刻フォーマット | formatTime | `Date` → `"HH:MM:SS"` に変換する純粋関数 |
| 日付フォーマット | formatDate | `Date` → `"YYYY年M月D日 曜日"` に変換する純粋関数（`formatToParts` で厳密組み立て） |
| 機械可読時刻 | timeDateTime | `<time dateTime>` 属性に設定する機械可読形式の時刻文字列（`"HH:MM:SS"`） |
| 機械可読日付 | dateDateTime | `<time dateTime>` 属性に設定する機械可読形式の日付文字列（`"YYYY-MM-DD"`） |
| Hydration | Hydration | SSR で生成された HTML をクライアント側の React が引き継いで有効化する処理。SSR HTML と初回描画が一致しない場合は Hydration エラーが発生する。時刻の初期値を `null` にして `useEffect` 内で初期化することでエラーを防ぐ |
| タブ復帰再同期 | Tab Reactivation Resync | `visibilitychange` イベントを監視し、タブが非アクティブから復帰した際に即座に時刻を再取得すること |
| サーバーコンポーネント | Server Component | Next.js App Router においてサーバーサイドでレンダリングされるコンポーネント。`useState` / `useEffect` は使用不可 |
| クライアントコンポーネント | Client Component | `'use client'` ディレクティブを付けたコンポーネント。ブラウザ上で実行され Hooks が使用可能 |
| プレゼンテーショナルコンポーネント | Presentational Component | Props を受け取って描画のみを行うコンポーネント。Hooks や状態管理を持たない。v1 では主に `src/components/` に配置する |
| Client Component 境界 | Client Boundary | `'use client'` を付けたコンポーネントが起点となるクライアント実行の境界。境界より内側はすべてクライアントで実行される |

---

## 3. UI/UX 用語

| 日本語 | 英語 | 定義 |
|--------|------|------|
| ダークトーン背景 | Dark Background | `bg-gray-950` で表現される暗いグレー系背景 |
| モノスペースフォント | Monospace Font | 桁ズレを防ぐために時刻表示に使用する等幅フォント（Tailwind `font-mono`） |
| レスポンシブ | Responsive | 320px〜1920px の各ビューポートで横スクロールなく表示できる状態 |

---

## 4. コード上の命名規則

| 概念 | コード上の名前 | 備考 |
|-----|-------------|------|
| 現在時刻（Date オブジェクト） | `now` | `useClock` フックの state 名・返り値名 |
| 表示用時刻文字列 | `time` | `"HH:MM:SS"` 形式。ClockDisplay の Props 名 |
| 表示用日付文字列 | `date` | `"YYYY年M月D日 曜日"` 形式。ClockDisplay の Props 名 |
| 機械可読時刻 | `timeDateTime` | `<time dateTime>` 用。ClockDisplay の Props 名 |
| 機械可読日付 | `dateDateTime` | `<time dateTime>` 用。ClockDisplay の Props 名 |
| 時刻更新フック | `useClock` | カスタムフック名 |
| 時刻フォーマット関数 | `formatTime` | `src/lib/formatTime.ts` で定義 |
| 日付フォーマット関数 | `formatDate` | `src/lib/formatDate.ts` で定義 |

---

## 5. 英語・日本語対応表

| 英語 | 日本語 |
|------|--------|
| Clock | 時計 |
| Current Time | 現在時刻 |
| Date | 日付 |
| Weekday | 曜日 |
| Timezone | タイムゾーン |
| Locale | ロケール |
| Hydration | ハイドレーション（Hydration エラー） |
| Server Component | サーバーコンポーネント |
| Client Component | クライアントコンポーネント |
| Presentational Component | プレゼンテーショナルコンポーネント |
| Custom Hook | カスタムフック |
| Pure Function | 純粋関数 |
