"use client"

import { useState, useEffect } from "react"
import { ArrowUpDown, RefreshCw } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function ExchangeRateDisplay() {
  const [rates, setRates] = useState({
    usdToUsdc: 0.995,
    ethToUsdc: 3450.75,
    loading: false,
    lastUpdated: new Date(),
  })

  const updateRates = () => {
    setRates((prev) => ({ ...prev, loading: true }))

    // Simulate API call to get latest rates
    setTimeout(() => {
      // Add small random fluctuation to simulate real rates
      const fluctuation = Math.random() * 0.01 - 0.005
      const ethFluctuation = Math.random() * 50 - 25

      setRates({
        usdToUsdc: 0.995 + fluctuation,
        ethToUsdc: 3450.75 + ethFluctuation,
        loading: false,
        lastUpdated: new Date(),
      })
    }, 1000)
  }

  useEffect(() => {
    // Update rates initially
    updateRates()

    // Set up interval to update rates every 30 seconds
    const interval = setInterval(updateRates, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="bg-zinc-50 border-zinc-200">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ArrowUpDown className="h-4 w-4 text-zinc-500" />
            <div className="text-sm">
              <span className="font-medium">1 USD = {rates.usdToUsdc.toFixed(4)} USDC</span>
              <span className="mx-2 text-zinc-400">|</span>
              <span className="font-medium">1 ETH = {rates.ethToUsdc.toFixed(2)} USDC</span>
            </div>
          </div>
          <button
            onClick={updateRates}
            className="text-xs text-zinc-500 flex items-center hover:text-zinc-800"
            disabled={rates.loading}
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${rates.loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Updated {rates.lastUpdated.toLocaleTimeString()}</span>
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
