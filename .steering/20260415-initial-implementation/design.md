# 実装設計（初回実装）

## 実装アプローチ

`docs/functional-design.md` の設計に従い実装する。
コンポーネント構造・データフロー・Hydration 対策はすべて設計書を正とする。

---

## コンポーネント構成

```
page.tsx (Server Component)
  └── <ClockContainer />  ← 'use client' 境界
        ├── useClock()    ← now: Date | null を返す
        ├── formatTime(now)      → "09:05:03"
        ├── formatDate(now)      → "2026年4月15日 水曜日"
        ├── toTimeDateTime(now)  → "09:05:03"（machine-readable）
        ├── toDateDateTime(now)  → "2026-04-15"（machine-readable）
        └── <ClockDisplay
              time="09:05:03"
              date="2026年4月15日 水曜日"
              timeDateTime="09:05:03"
              dateDateTime="2026-04-15"
            />
```

---

## 変更・新規作成ファイル

| ファイル | 種別 | 内容 |
|---------|------|------|
| `src/app/layout.tsx` | 新規 | ルートレイアウト。フォント・メタデータ・`<noscript>` |
| `src/app/page.tsx` | 新規 | Server Component。`<ClockContainer>` を配置 |
| `src/app/globals.css` | 新規 | Tailwind CSS ベースライン |
| `src/containers/ClockContainer/index.tsx` | 新規 | `'use client'`。`useClock` 呼び出し・値の組み立て・`ClockDisplay` への受け渡し |
| `src/containers/ClockContainer/ClockContainer.test.tsx` | 新規 | `now === null` 時の初期描画・Hydration 差分テスト |
| `src/components/ClockDisplay/index.tsx` | 新規 | Presentational Component。Props を受け取り描画 |
| `src/components/ClockDisplay/ClockDisplay.test.tsx` | 新規 | DOM 順・`dateTime` 属性・描画テスト |
| `src/hooks/useClock.ts` | 新規 | `now: Date \| null` を返すカスタムフック |
| `src/hooks/useClock.test.ts` | 新規 | タイマー更新・cleanup・visibilitychange テスト |
| `src/lib/formatTime.ts` | 新規 | `Date → "HH:MM:SS"` 純粋関数 |
| `src/lib/formatTime.test.ts` | 新規 | 出力形式・境界値テスト |
| `src/lib/formatDate.ts` | 新規 | `Date → "YYYY年M月D日 曜日"` 純粋関数（`formatToParts` 使用） |
| `src/lib/formatDate.test.ts` | 新規 | 出力形式・ゼロ埋めなし・曜日テスト |
| `vitest.config.ts` | 新規 | Vitest 設定（jsdom 環境・coverage provider 指定） |
| `src/test/setup.ts` | 新規 | `@testing-library/jest-dom` の import |

---

## 各ファイルの実装ポイント

### `src/lib/formatTime.ts`

```typescript
export function formatTime(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}
```

### `src/lib/formatDate.ts`

`Intl.DateTimeFormat.formatToParts()` でパーツごとに組み立て、
出力文字列 `"YYYY年M月D日 曜日"` を厳密に保証する。

```typescript
const formatter = new Intl.DateTimeFormat('ja-JP', {
  year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
})
// formatToParts() → { type: 'year', value: '2026' } ... を組み立て
```

### `src/hooks/useClock.ts`

- `useState<Date | null>(null)` で初期化（Hydration 対策）
- `useEffect` 内で `setNow(new Date())` → `setInterval(1000ms)`
- `visibilitychange` イベントで `visible` 時のみ即座に再取得
- cleanup で `clearInterval` + `removeEventListener`（同一ハンドラ参照）

### `src/containers/ClockContainer/index.tsx`

- `'use client'` ディレクティブ
- `useClock()` で `now` を取得
- `now === null` の場合は `return null`（SSR 出力なし）
- `formatTime` / `formatDate` で表示用文字列を生成
- `toTimeDateTime`：`now` から `"HH:MM:SS"` を生成
- `toDateDateTime`：`now` から `"YYYY-MM-DD"` を生成
- `<ClockDisplay>` に4つの Props を渡す

### `src/components/ClockDisplay/index.tsx`

```tsx
<main>
  <time dateTime={timeDateTime}>{time}</time>
  <time dateTime={dateDateTime}>{date}</time>
</main>
```

- 時刻を先にレンダリング（DOM 順 = 読み上げ順：時刻→日付）
- `aria-label` は付与しない
- `aria-live` は付与しない（毎秒読み上げ防止）

### `src/app/layout.tsx`

```tsx
<noscript>JavaScriptを有効にしてください</noscript>
```

---

## Tailwind CSS デザイントークン

| 要素 | クラス |
|------|--------|
| 背景 | `bg-gray-950 min-h-screen` |
| レイアウト | `flex flex-col items-center justify-center` |
| 時刻（モバイル） | `font-mono text-5xl text-white` |
| 時刻（デスクトップ） | `md:text-8xl` |
| 日付（モバイル） | `text-lg text-gray-400` |
| 日付（デスクトップ） | `md:text-2xl` |

---

## 影響範囲

初回実装のため既存コードへの影響はなし。
Next.js プロジェクトの初期化（`npx create-next-app`）から始める。

---

## 環境セットアップ手順

```bash
cd /home/axmxn/src
npx create-next-app@15 web_clock_neo \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --no-turbopack \
  --import-alias "@/*"
cd web_clock_neo
```

> **バージョン方針：** `create-next-app@15` で Next.js 15系（`architecture.md` 採用メジャー）に固定する。
> 初期化後に `package.json` を確認し、`architecture.md` の採用メジャーバージョンと一致していることを確認する。

テストの追加：

```bash
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom @vitest/coverage-v8
```

`vitest.config.ts` の設定例：

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
})
```

`package.json` scripts に追加：

```json
"test": "vitest",
"test:ci": "vitest run",
"test:coverage": "vitest run --coverage"
```
