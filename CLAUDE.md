# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

Next.js 15.4.2 App Routerを使用したモダンなReactアプリケーション。React 19とReact Compilerを有効化し、Tailwind CSS v4でスタイリング。

## 開発コマンド

### 基本コマンド
```bash
bun run dev        # 開発サーバー起動 (Turbopack使用)
bun run build      # プロダクションビルド
bun run start      # プロダクションサーバー起動
```

### コード品質チェック
```bash
bun run lint       # Biomeでコードチェック＆自動修正
bun run lint:check # Biomeでチェックのみ（pre-commitで使用）
bun run format     # Biomeでコードフォーマット
bun run typecheck  # TypeScript型チェック
```

### テスト実行
```bash
# ユニットテスト (Vitest)
bun run test          # テスト実行
bun run test:ui       # UIモードでテスト
bun run test:coverage # カバレッジレポート生成

# E2Eテスト (Playwright)
bun run test:e2e       # E2Eテスト実行
bun run test:e2e:ui    # UIモードでE2E
bun run test:e2e:debug # デバッグモードでE2E

# 単一テストファイル実行
bun run test app/__tests__/page.test.tsx  # 特定のユニットテスト
bun run test:e2e e2e/navigation.spec.ts   # 特定のE2Eテスト
```

## アーキテクチャ概要

### ディレクトリ構成 (Package-by-Feature)

機能単位でモジュールを配置する**Package-by-Feature**アーキテクチャを採用。機能を破棄する際はディレクトリを削除するだけで完了するよう設計。

```
left-events/
├── app/
│   ├── (features)/          # 機能モジュール
│   │   ├── auth/           # 認証機能
│   │   │   ├── components/ # 認証関連コンポーネント
│   │   │   ├── hooks/      # 認証関連hooks
│   │   │   ├── api/        # 認証API
│   │   │   └── __tests__/  # 認証テスト
│   │   ├── events/         # イベント機能
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── api/
│   │   │   └── __tests__/
│   │   └── .../           # その他の機能
│   ├── (shared)/           # 共通モジュール
│   │   ├── components/     # 共通コンポーネント
│   │   ├── hooks/          # 共通hooks
│   │   └── utils/          # ユーティリティ
│   ├── layout.tsx
│   └── page.tsx
├── e2e/                    # E2Eテスト
├── public/                 # 静的アセット
└── docs/                   # 知識蓄積ドキュメント
```

### 機能モジュールの原則
- 各機能は独立したディレクトリに配置
- 機能内で必要なコンポーネント、hooks、API、テストを完結
- 機能間の依存は最小限に
- 共通化が必要な場合のみ`(shared)`へ移動

### 技術スタック
- **フレームワーク**: Next.js (App Router)
- **言語**: TypeScript (strict mode)
- **スタイリング**: Tailwind CSS v4 (PostCSS)
- **アニメーション**: Framer Motion
- **テスト**: Vitest + React Testing Library (単体)、Playwright (E2E)
- **コード品質**: Biome (lint/format)、Husky (Git hooks)

### コーディング規約
- インデント: スペース2つ
- 行幅: 100文字
- クォート: ダブルクォート
- セミコロン: 必要な場合のみ
- 末尾カンマ: 常に付ける
- インポート: Biomeで自動整理

### 重要な設定
- React Compiler有効 (experimental)
- TypeScriptパスエイリアス: `@/*` → `./*`
- Git pre-commitフック: lint:checkとtypecheckを実行
- Bunをパッケージマネージャーとして使用

## 知識蓄積とドキュメント管理

### 知識の体系的な蓄積
タスク完了を超えて、タスク中に得られた知識を体系的に蓄積し、プロジェクトの`./docs`ディレクトリに構造化する。なぜその決定をしたのか、何を学んだのかを文書化することで、ダブルループ学習を促進。

### ドキュメント構造
```
docs/
├── learnings/         # 学習内容の記録（3つの不確実性別）
│   ├── goal-uncertainty.md      # 目的不確実性の学習記録
│   ├── method-uncertainty.md    # 方法不確実性の学習記録
│   └── communication-uncertainty.md  # 通信不確実性の学習記録
└── architecture/      # アーキテクチャ関連文書
    └── feature-name.md
```

### 学習記録の分類

#### 目的不確実性 (goal-uncertainty.md)
何を作るべきか、何を達成すべきかが不明確な場合の学習
- 要件の明確化プロセス
- ユーザーニーズの発見
- ビジネス目標との整合性

#### 方法不確実性 (method-uncertainty.md)
どのように実装すべきか、技術的アプローチが不明確な場合の学習
- 技術選定の判断基準
- 実装パターンの選択
- パフォーマンス最適化手法
- エラー解決パターン

#### 通信不確実性 (communication-uncertainty.md)
情報伝達や理解の齟齬に関する学習
- コードの可読性向上
- ドキュメンテーション手法
- チーム間のコミュニケーション改善

### 学習記録フォーマット
```markdown
## [日付] - [学習タイトル]

### 状況
- 直面した問題や課題

### 学習内容
- 得られた知見
- 効果的だったアプローチ

### 今後の適用
- 類似状況での活用方法
```