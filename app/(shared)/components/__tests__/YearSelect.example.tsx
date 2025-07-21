import { useState } from "react"
import { YearSelect } from "../YearSelect"

// Example usage of YearSelect component
export function YearSelectExample() {
  const [birthYear, setBirthYear] = useState("")
  const [graduationYear, setGraduationYear] = useState("")

  return (
    <div className="space-y-4 p-4 max-w-md">
      <h2 className="text-lg font-semibold">YearSelect Examples</h2>

      {/* Basic usage */}
      <YearSelect label="生年" value={birthYear} onChange={(e) => setBirthYear(e.target.value)} />

      {/* With custom range */}
      <YearSelect
        label="卒業年"
        placeholder="卒業年を選択"
        startYear={2000}
        endYear={2030}
        value={graduationYear}
        onChange={(e) => setGraduationYear(e.target.value)}
      />

      {/* With error */}
      <YearSelect label="必須の年" error="年を選択してください" required />

      {/* Display selected values */}
      <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded">
        <p>選択された生年: {birthYear || "未選択"}</p>
        <p>選択された卒業年: {graduationYear || "未選択"}</p>
      </div>
    </div>
  )
}
