"use client"

import { useState } from "react"
import { format } from "date-fns"
import { TrendingUp, TrendingDown, Minus, Volume2 } from 'lucide-react'
import type { MarketData, ViewMode } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface CalendarCellProps {
  date: Date
  data?: MarketData
  isSelected: boolean
  isInRange: boolean
  isToday: boolean
  isCurrentMonth: boolean
  viewMode: ViewMode
  onClick: () => void
}

export function CalendarCell({
  date,
  data,
  isSelected,
  isInRange,
  isToday,
  isCurrentMonth,
  viewMode,
  onClick,
}: CalendarCellProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getVolatilityColor = (volatility?: number) => {
    if (!volatility) return "bg-gray-100"
    if (volatility < 0.02) return "bg-green-100 border-green-300"
    if (volatility < 0.05) return "bg-yellow-100 border-yellow-300"
    return "bg-red-100 border-red-300"
  }

  const getVolatilityIntensity = (volatility?: number) => {
    if (!volatility) return 0.1
    return Math.min(volatility * 10, 1)
  }

  const getPerformanceIcon = (change?: number) => {
    if (!change) return <Minus className="h-3 w-3 text-gray-400" />
    if (change > 0) return <TrendingUp className="h-3 w-3 text-green-600" />
    return <TrendingDown className="h-3 w-3 text-red-600" />
  }

  const formatTooltipContent = () => {
    if (!data) return "No data available"

    return (
      <div className="space-y-2">
        <div className="font-semibold">{format(date, "MMM dd, yyyy")}</div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Open: ${data.open.toFixed(2)}</div>
          <div>Close: ${data.close.toFixed(2)}</div>
          <div>High: ${data.high.toFixed(2)}</div>
          <div>Low: ${data.low.toFixed(2)}</div>
          <div>Volume: {(data.volume / 1000000).toFixed(1)}M</div>
          <div>Volatility: {(data.volatility * 100).toFixed(1)}%</div>
          <div className={cn("col-span-2", data.change >= 0 ? "text-green-600" : "text-red-600")}>
            Change: {data.change >= 0 ? "+" : ""}
            {(data.change * 100).toFixed(2)}%
          </div>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "relative h-16 p-1 border cursor-pointer transition-all duration-200",
              "hover:shadow-md hover:scale-105",
              getVolatilityColor(data?.volatility),
              isSelected && "ring-2 ring-blue-500",
              isInRange && "bg-blue-50 border-blue-300",
              isToday && "ring-2 ring-purple-500",
              !isCurrentMonth && "opacity-50",
              isHovered && "z-10",
            )}
            style={{
              backgroundColor: data?.volatility
                ? `rgba(${data.volatility < 0.02 ? "34, 197, 94" : data.volatility < 0.05 ? "234, 179, 8" : "239, 68, 68"}, ${getVolatilityIntensity(data.volatility)})`
                : undefined,
            }}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="flex justify-between items-start h-full">
              <span className={cn("text-xs font-medium", !isCurrentMonth && "text-gray-400")}>{format(date, "d")}</span>

              {data && (
                <div className="flex flex-col items-end space-y-1">
                  {getPerformanceIcon(data.change)}

                  {/* Vol indicator */}
                  <div className="flex items-center">
                    <Volume2 className="h-2 w-2 text-gray-500" />
                    <div
                      className="ml-1 bg-gray-400 rounded"
                      style={{
                        width: `${Math.max(2, (data.volume / 10000000) * 8)}px`,
                        height: "2px",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Liquidity pttrn overlay */}
            {data && data.liquidity > 0.7 && (
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full bg-gradient-to-br from-transparent via-blue-500 to-transparent"></div>
              </div>
            )}

            {/* High volatility pttrn */}
            {data && data.volatility > 0.05 && (
              <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          {formatTooltipContent()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}