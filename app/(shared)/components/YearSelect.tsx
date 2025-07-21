import type { SelectHTMLAttributes } from "react"
import { Select } from "./Select"

interface YearSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label?: string
  error?: string
  placeholder?: string
  startYear?: number
  endYear?: number
}

export function YearSelect({
  placeholder = "年",
  startYear = 1900,
  endYear = new Date().getFullYear(),
  ...props
}: YearSelectProps) {
  // Generate years in descending order
  const years = []
  for (let year = endYear; year >= startYear; year--) {
    years.push(year)
  }

  return (
    <Select {...props}>
      <option value="">{placeholder}</option>
      {years.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </Select>
  )
}
