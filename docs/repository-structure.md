# リポジトリ構造定義書

## 1. フォルダ・ファイル構成

```
web_clock_neo/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # ルートレイアウト（フォント・メタデータ・noscript）
│   │   ├── page.tsx            # トップページ（Server Component）
│   │   └── globals.css         # グローバルスタイル（Tailwind ベースライン）
│   ├── components/
│   │   └── ClockDisplay/
│   │       ├── index.tsx       # ClockDisplay（Presentational Component）
│   │       └── ClockDisplay.test.tsx
│   ├── containers/
│   │   └── ClockContainer/
│   │       ├── index.tsx       # ClockContainer（Client Component）
│   │       └── ClockContainer.test.tsx
│   ├── hooks/
│   │   ├── useClock.ts         # 時刻更新管理フック（now: Date | null を返す）
│   │   └── useClock.test.ts
│   └── lib/
│       ├── formatDate.ts       # 日付フォーマット（純粋関数）
│       ├── formatDate.test.ts
│       ├── formatTime.ts       # 時刻フォーマット（純粋関数）
│       └── formatTime.test.ts
├── docs/                       # 永続的ドキュメント
│   ├── product-requirements.md
│   ├── functional-design.md
│   ├── architecture.md
│   ├── repository-structure.md
│   ├── development-guidelines.md
│   └── glossary.md
├── .steering/                  # 作業単位のドキュメント
│   └── [YYYYMMDD]-[タイトル]/
│       ├── requirements.md
│       ├── design.md
│       └── tasklist.md
├── public/                     # 静的アセット（favicon 等）
├── CLAUDE.md                   # Claude Code 向けプロジェクト指示
├── next.config.ts              # Next.js 設定
├── tailwind.config.ts          # Tailwind CSS 設定
├── tsconfig.json               # TypeScript 設定
├── vitest.config.ts            # Vitest 設定
├── package.json
├── .gitignore
└── README.md
```

---

## 2. ディレクトリの役割

| パス | 役割 |
|-----|------|
| `src/app/` | Next.js App Router のルーティング・レイアウト。v1では `layout.tsx` / `page.tsx` は Server Component とする。Client Component が必要な場合は原則 `src/containers/` に分離し、`app/` 配下への直接配置は最小限にとどめる |
| `src/components/` | Presentational Component。Props を受け取り描画するのみ。Hooks 不使用 |
| `src/containers/` | Client Component（`'use client'`）。Hooks を呼び出しデータを組み立てる |
| `src/hooks/` | カスタムフック。状態管理・副作用・ブラウザ API の呼び出しを担う |
| `src/lib/` | 純粋関数ユーティリティ。副作用なし・テスト容易 |
| `docs/` | プロジェクト全体の永続的ドキュメント。基本設計が変わらない限り更新しない |
| `.steering/` | 作業単位の一時ドキュメント。作業ごとに新ディレクトリを作成し履歴として保持 |
| `public/` | Next.js が `/` 直下として配信する静的アセット |

---

## 3. ファイル配置ルール

### コンポーネント・フック

- `src/components/` には Presentational Component のみ配置する。`useState` / `useEffect` などの Hooks を使う場合は `src/containers/` に移動する
- `src/containers/` のコンポーネントは必ず `'use client'` ディレクティブを先頭に記載する
- コンポーネント・コンテナはそれぞれ同名のディレクトリを作成し、`index.tsx` を配置する
  ```
  src/components/ClockDisplay/
  ├── index.tsx
  └── ClockDisplay.test.tsx
  ```

### テスト

- テストファイルは対象ファイルと同じディレクトリに配置する（コロケーション）
- ファイル名は `[対象ファイル名].test.ts(x)` とする
- `src/lib/` の純粋関数は必ず単体テストを書く

### ドキュメント

- 永続的ドキュメントは `docs/` に配置する。作業単位のドキュメントと混在させない
- 作業単位のドキュメントは `.steering/[YYYYMMDD]-[タイトル]/` に配置する
- `.steering/` のディレクトリ名は `YYYYMMDD-開発タイトル` 形式とする（例：`20250415-initial-implementation`）

### 静的アセット

- favicon・OGP 画像などの静的ファイルは `public/` に配置する
- CSS は Tailwind CSS のユーティリティクラスを基本とし、グローバルスタイルは `src/app/globals.css` に限定する

---

## 4. 命名規則

| 対象 | 規則 | 例 |
|------|------|-----|
| コンポーネントファイル | PascalCase | `ClockDisplay/index.tsx` |
| フックファイル | camelCase（use プレフィックス） | `useClock.ts` |
| ユーティリティファイル | camelCase | `formatTime.ts` |
| テストファイル | 対象ファイル名 + `.test` | `useClock.test.ts` |
| `.steering/` ディレクトリ | `YYYYMMDD-kebab-case` | `20250415-initial-implementation` |

詳細な命名規則は `development-guidelines.md` を参照。
