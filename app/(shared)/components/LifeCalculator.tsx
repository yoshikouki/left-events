"use client"

import { Calendar, Clock, Heart, Plus, Users, X } from "lucide-react"
import { useMemo, useState } from "react"

interface LifeEvent {
  name: string
  frequency: number // 年間の回数
  icon: React.ReactNode
  remainingCount?: number
}

interface FamilyMember {
  id: string
  name: string
  relation: string
  birthYear: number
  age?: number
}

export function LifeCalculator() {
  const currentYear = new Date().getFullYear()
  const defaultAge = 35
  const defaultBirthYear = (currentYear - defaultAge).toString()
  const [birthYear, setBirthYear] = useState<string>(defaultBirthYear)
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [newMemberName, setNewMemberName] = useState("")
  const [newMemberRelation, setNewMemberRelation] = useState("")
  const [newMemberAge, setNewMemberAge] = useState("")
  const [newMemberBirthYear, setNewMemberBirthYear] = useState("")
  const [ageInputMode, setAgeInputMode] = useState<"age" | "year">("age")
  const lifeExpectancy = 85
  const healthyLifeExpectancy = 72 // 健康寿命

  const calculations = useMemo(() => {
    if (!birthYear || parseInt(birthYear) < 1900 || parseInt(birthYear) > currentYear) {
      return null
    }

    const birthYearNum = parseInt(birthYear)
    const currentAge = currentYear - birthYearNum
    const remainingYears = Math.max(0, lifeExpectancy - currentAge)
    const healthyRemainingYears = Math.max(0, healthyLifeExpectancy - currentAge)
    const remainingDays = remainingYears * 365
    const remainingWeeks = remainingYears * 52
    const remainingMonths = remainingYears * 12

    // 代表的なライフイベントの残り回数
    const lifeEvents: LifeEvent[] = [
      {
        name: "桜",
        frequency: 1,
        icon: <span className="text-pink-500">🌸</span>,
        remainingCount: remainingYears,
      },
      {
        name: "誕生日",
        frequency: 1,
        icon: <span className="text-yellow-500">🎂</span>,
        remainingCount: remainingYears,
      },
      {
        name: "正月",
        frequency: 1,
        icon: <span className="text-red-500">🎍</span>,
        remainingCount: remainingYears,
      },
      {
        name: "親と会う",
        frequency: 12, // 月1回と仮定
        icon: <Users className="w-4 h-4 text-blue-500" />,
        remainingCount: currentAge < 50 ? Math.round(remainingYears * 0.4 * 12) : 0, // 親の寿命を考慮
      },
    ]

    // 家族との残り時間計算
    const familyEvents: LifeEvent[] = familyMembers.map((member) => {
      const memberAge = member.age || currentYear - member.birthYear
      let remainingWithMember = 0
      let frequency = 12 // 月1回会うと仮定

      if (member.relation === "子供") {
        // 22歳で卒業と仮定
        const yearsUntilGraduation = Math.max(0, 22 - memberAge)
        remainingWithMember = Math.min(yearsUntilGraduation, healthyRemainingYears) * frequency * 4 // 週1回会う
        frequency = 48
      } else if (member.relation === "親") {
        // 親の平均寿命を考慮
        const parentRemainingYears = Math.max(0, 85 - memberAge)
        remainingWithMember = Math.min(parentRemainingYears, healthyRemainingYears) * frequency
      } else if (member.relation === "配偶者") {
        // 健康寿命まで一緒に過ごすと仮定
        remainingWithMember = healthyRemainingYears * 365 // 毎日一緒
        frequency = 365
      } else {
        // その他の家族
        remainingWithMember = Math.min(remainingYears, 30) * frequency // 30年間会うと仮定
      }

      return {
        name: member.name ? `${member.name}と会う` : `${member.relation}と会う`,
        frequency,
        icon: <Users className="w-4 h-4 text-blue-500" />,
        remainingCount: Math.round(remainingWithMember),
      }
    })

    return {
      currentAge,
      remainingYears,
      healthyRemainingYears,
      remainingDays,
      remainingWeeks,
      remainingMonths,
      lifeEvents,
      familyEvents,
    }
  }, [birthYear, currentYear, familyMembers])

  const handleAddFamilyMember = () => {
    if (newMemberRelation && (newMemberAge || newMemberBirthYear)) {
      let age: number
      let birthYear: number

      if (ageInputMode === "age" && newMemberAge) {
        age = parseInt(newMemberAge)
        birthYear = currentYear - age
      } else if (ageInputMode === "year" && newMemberBirthYear) {
        birthYear = parseInt(newMemberBirthYear)
        age = currentYear - birthYear
      } else {
        return
      }

      setFamilyMembers([
        ...familyMembers,
        {
          id: Date.now().toString(),
          name: newMemberName || "",
          relation: newMemberRelation,
          birthYear,
          age,
        },
      ])
      setNewMemberName("")
      setNewMemberRelation("")
      setNewMemberAge("")
      setNewMemberBirthYear("")
    }
  }

  const handleRemoveFamilyMember = (id: string) => {
    setFamilyMembers(familyMembers.filter((member) => member.id !== id))
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">残り時間</h2>

      <div className="mb-8">
        <label htmlFor="birthYear" className="block text-sm font-medium text-gray-700 mb-2">
          生まれ年
        </label>
        <input
          id="birthYear"
          type="number"
          min="1900"
          max={currentYear}
          value={birthYear}
          onChange={(e) => setBirthYear(e.target.value)}
          placeholder="1990"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
        />
      </div>

      {calculations && (
        <div className="space-y-6 animate-fadeIn">
          <div className="text-center mb-6">
            <p className="text-lg text-gray-600">
              現在{" "}
              <span className="font-bold text-2xl text-gray-900">{calculations.currentAge}</span> 歳
            </p>
            <p className="text-sm text-gray-500 mt-1">
              平均{lifeExpectancy}歳 / 健康{healthyLifeExpectancy}歳
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-900">
                {calculations.remainingYears.toLocaleString()}
              </p>
              <p className="text-sm text-blue-700">年</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <Clock className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-900">
                {calculations.remainingMonths.toLocaleString()}
              </p>
              <p className="text-sm text-green-700">ヶ月</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <Heart className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-900">
                {calculations.remainingWeeks.toLocaleString()}
              </p>
              <p className="text-sm text-purple-700">週</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <span className="text-2xl mb-2 block">☀️</span>
              <p className="text-2xl font-bold text-orange-900">
                {calculations.remainingDays.toLocaleString()}
              </p>
              <p className="text-sm text-orange-700">日</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">残り回数</h3>
            <div className="space-y-3">
              {calculations.lifeEvents.map((event) => (
                <div key={event.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {event.icon}
                    <span className="text-gray-700">{event.name}</span>
                  </div>
                  <span className="font-bold text-lg text-gray-900">
                    あと約 {event.remainingCount?.toLocaleString() || "0"} 回
                  </span>
                </div>
              ))}
            </div>
          </div>

          {calculations.familyEvents.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">家族との時間</h3>
              <div className="space-y-3">
                {calculations.familyEvents.map((event) => (
                  <div key={event.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {event.icon}
                      <span className="text-gray-700">{event.name}</span>
                    </div>
                    <span
                      className={`font-bold text-lg ${
                        event.remainingCount && event.remainingCount < 100
                          ? "text-red-600"
                          : "text-gray-900"
                      }`}
                    >
                      あと約 {event.remainingCount?.toLocaleString() || "0"} 回
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">大切な人を追加</h3>
            <div className="space-y-3">
              {familyMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded"
                >
                  <span className="text-sm">
                    {member.name || member.relation} ({member.age}歳)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFamilyMember(member.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="名前（省略可）"
                    className="px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  <select
                    value={newMemberRelation}
                    onChange={(e) => setNewMemberRelation(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded text-sm"
                  >
                    <option value="">関係</option>
                    <option value="配偶者">配偶者</option>
                    <option value="子供">子供</option>
                    <option value="親">親</option>
                    <option value="兄弟">兄弟</option>
                    <option value="友人">友人</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setAgeInputMode("age")}
                      className={`px-2 py-1 text-xs rounded ${
                        ageInputMode === "age"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      年齢
                    </button>
                    <button
                      type="button"
                      onClick={() => setAgeInputMode("year")}
                      className={`px-2 py-1 text-xs rounded ${
                        ageInputMode === "year"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      生年
                    </button>
                  </div>
                  {ageInputMode === "age" ? (
                    <input
                      type="number"
                      value={newMemberAge}
                      onChange={(e) => setNewMemberAge(e.target.value)}
                      placeholder="年齢"
                      min="0"
                      max="120"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  ) : (
                    <input
                      type="number"
                      value={newMemberBirthYear}
                      onChange={(e) => setNewMemberBirthYear(e.target.value)}
                      placeholder="生まれ年"
                      min="1900"
                      max={currentYear}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddFamilyMember}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                <Plus className="w-4 h-4" />
                追加
              </button>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-sm text-blue-800">今を大切に</p>
          </div>
        </div>
      )}
    </div>
  )
}
