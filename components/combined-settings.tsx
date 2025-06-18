"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X } from "lucide-react"

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

interface CombinedSettingsProps {
  team1: Team
  team2: Team
  gameRules: GameRules
  gameType: "volleyball" | "beach-volleyball"
  onUpdate: (team1: Partial<Team>, team2: Partial<Team>, rules: Partial<GameRules>) => void
  onClose: () => void
}

const colorOptions = [
  { name: "Azul", value: "bg-blue-600" },
  { name: "Rojo", value: "bg-red-600" },
  { name: "Verde", value: "bg-green-600" },
  { name: "Naranja", value: "bg-orange-600" },
  { name: "Púrpura", value: "bg-purple-600" },
  { name: "Rosa", value: "bg-pink-600" },
  { name: "Amarillo", value: "bg-yellow-600" },
  { name: "Índigo", value: "bg-indigo-600" },
]

export default function CombinedSettings({
  team1,
  team2,
  gameRules,
  gameType,
  onUpdate,
  onClose,
}: CombinedSettingsProps) {
  // Team settings
  const [team1Name, setTeam1Name] = useState(team1.name)
  const [team1Color, setTeam1Color] = useState(team1.color)
  const [team2Name, setTeam2Name] = useState(team2.name)
  const [team2Color, setTeam2Color] = useState(team2.color)

  // Game settings
  const [pointsToWin, setPointsToWin] = useState(gameRules.pointsToWin)
  const [tiebreakPoints, setTiebreakPoints] = useState(gameRules.tiebreakPoints)
  const [switchSides, setSwitchSides] = useState(gameRules.switchSides)

  const handleSave = () => {
    onUpdate(
      { name: team1Name, color: team1Color },
      { name: team2Name, color: team2Color },
      { pointsToWin, tiebreakPoints, switchSides },
    )
    onClose()
  }

  const resetToDefaults = () => {
    if (gameType === "volleyball") {
      setPointsToWin(25)
      setTiebreakPoints(15)
      setSwitchSides(8)
    } else {
      setPointsToWin(21)
      setTiebreakPoints(15)
      setSwitchSides(7)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-hidden">
      <Card className="w-full max-w-md h-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between flex-shrink-0">
          <CardTitle>Configuración</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto">
          <Tabs defaultValue="teams" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="teams">Equipos</TabsTrigger>
              <TabsTrigger value="game">Juego</TabsTrigger>
            </TabsList>

            <TabsContent value="teams" className="space-y-6 mt-4">
              {/* Team 1 */}
              <div className="space-y-3">
                <Label className="text-lg font-semibold">Equipo 1</Label>
                <div>
                  <Label htmlFor="team1-name">Nombre</Label>
                  <Input
                    id="team1-name"
                    value={team1Name}
                    onChange={(e) => setTeam1Name(e.target.value)}
                    placeholder="Nombre del equipo"
                  />
                </div>
                <div>
                  <Label>Color</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setTeam1Color(color.value)}
                        className={`${color.value} h-10 rounded-md border-2 ${
                          team1Color === color.value ? "border-white" : "border-transparent"
                        }`}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Team 2 */}
              <div className="space-y-3">
                <Label className="text-lg font-semibold">Equipo 2</Label>
                <div>
                  <Label htmlFor="team2-name">Nombre</Label>
                  <Input
                    id="team2-name"
                    value={team2Name}
                    onChange={(e) => setTeam2Name(e.target.value)}
                    placeholder="Nombre del equipo"
                  />
                </div>
                <div>
                  <Label>Color</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setTeam2Color(color.value)}
                        className={`${color.value} h-10 rounded-md border-2 ${
                          team2Color === color.value ? "border-white" : "border-transparent"
                        }`}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="game" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="points-to-win">Puntos por Partido</Label>
                  <Input
                    id="points-to-win"
                    type="number"
                    min="15"
                    max="50"
                    value={pointsToWin}
                    onChange={(e) => setPointsToWin(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="tiebreak-points">Puntos Tie-break</Label>
                  <Input
                    id="tiebreak-points"
                    type="number"
                    min="10"
                    max="25"
                    value={tiebreakPoints}
                    onChange={(e) => setTiebreakPoints(Number(e.target.value))}
                  />
                </div>
              </div>

              {gameType === "beach-volleyball" && (
                <div>
                  <Label htmlFor="switch-sides">Cambio de Campo</Label>
                  <Input
                    id="switch-sides"
                    type="number"
                    min="5"
                    max="15"
                    value={switchSides}
                    onChange={(e) => setSwitchSides(Number(e.target.value))}
                  />
                  <p className="text-xs text-gray-500 mt-1">Cada X puntos</p>
                </div>
              )}

              <Button onClick={resetToDefaults} variant="outline" className="w-full">
                Restaurar Valores por Defecto
              </Button>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 mt-6">
            <Button onClick={handleSave} className="flex-1">
              Guardar
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
