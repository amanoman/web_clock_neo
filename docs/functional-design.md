# 機能設計書

## 1. システム構成図

```
┌─────────────────────────────────────────┐
│              ブラウザ (Client)           │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │         Next.js App Router      │    │
│  │                                 │    │
│  │  ┌──────────┐  ┌─────────────┐  │    │
│  │  │ ClockPage│  │ClockContainer│  │    │
│  │  │(page.tsx)│→ │('use client')│  │    │
│  │  │[Server]  │  └──────┬──────┘  │    │
│  │  └──────────┘         │        │    │
│  │                ┌──────┴──────┐  │    │
│  │                │useClock()   │  │    │
│  │                │→ now: Date  │  │    │
│  │                │  | null     │  │    │
│  │                └──────┬──────┘  │    │
│  │                        │        │    │
│  │              ┌─────────┴──────┐  │    │
│  │              │ ClockDisplay   │  │    │
│  │              │ (Props: time,  │  │    │
│  │              │  date,         │  │    │
│  │              │  timeDateTime, │  │    │
│  │              │  dateDateTime) │  │    │
│  │              └────────────────┘  │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌──────────────────────────────────┐   │
│  │  Browser API                     │   │
│  │  - Date / Intl.DateTimeFormat    │   │
│  │  - setInterval / clearInterval   │   │
│  │  - document.visibilityState      │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## 2. コンポーネント設計

### ディレクトリ構成

```
src/
├── app/
│   ├── layout.tsx          # ルートレイアウト（フォント・メタデータ・noscript）
│   ├── page.tsx            # トップページ（Server Component）ClockContainerをレンダリング
│   └── globals.css         # グローバルスタイル
├── components/
│   └── ClockDisplay/
│       ├── index.tsx       # ClockDisplayコンポーネント（Presentational）
│       └── ClockDisplay.test.tsx
├── containers/
│   └── ClockContainer/
│       ├── index.tsx       # ClockContainerコンポーネント（'use client'）
│       └── ClockContainer.test.tsx
├── hooks/
│   ├── useClock.ts         # 時刻管理カスタムフック（Date を返す）
│   └── useClock.test.ts
└── lib/
    ├── formatDate.ts       # 日付フォーマットユーティリティ（純粋関数）
    ├── formatDate.test.ts
    ├── formatTime.ts       # 時刻フォーマットユーティリティ（純粋関数）
    └── formatTime.test.ts
```

### Client Component 境界

Next.js App Router では、デフォルトですべてのコンポーネントが Server Component として扱われる。
`useState` / `useEffect` などの React Hooks を使用するコンポーネントには `'use client'` ディレクティブが必要。

| コンポーネント | 種別 | 備考 |
|---------------|------|------|
| `page.tsx` | Server Component | 静的シェルのみ、状態不要 |
| `ClockContainer` | Client Component（`'use client'` 宣言） | `useClock` フックを呼び出し、表示用・機械可読用の両値を組み立てる |
| `ClockDisplay` | `'use client'` 宣言不要。ただし ClockContainer 配下で import されるため実行位置はクライアント側となる。自身は Hooks を使わない Presentational Component | Props を受け取り描画するのみ |

```
page.tsx (Server Component)
  └── <ClockContainer /> ← 'use client' 境界
        ├── useClock()         ← now: Date | null を返す
        ├── formatTime(now)    ← "09:05:03"
        ├── formatDate(now)    ← "2026年4月15日 水曜日"
        ├── toTimeDateTime(now) ← "09:05:03"（machine-readable）
        ├── toDateDateTime(now) ← "2026-04-15"（machine-readable）
        └── <ClockDisplay
              time="09:05:03"
              date="2026年4月15日 水曜日"
              timeDateTime="09:05:03"
              dateDateTime="2026-04-15"
            />
```

### コンポーネント一覧

| コンポーネント | 役割 | Props |
|---------------|------|-------|
| `ClockContainer` | useClock を呼び出し、表示用・機械可読用の各値を計算して ClockDisplay に渡す | なし |
| `ClockDisplay` | 時刻・日付の表示（Presentational Component） | `time`, `date`, `timeDateTime`, `dateDateTime` |

### カスタムフック一覧

| フック | 役割 | 返り値 |
|--------|------|--------|
| `useClock` | 時刻の更新管理のみ。フォーマットは行わない | `{ now: Date \| null }` |

---

## 3. データモデル

### useClock フック

```typescript
type ClockState = {
  now: Date | null   // null = 初期未取得（SSR時はクライアントで未実行）
}
```

### ClockDisplay Props

```typescript
type ClockDisplayProps = {
  time: string          // "HH:MM:SS"（表示用）
  date: string          // "YYYY年M月D日 曜日"（表示用）
  timeDateTime: string  // "HH:MM:SS"（<time dateTime> 機械可読用）
  dateDateTime: string  // "YYYY-MM-DD"（<time dateTime> 機械可読用）
}
```

### フック内部ロジック

```
初期化
  └─ useState で now を null で初期化（Hydration対策）

useEffect マウント時
  ├─ 現在時刻を取得して now を更新
  ├─ setInterval（1000ms）で1秒ごとに更新
  └─ visibilitychange イベントリスナーを登録（同一ハンドラ参照を保持）

visibilitychange ハンドラ
  └─ document.visibilityState === 'visible' の場合のみ即座に now を再取得
     （'hidden' では何もしない）

アンマウント時（cleanup）
  ├─ clearInterval でタイマー解放
  └─ removeEventListener（登録時と同一ハンドラ参照）でイベント解放
```

### 責務分担

| モジュール | 責務 |
|-----------|------|
| `formatTime(date: Date): string` | Date → "HH:MM:SS"（表示用）変換のみ。純粋関数 |
| `formatDate(date: Date): string` | Date → "YYYY年M月D日 曜日"（表示用）変換のみ。純粋関数 |
| `useClock()` | タイマー管理・visibilitychange 監視・state 更新のみ。`now: Date \| null` を返す |
| `ClockContainer` | useClock の呼び出し、表示用文字列と機械可読値の組み立て、ClockDisplay へのデータ受け渡し |
| `ClockDisplay` | 受け取った Props の描画のみ |

---

## 4. 画面設計・ワイヤーフレーム

### レイアウト構造

```
┌──────────────────────────────────┐
│                                  │
│                                  │
│          09:05:03                │  ← 時刻（中央・大）
│                                  │
│       2026年4月15日 水曜日        │  ← 日付（下部）
│                                  │
│                                  │
└──────────────────────────────────┘
```

> **DOM順と読み上げ順：** 時刻を先にレンダリングし（最重要情報）、日付を後にする。スクリーンリーダーは DOM 順に読み上げるため「現在時刻 → 今日の日付」の順になる。

### デザイントークン

| トークン | 値 | 用途 |
|---------|-----|------|
| フォント（時刻） | `font-mono`（Tailwind） | 桁ズレ防止 |
| フォントサイズ（時刻・モバイル） | `text-5xl`（= 48px） | 375px時点で32px以上を確保 |
| フォントサイズ（時刻・デスクトップ） | `text-8xl`（= 96px） | 大画面での視認性 |
| フォントサイズ（日付・モバイル） | `text-lg`（= 18px） | 375px時点で16px以上を確保 |
| フォントサイズ（日付・デスクトップ） | `text-2xl`（= 24px） | 大画面での視認性 |
| 背景色 | `bg-gray-950` | ダークトーン |
| 時刻テキスト色 | `text-white` | コントラスト比確保 |
| 日付テキスト色 | `text-gray-400` | 時刻より控えめ |
| レイアウト | `flex flex-col items-center justify-center min-h-screen` | 中央寄せ |

### アクセシビリティ設計

```html
<main>
  <!-- 時刻を先にレンダリング（スクリーンリーダー読み上げ順：時刻 → 日付） -->
  <time dateTime="09:05:03">09:05:03</time>
  <time dateTime="2026-04-15">2026年4月15日 水曜日</time>
</main>
```

- `<time>` 要素を使用してセマンティクスを確保
- `dateTime` 属性：時刻は `"HH:MM:SS"`、日付は `"YYYY-MM-DD"` 形式（機械可読）
- `aria-label` は付与しない。`<time>` の本文テキストをそのままスクリーンリーダーに読ませる（値を隠すリスクを避ける）
- 毎秒更新に対して `aria-live` は付与しない（毎秒の読み上げは実用性を損なうため）
- 読み上げ順：時刻 → 日付（DOM順に従う。最重要情報を先に読み上げ）
- `<noscript>` タグを `layout.tsx` に配置

---

## 5. 日付フォーマット仕様

### formatDate ユーティリティ

```typescript
// 入力: Date オブジェクト
// 出力: "YYYY年M月D日 曜日"（ja-JP ロケール固定）
// 実装: formatToParts() を使用して部品ごとに組み立て、出力形式を厳密保証する

const formatter = new Intl.DateTimeFormat('ja-JP', {
  year: 'numeric',
  month: 'long',   // "4月"
  day: 'numeric',  // "15日"（ゼロ埋めなし）
  weekday: 'long', // "水曜日"
})

// formatToParts() で各パーツを取得し、"YYYY年M月D日 曜日" に組み立てる
// Intl の実装差異による空白・区切り文字のズレを防ぐ
```

### formatTime ユーティリティ

```typescript
// 入力: Date オブジェクト
// 出力: "HH:MM:SS"（ゼロパディングあり）

const pad = (n: number) => String(n).padStart(2, '0')
// => `${pad(h)}:${pad(m)}:${pad(s)}`
```

---

## 6. Hydration対策

Next.jsではSSR時にサーバーサイドで生成されたHTMLとクライアントサイドのDOMが一致しない場合にHydrationエラーが発生する。時刻は毎秒変わるため、サーバー/クライアント間で必ず差分が生じる。

### 対策方針

```typescript
// NG: サーバーサイドで時刻を生成するとHydrationエラーになる
const [now, setNow] = useState(new Date())

// OK: 初期値を null にしてuseEffect内で初期化する
const [now, setNow] = useState<Date | null>(null)

useEffect(() => {
  setNow(new Date()) // クライアントのみで実行
  const id = setInterval(() => setNow(new Date()), 1000)
  return () => clearInterval(id)
}, [])
```

### 初期表示（now === null）の扱い

SSR時は `now` が `null` となるため、ClockContainer / ClockDisplay 側でローディング状態を明示する。

```typescript
// ClockContainer での null ガード
if (!now) return null  // SSR時はDOMを出力しない（Hydration差分を防ぐ）
```

- SSR 出力は空（または Skeleton UI）とし、クライアント初回レンダリング後に時刻を表示する
- これにより SSR HTML とクライアント初回描画の差分がゼロになり、Hydration 警告が発生しない

---

## 7. テスト設計

### formatTime / formatDate ユーティリティ（純粋関数）

| テストケース | 確認内容 |
|------------|---------|
| formatTime の出力形式 | `"HH:MM:SS"` 形式・ゼロパディングあり |
| formatTime の境界値 | 00:00:00 / 23:59:59 が正しく出力される |
| formatDate の出力形式 | `"YYYY年M月D日 曜日"` 形式（ja-JP） |
| formatDate の月・日 | ゼロ埋めなし（例：4月5日） |

### useClock フック

| テストケース | 確認内容 |
|------------|---------|
| 初期値 | `now` が `null` で初期化される |
| マウント後 | `now` が `Date` インスタンスになる |
| 1秒経過 | fake timers で 1000ms 進めると `now` が更新される |
| cleanup（interval） | アンマウント時に `clearInterval` が呼ばれる |
| cleanup（event） | アンマウント時に `removeEventListener` が呼ばれ、引数が `addEventListener` と同一ハンドラ参照である |
| visibilitychange（復帰） | `visibilityState === 'visible'` で `now` が即座に再取得される |
| visibilitychange（非更新） | `visibilityState !== 'visible'`（hidden 等）では `now` が再取得されない |

### ClockDisplay コンポーネント

| テストケース | 確認内容 |
|------------|---------|
| レンダリング | time・dateが画面に表示される |
| DOM順 | 時刻要素が日付要素より前にレンダリングされる |
| dateTime属性（時刻） | `<time dateTime="HH:MM:SS">` が設定されている |
| dateTime属性（日付） | `<time dateTime="YYYY-MM-DD">` が設定されている |

### ClockContainer / 統合テスト

| テストケース | 確認内容 |
|------------|---------|
| 初期描画（null） | `now === null` 時は何も描画しない（SSR 差分なし） |
| Hydration警告なし | ブラウザコンソールに `hydration warning / error` が出ないこと |
| noscript表示 | JS無効環境で `<noscript>` に「JavaScriptを有効にしてください」が表示される |

### レスポンシブ（目視確認）

| ビューポート | 確認内容 |
|------------|---------|
| 320px | 横スクロールなし・コンテンツがviewport内に収まる |
| 375px | 時刻32px以上・日付16px以上 |
| 768px | 横スクロールなし |
| 1440px | 横スクロールなし |
| 1920px | 横スクロールなし |

---

## 8. 将来的な拡張ポイント（v2以降）

- ダークモード：`next-themes` を使用したテーマ切り替え
- タイムゾーン選択：`Intl.DateTimeFormat` の `timeZone` オプションを活用
- 国際化（i18n）：`next-intl` を導入し、ロケールをブラウザ設定に追従
