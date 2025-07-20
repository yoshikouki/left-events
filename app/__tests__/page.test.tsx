import { render, screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"
import Home from "../page"

describe("Home", () => {
  test("renders Next.js logo", () => {
    render(<Home />)
    const logo = screen.getByAltText("Next.js logo")
    expect(logo).toBeInTheDocument()
  })

  test("renders getting started text", () => {
    render(<Home />)
    const text = screen.getByText(/Get started by editing/i)
    expect(text).toBeInTheDocument()
  })

  test("renders deploy link", () => {
    render(<Home />)
    const deployLink = screen.getByRole("link", { name: /Deploy now/i })
    expect(deployLink).toHaveAttribute(
      "href",
      "https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app",
    )
  })

  test("renders docs link", () => {
    render(<Home />)
    const docsLink = screen.getByRole("link", { name: /Read our docs/i })
    expect(docsLink).toHaveAttribute(
      "href",
      "https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app",
    )
  })
})
