import path from "node:path"
import { defineConfig, devices } from "@playwright/test"

// ポート設定（環境変数優先）
const PORT = process.env.PORT || 3000
const baseURL = `http://localhost:${PORT}`

export default defineConfig({
  // テストのタイムアウト
  timeout: 30 * 1000,

  // テストディレクトリ
  testDir: path.join(__dirname, "e2e"),

  // 失敗時のリトライ回数
  retries: process.env.CI ? 2 : 0,

  // CI環境でtest.onlyを禁止
  forbidOnly: !!process.env.CI,

  // レポーター設定
  reporter: process.env.CI ? "github" : "list",

  // アーティファクトの出力先
  outputDir: "test-results/",

  // Webサーバー設定（Next.js自動起動）
  webServer: {
    command: process.env.CI ? "bun run build && bun run start" : "bun run dev",
    url: baseURL,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },

  use: {
    // ベースURL設定
    baseURL,

    // トレース設定（デバッグ用）
    trace: "retry-with-trace",

    // ビデオ録画（CI環境のみ）
    video: process.env.CI ? "retain-on-failure" : undefined,
  },

  // テスト対象ブラウザー
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
})
