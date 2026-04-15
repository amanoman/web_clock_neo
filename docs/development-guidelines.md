# 開発ガイドライン

## 1. コーディング規約

### TypeScript

- `const` / `let` を使用し、`var` は使わない
- 型アノテーションを積極的に使用する（`any` は禁止）
- 関数・変数名はキャメルケース（`camelCase`）
- コンポーネント・型・インターフェース名はパスカルケース（`PascalCase`）
- `interface` よりも `type` を優先する（拡張が必要な場合は `interface`）
- `export default` より名前付き export（`export const`）を優先する

### React / Next.js

- Client Component には必ずファイル先頭に `'use client'` を記載する
- `useEffect` の依存配列は省略しない
- Props の型は `type XxxProps = { ... }` として定義し、コンポーネントと同じファイルに置く
- Presentational Component（`src/components/`）は Hooks を使わない

### CSS / スタイリング

- スタイリングは Tailwind CSS のユーティリティクラスを使用する
- カスタム CSS は `src/app/globals.css` に限定し、最小限にとどめる
- レスポンシブは Tailwind のブレークポイント（`sm:` `md:` `lg:`）を使用する

---

## 2. 命名規則

| 対象 | 規則 | 例 |
|------|------|-----|
| コンポーネントファイル | PascalCase ディレクトリ + `index.tsx` | `ClockDisplay/index.tsx` |
| コンテナファイル | PascalCase ディレクトリ + `index.tsx` | `ClockContainer/index.tsx` |
| フックファイル | `use` プレフィックス + camelCase | `useClock.ts` |
| ユーティリティファイル | camelCase | `formatTime.ts` |
| テストファイル | 対象ファイル名 + `.test` | `useClock.test.ts` |
| コンポーネント関数 | PascalCase | `ClockDisplay` |
| フック関数 | `use` プレフィックス + camelCase | `useClock` |
| 通常の関数・変数 | camelCase | `formatTime`, `displayDate` |
| 型・インターフェース | PascalCase | `ClockDisplayProps`, `ClockState` |
| `.steering/` ディレクトリ | `YYYYMMDD-kebab-case` | `20250415-initial-implementation` |

---

## 3. テスト規約

- テストファイルは対象ファイルと同じディレクトリに配置する（コロケーション）
- テストフレームワークは Vitest を使用する
- React コンポーネントのテストは `@testing-library/react` を使用する
- 時間に依存するテスト（`useClock` 等）は Vitest の fake timers を使用する
- `src/lib/` の純粋関数は必ず単体テストを作成する
- カバレッジ目標：statement・branch・function・line すべてで **80% 以上**
- テストは `docs/functional-design.md` のテスト設計に従い、少なくとも以下をカバーする：
  - `useClock`：タイマー更新・cleanup（`clearInterval` / `removeEventListener`）・`visibilitychange` 復帰と非更新
  - `ClockDisplay`：`<time dateTime>` 属性・DOM 順
  - `ClockContainer`：`now === null` 時の初期描画（Hydration 差分なし）

---

## 4. Git 規約

### ブランチ戦略

```
main          ← 常に動く状態を保つ（直接 push 禁止）
feature/xxx   ← 機能追加
fix/xxx       ← バグ修正
docs/xxx      ← ドキュメントのみの変更
```

### コミットメッセージ

英語で記述する。以下のプレフィックスを使用する：

| プレフィックス | 用途 |
|-------------|------|
| `feat:` | 新機能追加 |
| `fix:` | バグ修正 |
| `docs:` | `docs/` 内の設計ドキュメント・README の変更 |
| `refactor:` | 機能変更を伴わないコード改善 |
| `test:` | テストの追加・修正 |
| `chore:` | `package.json`・`.gitignore`・`CLAUDE.md` などの設定・メタファイルの変更 |
| `style:` | フォーマット・空白など機能に影響しない変更 |

**例：**
```
feat: add real-time clock display
fix: prevent hydration mismatch by initializing time as null
docs: update functional-design.md with Client Component boundary
test: add visibilitychange resync test for useClock
```

---

## 5. 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# ビルド確認
npm run start

# リント
npm run lint

# テスト実行（ウォッチモード）
npm run test

# テスト実行（CI 用・単発）
npm run test:ci

# カバレッジ計測
npm run test:coverage
```

---

## 6. 品質チェック（実装後の確認手順）

コード変更後は以下を順番に実行し、すべてパスしてからコミットする。

```bash
npm run lint        # ESLint によるコード品質チェック
npm run test:ci     # ユニットテスト（全件パス確認）
npm run build       # 本番ビルド成功確認（型エラー検出含む）
```
