import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { FrequencySelect } from "../FrequencySelect"

describe("FrequencySelect", () => {
  it("should render frequency options with annual counts", () => {
    const onChange = vi.fn()
    render(<FrequencySelect value="52" onChange={onChange} />)

    const select = screen.getByRole("combobox")
    expect(select).toBeInTheDocument()

    const options = screen.getAllByRole("option")
    expect(options).toHaveLength(12)
    expect(options[0]).toHaveTextContent("毎日 (365回/年)")
    expect(options[11]).toHaveTextContent("その他")
  })

  it("should call onChange with selected frequency value", () => {
    const onChange = vi.fn()
    render(<FrequencySelect value="" onChange={onChange} />)

    const select = screen.getByRole("combobox")
    fireEvent.change(select, { target: { value: "52" } })

    expect(onChange).toHaveBeenCalledWith("52")
  })

  it("should show custom input when 'その他' is selected", () => {
    const onChange = vi.fn()
    render(<FrequencySelect value="" onChange={onChange} />)

    const select = screen.getByRole("combobox")
    fireEvent.change(select, { target: { value: "custom" } })

    const customInput = screen.getByPlaceholderText("年間回数を入力")
    expect(customInput).toBeInTheDocument()
  })

  it("should handle custom frequency input", () => {
    const onChange = vi.fn()
    render(<FrequencySelect value="custom" onChange={onChange} />)

    const select = screen.getByRole("combobox")
    fireEvent.change(select, { target: { value: "custom" } })

    const customInput = screen.getByPlaceholderText("年間回数を入力")
    fireEvent.change(customInput, { target: { value: "48" } })

    expect(onChange).toHaveBeenLastCalledWith("48")
  })

  it("should initialize with custom value if not in preset options", () => {
    const onChange = vi.fn()
    render(<FrequencySelect value="100" onChange={onChange} />)

    const select = screen.getByRole("combobox")
    expect(select).toHaveValue("custom")

    const customInput = screen.getByPlaceholderText("年間回数を入力")
    expect(customInput).toHaveValue(100)
  })
})
