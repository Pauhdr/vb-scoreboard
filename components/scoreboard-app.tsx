"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Moon, Sun, Settings, RotateCcw, RefreshCw, ArrowLeft, Trophy, Circle } from "lucide-react"
import CombinedSettings from "@/components/combined-settings"

type GameType = "volleyball" | "beach-volleyball"

interface Team {
  name: string
  color: string
  score: number
}

interface GameRules {
  pointsToWin: number
  tiebreakPoints: number
  switchSides: number
}

interface ScoreboardAppProps {
  gameType: GameType
  onReset: () => void
}

export default function ScoreboardApp({ gameType, onReset }: ScoreboardAppProps) {
  const [darkMode, setDarkMode] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [servingTeam, setServingTeam] = useState<"team1" | "team2">("team1")
  const [switchAlert, setSwitchAlert] = useState(false)
  const [setWinner, setSetWinner] = useState<"team1" | "team2" | null>(null)
  const [showSetEndModal, setShowSetEndModal] = useState(false)
  const [setsWon, setSetsWon] = useState<Array<"team1" | "team2">>([])

  const [gameRules, setGameRules] = useState<GameRules>(
    gameType === "volleyball"
      ? { pointsToWin: 25, tiebreakPoints: 15, switchSides: 8 }
      : { pointsToWin: 21, tiebreakPoints: 15, switchSides: 7 },
  )

  const [team1, setTeam1] = useState<Team>({
    name: "Equipo 1",
    color: "bg-blue-600",
    score: 0,
  })

  const [team2, setTeam2] = useState<Team>({
    name: "Equipo 2",
    color: "bg-red-600",
    score: 0,
  })

  const [history, setHistory] = useState<
    Array<{
      team1Score: number
      team2Score: number
      servingTeam: "team1" | "team2"
    }>
  >([])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const checkSwitchSides = (team1Score: number, team2Score: number) => {
    // Solo aplicar cambio de campo en vóley playa
    if (gameType !== "beach-volleyball") return

    const totalPoints = team1Score + team2Score

    if (totalPoints > 0 && totalPoints % gameRules.switchSides === 0) {
      setSwitchAlert(true)
      setTimeout(() => setSwitchAlert(false), 3000)
    }
  }

  const isTiebreak = () => {
    const team1Sets = setsWon.filter((winner) => winner === "team1").length
    const team2Sets = setsWon.filter((winner) => winner === "team2").length

    // En voleibol: tie-break en el 5to set (2-2)
    // En vóley playa: tie-break en el 3er set (1-1)
    if (gameType === "volleyball") {
      return team1Sets === 2 && team2Sets === 2
    } else {
      return team1Sets === 1 && team2Sets === 1
    }
  }

  const checkSetWin = (team1Score: number, team2Score: number) => {
    const pointsNeeded = isTiebreak() ? gameRules.tiebreakPoints : gameRules.pointsToWin

    // Verificar si el equipo 1 gana el set
    if (team1Score >= pointsNeeded && team1Score - team2Score >= 2) {
      setSetWinner("team1")
      setShowSetEndModal(true)
      return true
    }

    // Verificar si el equipo 2 gana el set
    if (team2Score >= pointsNeeded && team2Score - team1Score >= 2) {
      setSetWinner("team2")
      setShowSetEndModal(true)
      return true
    }

    return false
  }

  const addPoint = (team: "team1" | "team2") => {
    // No permitir agregar puntos si el set ya terminó
    if (showSetEndModal) return

    // Save current state to history
    setHistory((prev) => [
      ...prev,
      {
        team1Score: team1.score,
        team2Score: team2.score,
        servingTeam,
      },
    ])

    const newTeam1 = { ...team1 }
    const newTeam2 = { ...team2 }

    if (team === "team1") {
      newTeam1.score += 1
      setServingTeam("team1")
    } else {
      newTeam2.score += 1
      setServingTeam("team2")
    }

    setTeam1(newTeam1)
    setTeam2(newTeam2)

    // Verificar si el set terminó después de actualizar los puntajes
    const setEnded = checkSetWin(newTeam1.score, newTeam2.score)

    // Solo verificar cambio de campo si el set no terminó
    if (!setEnded) {
      checkSwitchSides(newTeam1.score, newTeam2.score)
    }
  }

  const undoLastPoint = () => {
    if (history.length === 0 || showSetEndModal) return

    const lastState = history[history.length - 1]
    setTeam1((prev) => ({
      ...prev,
      score: lastState.team1Score,
    }))
    setTeam2((prev) => ({
      ...prev,
      score: lastState.team2Score,
    }))
    setServingTeam(lastState.servingTeam)
    setHistory((prev) => prev.slice(0, -1))
  }

  const startNewSet = () => {
    // Agregar el ganador del set al historial
    if (setWinner) {
      setSetsWon((prev) => [...prev, setWinner])
    }

    setTeam1((prev) => ({ ...prev, score: 0 }))
    setTeam2((prev) => ({ ...prev, score: 0 }))
    setServingTeam("team1")
    setHistory([])
    setSetWinner(null)
    setShowSetEndModal(false)
  }

  const resetGame = () => {
    setTeam1((prev) => ({ ...prev, score: 0 }))
    setTeam2((prev) => ({ ...prev, score: 0 }))
    setServingTeam("team1")
    setHistory([])
    setSetWinner(null)
    setShowSetEndModal(false)
    setSetsWon([])
  }

  const updateTeamsAndRules = (newTeam1: Partial<Team>, newTeam2: Partial<Team>, newRules: Partial<GameRules>) => {
    setTeam1((prev) => ({ ...prev, ...newTeam1 }))
    setTeam2((prev) => ({ ...prev, ...newTeam2 }))
    setGameRules((prev) => ({ ...prev, ...newRules }))
  }

  const getTeam1SetsWon = () => setsWon.filter((winner) => winner === "team1").length
  const getTeam2SetsWon = () => setsWon.filter((winner) => winner === "team2").length

  const renderSetIndicators = (teamId: "team1" | "team2") => {
    const maxSets = gameType === "volleyball" ? 5 : 3
    const indicators = []

    for (let i = 0; i < maxSets; i++) {
      const isWon = i < setsWon.length && setsWon[i] === teamId
      const isCurrentSet = i === setsWon.length

      indicators.push(
        <Circle
          key={i}
          className={`w-3 h-3 ${
            isWon
              ? "fill-green-500 text-green-500"
              : isCurrentSet
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-300 text-gray-300"
          }`}
        />,
      )
    }

    return indicators
  }

  return (
    <div className={`min-h-screen ${darkMode ? "dark bg-gray-900" : "bg-gray-50"} transition-colors`}>
      <div className="p-4 h-screen flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <Button variant="ghost" size="icon" onClick={onReset} className="text-gray-600 dark:text-gray-300">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <Badge variant="secondary" className="text-lg px-4 py-2 mb-1">
              {gameType === "volleyball" ? "Voleibol" : "Vóley Playa"}
            </Badge>
            {isTiebreak() && (
              <div className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                TIE-BREAK ({gameRules.tiebreakPoints} puntos)
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={resetGame} variant="ghost" size="sm" className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(true)}
              className="text-gray-600 dark:text-gray-300"
            >
              <Settings className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
              className="text-gray-600 dark:text-gray-300"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Scoreboard - Takes maximum space */}
        <div className="flex-1 grid grid-cols-2 gap-4 mb-4">
          {/* Team 1 */}
          <Card
            className={`border-2 cursor-pointer hover:shadow-lg transition-all active:scale-95 h-full ${
              showSetEndModal ? "pointer-events-none opacity-75" : ""
            }`}
            onClick={() => addPoint("team1")}
          >
            <CardContent className="p-6 h-full flex flex-col justify-center relative">
              {/* Set Indicators */}
              <div className="absolute top-2 left-2 flex gap-1">{renderSetIndicators("team1")}</div>

              <div
                className={`${team1.color} text-white p-8 rounded-lg text-center relative h-full flex flex-col justify-center`}
              >
                <h2 className="text-2xl font-bold mb-4">{team1.name}</h2>
                <div className="text-9xl font-bold leading-none">{team1.score}</div>
                <Badge
                  className={`absolute -top-3 -right-3 text-sm px-3 py-1 cursor-pointer transition-all ${
                    servingTeam === "team1"
                      ? "bg-yellow-500 text-black hover:bg-yellow-400"
                      : "bg-gray-400 text-gray-700 hover:bg-gray-300"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (!showSetEndModal) {
                      setServingTeam("team1")
                    }
                  }}
                >
                  SACA
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Team 2 */}
          <Card
            className={`border-2 cursor-pointer hover:shadow-lg transition-all active:scale-95 h-full ${
              showSetEndModal ? "pointer-events-none opacity-75" : ""
            }`}
            onClick={() => addPoint("team2")}
          >
            <CardContent className="p-6 h-full flex flex-col justify-center relative">
              {/* Set Indicators */}
              <div className="absolute top-2 right-2 flex gap-1">{renderSetIndicators("team2")}</div>

              <div
                className={`${team2.color} text-white p-8 rounded-lg text-center relative h-full flex flex-col justify-center`}
              >
                <h2 className="text-2xl font-bold mb-4">{team2.name}</h2>
                <div className="text-9xl font-bold leading-none">{team2.score}</div>
                <Badge
                  className={`absolute -top-3 -right-3 text-sm px-3 py-1 cursor-pointer transition-all ${
                    servingTeam === "team2"
                      ? "bg-yellow-500 text-black hover:bg-yellow-400"
                      : "bg-gray-400 text-gray-700 hover:bg-gray-300"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (!showSetEndModal) {
                      setServingTeam("team2")
                    }
                  }}
                >
                  SACA
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Minimal Toolbar */}
      </div>

      {/* Set End Modal */}
      {showSetEndModal && setWinner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="border-4 border-green-500 bg-green-50 dark:bg-green-900 max-w-sm mx-4">
            <CardContent className="p-6 text-center">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-green-600" />
              <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">¡Set Ganado!</h2>
              <p className="text-lg text-green-700 dark:text-green-300 mb-2">
                {setWinner === "team1" ? team1.name : team2.name} gana el set
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mb-4">
                Resultado: {team1.score} - {team2.score}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mb-6">
                Sets: {setWinner === "team1" ? getTeam1SetsWon() + 1 : getTeam1SetsWon()} -{" "}
                {setWinner === "team2" ? getTeam2SetsWon() + 1 : getTeam2SetsWon()}
              </p>
              <div className="space-y-3">
                <Button onClick={startNewSet} className="w-full bg-green-600 hover:bg-green-700">
                  Nuevo Set
                </Button>
                <Button onClick={resetGame} variant="outline" className="w-full">
                  Reiniciar Partido
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Switch Alert */}
      {switchAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="border-4 border-yellow-500 bg-yellow-100 dark:bg-yellow-900">
            <CardContent className="p-6 text-center">
              <RefreshCw className="w-12 h-12 mx-auto mb-4 text-yellow-600" />
              <h2 className="text-xl font-bold text-yellow-800 dark:text-yellow-200">¡CAMBIO DE CAMPO!</h2>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Combined Settings Modal */}
      {showSettings && (
        <CombinedSettings
          team1={team1}
          team2={team2}
          gameRules={gameRules}
          gameType={gameType}
          onUpdate={updateTeamsAndRules}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
