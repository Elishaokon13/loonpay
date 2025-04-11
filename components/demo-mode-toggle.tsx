"use client"

import { useState, useEffect } from "react"
import { Beaker } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function DemoModeToggle() {
  const [isDemoMode, setIsDemoMode] = useState(true)

  useEffect(() => {
    // Store demo mode preference in localStorage
    localStorage.setItem("demoMode", isDemoMode.toString())

    // Add a class to the body for global styling in demo mode
    if (isDemoMode) {
      document.body.classList.add("demo-mode")
    } else {
      document.body.classList.remove("demo-mode")
    }
  }, [isDemoMode])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={isDemoMode ? "default" : "outline"}
          size="sm"
          className={isDemoMode ? "bg-amber-500 hover:bg-amber-600 text-white" : ""}
        >
          <Beaker className="h-4 w-4 mr-2" />
          Demo Mode
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch id="demo-mode" checked={isDemoMode} onCheckedChange={setIsDemoMode} />
            <Label htmlFor="demo-mode">Demo Mode {isDemoMode ? "Enabled" : "Disabled"}</Label>
          </div>

          <div className="text-sm text-zinc-500">
            <p>Demo mode uses simulated data and transactions. No real gift cards will be processed.</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Simulated gift card validation</li>
              <li>Mock blockchain transactions</li>
              <li>Test wallet connections</li>
            </ul>
          </div>

          {!isDemoMode && (
            <div className="bg-amber-50 border border-amber-200 rounded p-2 text-sm text-amber-800">
              Warning: Disabling demo mode will process real gift cards and blockchain transactions.
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
