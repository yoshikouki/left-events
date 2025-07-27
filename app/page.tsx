"use client"

import { motion } from "framer-motion"
import { useCallback, useEffect, useState } from "react"
import { AgeInput } from "@/app/(features)/life-counter/components/AgeInput"
import { EventCounter } from "@/app/(features)/life-counter/components/EventCounter"
import { Timeline } from "@/app/(shared)/components/Timeline"
import { DEFAULT_LIFE_EVENTS, LIFE_MILESTONES } from "@/app/(shared)/data/default-events"
import { HEALTHY_LIFE_EXPECTANCY } from "@/app/(shared)/utils/calculations"
import { storage } from "@/app/(shared)/utils/storage"

export default function HomePage() {
  const [currentAge, setCurrentAge] = useState<number | null>(null)
  const [showAgeInput, setShowAgeInput] = useState(false)
  const [breathScale, setBreathScale] = useState(1)

  // ローカルストレージから初期データを読み込み
  useEffect(() => {
    const savedAge = storage.getUserAge()
    if (savedAge !== 35) {
      // デフォルト値でない場合のみ設定
      setCurrentAge(savedAge)
    }
  }, [])

  // 呼吸アニメーション
  useEffect(() => {
    const breathe = () => {
      const time = Date.now() / 1000
      const scale = 1 + Math.sin(time * 0.5) * 0.05 // ゆっくりとした呼吸のリズム
      setBreathScale(scale)
    }

    const interval = setInterval(breathe, 50)
    return () => clearInterval(interval)
  }, [])

  const handleStart = useCallback(() => {
    if (!currentAge) {
      setShowAgeInput(true)
    }
  }, [currentAge])

  const handleAgeSet = useCallback((age: number) => {
    setCurrentAge(age)
    storage.saveUserAge(age)
    setShowAgeInput(false)
  }, [])

  // 初回訪問時の呼吸体験
  if (!currentAge && !showAgeInput) {
    return (
      <button
        type="button"
        className="min-h-screen w-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center cursor-pointer"
        onClick={handleStart}
      >
        <motion.div
          className="text-center"
          animate={{ scale: breathScale }}
          transition={{ duration: 0.1, ease: "linear" }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="relative"
          >
            <div className="w-48 h-48 mx-auto mb-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-20 blur-3xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 opacity-30 blur-xl" />
            </div>
          </motion.div>
          <motion.h1
            className="text-4xl font-light text-white mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 2 }}
          >
            あなたの人生の鼓動
          </motion.h1>
          <motion.p
            className="text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 2 }}
          >
            タップして始める
          </motion.p>
        </motion.div>
      </button>
    )
  }

  // 年齢入力画面
  if (showAgeInput) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-light text-white mb-8">あなたの年齢を教えてください</h2>
          <AgeInput initialAge={35} onAgeChange={handleAgeSet} autoFocus />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* シンプルなヘッダー */}
        <motion.header
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-light text-gray-900 mb-2">Life Canvas</h1>
          <p className="text-sm text-gray-500">{currentAge}歳のあなたへ</p>
        </motion.header>

        {/* タイムラインのみ表示 */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          {currentAge && <Timeline currentAge={currentAge} milestones={LIFE_MILESTONES} />}
        </motion.section>

        {/* 主要なイベントのみシンプルに表示 */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-16"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {DEFAULT_LIFE_EVENTS.slice(0, 4).map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                {currentAge && (
                  <EventCounter
                    event={event}
                    currentAge={currentAge}
                    targetAge={HEALTHY_LIFE_EXPECTANCY}
                    targetLabel=""
                    minimal
                  />
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  )
}
