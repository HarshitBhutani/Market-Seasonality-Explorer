import type { MarketData } from "./types"
import { subDays, format } from "date-fns"

export function generateMockData(instrument: string, days: number): MarketData[] {
  const data: MarketData[] = []
  const basePrice = getBasePriceForInstrument(instrument)
  let currentPrice = basePrice

  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(new Date(), i)

    // Generating realistic price movements
    const volatility = Math.random() * 0.08 + 0.01 // 1-9% volatility
    const change = (Math.random() - 0.5) * volatility
    const open = currentPrice
    const close = open * (1 + change)
    const high = Math.max(open, close) * (1 + Math.random() * 0.02)
    const low = Math.min(open, close) * (1 - Math.random() * 0.02)

    // Generating volume (higher volume on higher volatility days)
    const baseVolume = getBaseVolumeForInstrument(instrument)
    const volume = baseVolume * (0.5 + Math.random() * 1.5) * (1 + volatility * 5)

    // Generatimg liquidity (inversely related to volatility)
    const liquidity = Math.max(0.3, 1 - volatility * 8 + Math.random() * 0.3)

    data.push({
      date: format(date, "yyyy-MM-dd"),
      open,
      high,
      low,
      close,
      volume,
      volatility,
      liquidity,
      change,
    })

    currentPrice = close
  }

  return data
}

function getBasePriceForInstrument(instrument: string): number {
  const prices: Record<string, number> = {
    "BTC/USD": 45000,
    "ETH/USD": 2800,
    "ADA/USD": 0.45,
    "SOL/USD": 95,
    "MATIC/USD": 0.85,
  }
  return prices[instrument] || 1000
}

function getBaseVolumeForInstrument(instrument: string): number {
  const volumes: Record<string, number> = {
    "BTC/USD": 25000000,
    "ETH/USD": 15000000,
    "ADA/USD": 8000000,
    "SOL/USD": 12000000,
    "MATIC/USD": 6000000,
  }
  return volumes[instrument] || 5000000
}

export function calculateTechnicalIndicators(data: MarketData[]) {
  // Mock technical indicators - in a real app, these would be calculated
  return {
    rsi: Math.random() * 40 + 30, // 30-70 range
    macd: (Math.random() - 0.5) * 2,
    ma20: data[data.length - 1]?.close * (0.98 + Math.random() * 0.04),
    ma50: data[data.length - 1]?.close * (0.95 + Math.random() * 0.06),
    bollinger: {
      upper: data[data.length - 1]?.close * 1.02,
      middle: data[data.length - 1]?.close,
      lower: data[data.length - 1]?.close * 0.98,
    },
  }
}