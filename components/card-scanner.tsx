"use client"

import { useState } from "react"
import { Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface CardScannerProps {
  onScan: (cardNumber: string) => void
}

export function CardScanner({ onScan }: CardScannerProps) {
  const [open, setOpen] = useState(false)
  const [scanning, setScanning] = useState(false)

  const handleScan = () => {
    setScanning(true)

    // Simulate scanning process
    setTimeout(() => {
      // Generate a random card number for demo purposes
      const randomCardNumber = `4111${Math.floor(1000 + Math.random() * 9000)}${Math.floor(1000 + Math.random() * 9000)}${Math.floor(1000 + Math.random() * 9000)}`

      onScan(randomCardNumber)
      setScanning(false)
      setOpen(false)
    }, 3000)
  }

  return (
    <>
      <Button variant="outline" type="button" onClick={() => setOpen(true)} className="flex items-center gap-2">
        <Camera className="h-4 w-4" />
        <span>Scan Card</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Scan Gift Card</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-6">
            {scanning ? (
              <div className="text-center space-y-4">
                <div className="w-48 h-32 bg-zinc-100 rounded-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-emerald-500/10"></div>
                  <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 animate-[scan_3s_ease-in-out_infinite]"></div>
                </div>
                <p className="text-sm text-zinc-600">Scanning card... Please hold steady</p>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-48 h-32 bg-zinc-100 rounded-lg flex items-center justify-center border-2 border-dashed border-zinc-300">
                  <Camera className="h-8 w-8 text-zinc-400" />
                </div>
                <p className="text-sm text-zinc-600">Position your gift card within the frame</p>
                <Button onClick={handleScan} className="bg-emerald-600 hover:bg-emerald-700">
                  Start Scanning
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
