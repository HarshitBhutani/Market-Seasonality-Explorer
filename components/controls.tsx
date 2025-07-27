"use client"

import { Calendar, BarChart3, Grid3X3, Download, Palette } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import type { ViewMode } from "@/lib/types"

interface ControlsProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  selectedInstrument: string
  onInstrumentChange: (instrument: string) => void
}

const instruments = ["BTC/USD", "ETH/USD", "ADA/USD", "SOL/USD", "MATIC/USD"]

export function Controls({ viewMode, onViewModeChange, selectedInstrument, onInstrumentChange }: ControlsProps) {
  const handleExport = () => {
    // Mock export functionality
    const data = {
      instrument: selectedInstrument,
      viewMode,
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `market-data-${selectedInstrument.replace("/", "-")}-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="p-4 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">Instrument:</label>
            <Select value={selectedInstrument} onValueChange={onInstrumentChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {instruments.map((instrument) => (
                  <SelectItem key={instrument} value={instrument}>
                    {instrument}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">View:</label>
            <div className="flex rounded-lg border">
              <Button
                variant={viewMode === "daily" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange("daily")}
                className="rounded-r-none"
              >
                <Calendar className="h-4 w-4 mr-1" />
                Daily
              </Button>
              <Button
                variant={viewMode === "weekly" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange("weekly")}
                className="rounded-none border-x"
              >
                <BarChart3 className="h-4 w-4 mr-1" />
                Weekly
              </Button>
              <Button
                variant={viewMode === "monthly" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange("monthly")}
                className="rounded-l-none"
              >
                <Grid3X3 className="h-4 w-4 mr-1" />
                Monthly
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Palette className="h-4 w-4 mr-1" />
            Theme
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </div>
    </Card>
  )
}