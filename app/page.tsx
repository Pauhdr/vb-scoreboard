"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { VibrateIcon as Volleyball, Waves } from "lucide-react"
import ScoreboardApp from "@/components/scoreboard-app"

type GameType = "volleyball" | "beach-volleyball"

export default function HomePage() {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameType, setGameType] = useState<GameType | null>(null)

  const startGame = (type: GameType) => {
    setGameType(type)
    setGameStarted(true)
  }

  const resetApp = () => {
    setGameStarted(false)
    setGameType(null)
  }

  if (gameStarted && gameType) {
    return <ScoreboardApp gameType={gameType} onReset={resetApp} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-md mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Marcador de Voleibol</h1>
          <p className="text-gray-600 dark:text-gray-300">Selecciona el tipo de juego para comenzar</p>
        </div>

        <div className="gap-4 flex flex-row">
          <Card
            className="border-2 hover:border-blue-500 transition-colors cursor-pointer p-8 w-full"
            onClick={() => startGame("volleyball")}
          >
            <div className="text-center">
              <div className="p-6 bg-blue-100 dark:bg-blue-900 rounded-full inline-block mb-4">
                <Volleyball className="w-16 h-16 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Voleibol</h3>
            </div>
          </Card>

          <Card
            className="border-2 hover:border-orange-500 transition-colors cursor-pointer p-8 w-full"
            onClick={() => startGame("beach-volleyball")}
          >
            <div className="text-center">
              <div className="p-6 bg-orange-100 dark:bg-orange-900 rounded-full inline-block mb-4">
                <Waves className="w-16 h-16 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Vóley Playa</h3>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
