# タスクリスト：ストップウォッチ機能

## 進捗凡例
- `[ ]` 未着手
- `[x]` 完了

---

## フェーズ 1：ユーティリティ実装

- [x] 1-1. `src/lib/formatStopwatch.ts` を実装（elapsed ms → "MM:SS.xx"）
- [x] 1-2. `src/lib/formatStopwatch.test.ts` を実装・パス確認
  - 00:00.00（初期値）
  - 00:00.01（10ms）
  - 00:01.00（1秒）
  - 01:00.00（1分）
  - センチ秒・秒・分のゼロパディング確認

## フェーズ 2：フック実装

- [x] 2-1. `src/hooks/useStopwatch.ts` を実装
  - elapsed: number（初期値 0）
  - status: StopwatchStatus（初期値 'idle'）
  - start / stop / reset 関数
  - 10ms 間隔で elapsed 更新
  - cleanup でタイマー解放
- [x] 2-2. `src/hooks/useStopwatch.test.ts` を実装・パス確認
  - 初期値 elapsed=0, status='idle'
  - start() → status='running', elapsed が増加する
  - stop() → status='paused', elapsed が止まる
  - reset() → elapsed=0, status='idle'
  - アンマウント時に clearInterval が呼ばれる

## フェーズ 3：コンポーネント実装

- [x] 3-1. `src/components/StopwatchDisplay/index.tsx` を実装
  - Props: `elapsed: string`, `status: StopwatchStatus`, `onStart`, `onStop`, `onReset`
  - 経過時間表示（text-5xl md:text-8xl font-mono）
  - Start / Stop / Reset ボタン
- [x] 3-2. `src/components/StopwatchDisplay/StopwatchDisplay.test.tsx` を実装・パス確認
  - elapsed が描画される
  - idle 時: Start ボタンが表示される
  - running 時: Stop ボタンが表示される
  - paused 時: Start ボタンと Reset ボタンが表示される
  - 各ボタンのクリックでコールバックが呼ばれる
- [x] 3-3. `src/containers/StopwatchContainer/index.tsx` を実装
  - 'use client'
  - useStopwatch() で状態取得
  - formatStopwatch で表示文字列生成
  - StopwatchDisplay に Props を渡す
- [x] 3-4. `src/containers/StopwatchContainer/StopwatchContainer.test.tsx` を実装・パス確認
  - 初期表示 "00:00.00"

## フェーズ 4：既存ファイル変更

- [x] 4-1. `src/components/ClockDisplay/index.tsx` にフォントサイズクラスを追加
  - 時刻: `text-5xl md:text-8xl`
  - 日付: `text-lg md:text-2xl`
  - 対応する ClockDisplay.test.tsx を更新（クラス確認テストを追加）
- [x] 4-2. `src/app/page.tsx` に StopwatchContainer を追加
  - ClockContainer の下に配置
  - main に `gap-16` を追加

---

## 実装後の振り返り

**実装完了日**: 2026-04-18

**計画と実績の差分**:
- 計画通り全タスク完了
- `@testing-library/user-event` が未インストールだったため `npm install -D` で追加（devDependency）
- implementation-validator の指摘を受け、以下を追加修正:
  - `ClockDisplay/index.tsx` の時刻要素に `font-mono` 追加（スペック準拠の修正）
  - `useStopwatch` の `start()` / `stop()` に二重呼び出し・未起動ガード追加
  - `useStopwatch.test.ts` に paused → running 再開フローのテストを追加

**学んだこと**:
- implementation-validator が既存スペック（functional-design.md）との差分を検出してくれるため、設計ドキュメントの価値が高い
- `useCallback` の依存配列が空でも `useRef` 経由で最新値を読めるパターンが有効

**次回への改善提案**:
- 新規フックのテストにはエッジケース（再開フロー・二重呼び出し）を最初から含める
- `package.json` の devDependencies を事前に確認してから実装する

---

## フェーズ 5：品質チェック

- [x] 5-1. `npm run lint` でエラーなし
- [x] 5-2. `npm run test:ci` で全テストパス
- [x] 5-3. `npm run build` で型エラーなし・ビルド成功
