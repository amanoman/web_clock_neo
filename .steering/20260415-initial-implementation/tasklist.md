# タスクリスト（初回実装）

## 進捗凡例

- `[ ]` 未着手
- `[~]` 進行中
- `[x]` 完了

---

## フェーズ 1：環境セットアップ

- [ ] 1-1. Next.js プロジェクト初期化
  ```bash
  cd /home/axmxn/src
  npx create-next-app@15 web_clock_neo \
    --typescript --tailwind --eslint --app --src-dir \
    --no-turbopack --import-alias "@/*"
  ```
- [ ] 1-2. `package.json` のバージョンが `architecture.md` の採用メジャーと一致していることを確認
- [ ] 1-3. Vitest・テストライブラリのインストール
  ```bash
  npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom @vitest/coverage-v8
  ```
- [ ] 1-4. `vitest.config.ts` を作成（jsdom 環境・coverage-v8・閾値 80%）
- [ ] 1-5. `src/test/setup.ts` を作成（`@testing-library/jest-dom` import）
- [ ] 1-6. `package.json` に scripts 追加（`test` / `test:ci` / `test:coverage`）
- [ ] 1-7. `npm run dev` で起動確認

---

## フェーズ 2：ユーティリティ実装

- [ ] 2-1. `src/lib/formatTime.ts` を実装（`Date → "HH:MM:SS"`）
- [ ] 2-2. `src/lib/formatTime.test.ts` を実装・パス確認
  - 出力形式 `HH:MM:SS`・ゼロパディング確認
  - 境界値（00:00:00 / 23:59:59）
- [ ] 2-3. `src/lib/formatDate.ts` を実装（`formatToParts` で `"YYYY年M月D日 曜日"` を厳密組み立て）
- [ ] 2-4. `src/lib/formatDate.test.ts` を実装・パス確認
  - 出力形式・ゼロ埋めなし（4月5日）・曜日 long 表記
  - 日付変わり目：`2026-04-15 23:59:59` と `2026-04-16 00:00:00` で日付・曜日が正しく変わる

---

## フェーズ 3：フック実装

- [ ] 3-1. `src/hooks/useClock.ts` を実装
  - `useState<Date | null>(null)` で初期化
  - `useEffect` 内で `setNow(new Date())` → `setInterval(1000ms)`
  - `visibilitychange` リスナー登録（`visible` 時のみ再取得）
  - cleanup：`clearInterval` + `removeEventListener`（同一ハンドラ参照）
- [ ] 3-2. `src/hooks/useClock.test.ts` を実装・パス確認
  - 初期値 `null`
  - マウント後 `Date` インスタンスに変わる
  - fake timers で 1000ms 経過後に更新される
  - `clearInterval` が呼ばれる
  - `removeEventListener` が同一ハンドラ参照で呼ばれる
  - `visibilityState === 'visible'` で再取得される
  - `visibilityState !== 'visible'` では再取得されない

---

## フェーズ 4：コンポーネント実装

- [ ] 4-1. `src/components/ClockDisplay/index.tsx` を実装
  - Props：`time` / `date` / `timeDateTime` / `dateDateTime`
  - `<time dateTime={timeDateTime}>{time}</time>` を先に、`<time dateTime={dateDateTime}>{date}</time>` を後に
  - `aria-label` / `aria-live` は付与しない
- [ ] 4-2. `src/components/ClockDisplay/ClockDisplay.test.tsx` を実装・パス確認
  - `time` / `date` が描画される
  - 時刻要素が日付要素より前（DOM 順確認）
  - `dateTime` 属性が正しく設定されている
- [ ] 4-3. `src/containers/ClockContainer/index.tsx` を実装
  - `'use client'`
  - `useClock()` で `now` 取得
  - `now === null` の場合 `return null`
  - `formatTime` / `formatDate` で表示用文字列生成
  - `toTimeDateTime` / `toDateDateTime` で機械可読値生成
  - `<ClockDisplay>` に4つの Props を渡す
- [ ] 4-4. `src/containers/ClockContainer/ClockContainer.test.tsx` を実装・パス確認
  - `now === null` 時は何も描画しない

---

## フェーズ 5：ページ・レイアウト実装

- [ ] 5-1. `src/app/globals.css` を整理（Tailwind ベースラインのみ）
- [ ] 5-2. `src/app/layout.tsx` を実装
  - モノスペースフォント設定
  - メタデータ（title / description）
  - `<noscript>JavaScriptを有効にしてください</noscript>`
- [ ] 5-3. `src/app/page.tsx` を実装
  - Server Component
  - `<ClockContainer />` を配置
  - `bg-gray-950 min-h-screen flex flex-col items-center justify-center`

---

## フェーズ 6：品質チェック

- [ ] 6-1. `npm run lint` でエラーなし
- [ ] 6-2. `npm run test:ci` で全テストパス
- [ ] 6-3. `npm run test:coverage` でカバレッジ 80% 以上（statement・branch・function・line）
- [ ] 6-4. `npm run build` で型エラーなし・ビルド成功
- [ ] 6-5. `npm run start` でブラウザ動作確認
  - 時刻が1秒ごとに更新される
  - システム時計と見比べて通常時 ±1秒以内であること
  - 日付が正しく表示される
  - ブラウザコンソールに Hydration エラーなし
- [ ] 6-6. レスポンシブ目視確認（320px / 375px / 768px / 1440px / 1920px）
- [ ] 6-7. アクセシビリティ確認
  - axe でコントラスト比 4.5:1 以上を確認
  - スクリーンリーダーで時刻→日付の順に読まれることを手動確認
  - ブラウザのフォントサイズを 200% に拡大して情報欠落がないことを確認
  - JS を無効にして `<noscript>` メッセージが表示されることを確認

---

## 完了条件

`requirements.md` の受け入れ条件をすべてチェックできること。
