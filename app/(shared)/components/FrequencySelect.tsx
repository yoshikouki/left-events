"use client"

import type { SelectHTMLAttributes } from "react"
import { useState } from "react"
import { Select } from "./Select"
import { TextInput } from "./TextInput"

interface FrequencySelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "value" | "onChange" | "children"> {
  label?: string
  error?: string
  value: string
  onChange: (value: string) => void
}

const FREQUENCY_OPTIONS = [
  { value: "365", label: "毎日 (365回/年)" },
  { value: "156", label: "週3回 (156回/年)" },
  { value: "104", label: "週2回 (104回/年)" },
  { value: "52", label: "週1回 (52回/年)" },
  { value: "26", label: "隔週 (26回/年)" },
  { value: "24", label: "月2回 (24回/年)" },
  { value: "12", label: "月1回 (12回/年)" },
  { value: "6", label: "2ヶ月に1回 (6回/年)" },
  { value: "4", label: "年4回 (4回/年)" },
  { value: "2", label: "年2回 (2回/年)" },
  { value: "1", label: "年1回 (1回/年)" },
  { value: "custom", label: "その他" },
]

export function FrequencySelect({ value, onChange, label, error, ...props }: FrequencySelectProps) {
  const [isCustom, setIsCustom] = useState(
    value && !FREQUENCY_OPTIONS.some((opt) => opt.value === value && opt.value !== "custom"),
  )
  const [customValue, setCustomValue] = useState(isCustom ? value : "")

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value

    if (selectedValue === "custom") {
      setIsCustom(true)
      setCustomValue("")
      onChange("")
    } else {
      setIsCustom(false)
      setCustomValue("")
      onChange(selectedValue)
    }
  }

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setCustomValue(newValue)
    onChange(newValue)
  }

  // 選択値の決定
  const selectValue = isCustom ? "custom" : value

  return (
    <div className="w-full">
      <Select
        label={label}
        error={error}
        value={selectValue}
        onChange={handleSelectChange}
        {...props}
      >
        {FREQUENCY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>

      {isCustom && (
        <div className="mt-2">
          <TextInput
            type="number"
            placeholder="年間回数を入力"
            value={customValue}
            onChange={handleCustomChange}
            min="1"
            className="w-full"
          />
        </div>
      )}
    </div>
  )
}
