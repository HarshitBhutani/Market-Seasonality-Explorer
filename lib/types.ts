export interface MarketData {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
  volatility: number
  liquidity: number
  change: number
}

export type ViewMode = "daily" | "weekly" | "monthly"

export type TimeFrame = "1d" | "1w" | "1m" | "3m" | "6m" | "1y"

export interface TechnicalIndicators {
  rsi: number
  macd: number
  ma20: number
  ma50: number
  bollinger: {
    upper: number
    middle: number
    lower: number
  }
}