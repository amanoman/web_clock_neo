# 設計：ストップウォッチ機能

## データフロー

```
useStopwatch（elapsed: number, status: StopwatchStatus, start/stop/reset）
  → StopwatchContainer（formatStopwatch で表示文字列生成）
    → StopwatchDisplay（Props を受けて描画）
```

## 新規ファイル

| ファイル | 役割 |
|--------|------|
| `src/lib/formatStopwatch.ts` | elapsed(ms) → "MM:SS.xx" 純粋関数 |
| `src/lib/formatStopwatch.test.ts` | 上記のテスト |
| `src/hooks/useStopwatch.ts` | ストップウォッチ状態管理フック |
| `src/hooks/useStopwatch.test.ts` | 上記のテスト |
| `src/components/StopwatchDisplay/index.tsx` | Presentational Component |
| `src/components/StopwatchDisplay/StopwatchDisplay.test.tsx` | 上記のテスト |
| `src/containers/StopwatchContainer/index.tsx` | Client Component（'use client'） |
| `src/containers/StopwatchContainer/StopwatchContainer.test.tsx` | 上記のテスト |

## 変更ファイル

| ファイル | 変更内容 |
|--------|---------|
| `src/app/page.tsx` | StopwatchContainer を ClockContainer の下に追加 |
| `src/components/ClockDisplay/index.tsx` | フォントサイズクラスを追加（text-5xl md:text-8xl / text-lg md:text-2xl） |

## 型定義

```typescript
type StopwatchStatus = 'idle' | 'running' | 'paused'

type UseStopwatchReturn = {
  elapsed: number        // ミリ秒
  status: StopwatchStatus
  start: () => void
  stop: () => void
  reset: () => void
}
```

## useStopwatch 実装方針

- `elapsed`: 経過ミリ秒（初期値 0）
- `status`: 'idle' | 'running' | 'paused'（初期値 'idle'）
- `startTime`: running 開始時刻を ref で保持
- `intervalId`: setInterval の id を ref で保持
- 10ms 間隔で elapsed を更新（センチ秒精度）
- cleanup でタイマーをクリア

## formatStopwatch 実装方針

```typescript
// input: elapsed ms
// output: "MM:SS.xx"
const totalCs = Math.floor(elapsed / 10)  // センチ秒
const cs = totalCs % 100
const totalSec = Math.floor(totalCs / 100)
const sec = totalSec % 60
const min = Math.floor(totalSec / 60)
return `${pad(min)}:${pad(sec)}.${pad(cs)}`
```

## フォントサイズ方針

既存 functional-design.md のデザイントークンに従う:

| 要素 | クラス |
|------|-------|
| ストップウォッチ時間 | `text-5xl md:text-8xl` （時計の時刻と同じ） |
| ボタン | `text-sm md:text-base` |

## page.tsx レイアウト

```
<main className="... gap-16">
  <ClockContainer />
  <StopwatchContainer />
</main>
```
