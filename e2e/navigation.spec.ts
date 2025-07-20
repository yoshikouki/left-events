import { expect, test } from "@playwright/test"

test.describe("Navigation", () => {
  test("should navigate to home page", async ({ page }) => {
    // ホームページにアクセス
    await page.goto("/")

    // Next.js logo が表示されていることを確認
    await expect(page.getByAltText("Next.js logo")).toBeVisible()

    // "Get started by editing" テキストが表示されていることを確認
    await expect(page.getByText(/Get started by editing/)).toBeVisible()
  })

  test("should have working external links", async ({ page }) => {
    await page.goto("/")

    // Deploy now リンクが正しい href を持っていることを確認
    const deployLink = page.getByRole("link", { name: /Deploy now/i })
    await expect(deployLink).toHaveAttribute(
      "href",
      "https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app",
    )

    // Read our docs リンクが正しい href を持っていることを確認
    const docsLink = page.getByRole("link", { name: /Read our docs/i })
    await expect(docsLink).toHaveAttribute(
      "href",
      "https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app",
    )
  })

  test("should have footer links", async ({ page }) => {
    await page.goto("/")

    // フッターのリンクが存在することを確認
    await expect(page.getByRole("link", { name: /Learn/i })).toBeVisible()
    await expect(page.getByRole("link", { name: /Examples/i })).toBeVisible()
    await expect(page.getByRole("link", { name: /Go to nextjs.org/i })).toBeVisible()
  })
})