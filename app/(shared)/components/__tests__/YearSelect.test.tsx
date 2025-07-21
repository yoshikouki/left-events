import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { YearSelect } from "../YearSelect"

describe("YearSelect", () => {
  it("renders with default placeholder", () => {
    render(<YearSelect />)
    expect(screen.getByRole("combobox")).toBeInTheDocument()
    expect(screen.getByText("年")).toBeInTheDocument()
  })

  it("renders with custom placeholder", () => {
    render(<YearSelect placeholder="生年" />)
    expect(screen.getByText("生年")).toBeInTheDocument()
  })

  it("generates years from 1900 to current year by default", () => {
    render(<YearSelect />)
    const currentYear = new Date().getFullYear()
    const options = screen.getAllByRole("option")

    // First option should be placeholder
    expect(options[0]).toHaveTextContent("年")

    // Second option should be current year (newest first)
    expect(options[1]).toHaveTextContent(currentYear.toString())

    // Last option should be 1900
    expect(options[options.length - 1]).toHaveTextContent("1900")
  })

  it("respects custom year range", () => {
    render(<YearSelect startYear={2020} endYear={2025} />)
    const options = screen.getAllByRole("option")

    // First option should be placeholder
    expect(options[0]).toHaveTextContent("年")

    // Should have 6 years + 1 placeholder = 7 options
    expect(options).toHaveLength(7)

    // Check first and last year
    expect(options[1]).toHaveTextContent("2025")
    expect(options[6]).toHaveTextContent("2020")
  })

  it("passes through additional props", () => {
    render(<YearSelect label="生年" name="birthYear" required />)

    const select = screen.getByRole("combobox")
    expect(select).toHaveAttribute("name", "birthYear")
    expect(select).toHaveAttribute("required")

    expect(screen.getByText("生年")).toBeInTheDocument()
  })

  it("shows error message when provided", () => {
    render(<YearSelect error="年を選択してください" />)
    expect(screen.getByText("年を選択してください")).toBeInTheDocument()
  })
})
