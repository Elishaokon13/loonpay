"use client"

import { useState } from "react"
import Image from "next/image"
import { Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface PaymentMethodProps {
  onSelect: (selected: boolean) => void
}

export function PaymentMethod({ onSelect }: PaymentMethodProps) {
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)

  const handleSelect = async (method: string) => {
    setSelectedMethod(method)
    setIsSelecting(true)

    try {
      // Simulate payment method setup
      await new Promise((resolve) => setTimeout(resolve, 1500))
      onSelect(true)
    } catch (error) {
      console.error("Payment method selection error:", error)
    } finally {
      setIsSelecting(false)
    }
  }

  if (selectedMethod) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center">
                {selectedMethod === "stripe" ? (
                  <Image src="/placeholder.svg?height=40&width=40" alt="Stripe" width={24} height={24} />
                ) : (
                  <Image src="/placeholder.svg?height=40&width=40" alt="PayPal" width={24} height={24} />
                )}
              </div>
              <div>
                <p className="font-medium">{selectedMethod === "stripe" ? "Credit Card (Stripe)" : "PayPal"}</p>
                <p className="text-xs text-zinc-500">
                  {selectedMethod === "stripe" ? "Ready for payment" : "Account connected"}
                </p>
              </div>
            </div>
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <RadioGroup defaultValue="stripe">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="stripe" id="stripe" />
            <Label htmlFor="stripe" className="flex items-center space-x-2 cursor-pointer">
              <Image src="/placeholder.svg?height=32&width=32" alt="Stripe" width={32} height={32} />
              <span>Credit Card (Stripe)</span>
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="paypal" id="paypal" />
            <Label htmlFor="paypal" className="flex items-center space-x-2 cursor-pointer">
              <Image src="/placeholder.svg?height=32&width=32" alt="PayPal" width={32} height={32} />
              <span>PayPal</span>
            </Label>
          </div>
        </div>
      </RadioGroup>

      <Button onClick={() => handleSelect("stripe")} className="w-full" disabled={isSelecting}>
        {isSelecting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Setting up...
          </>
        ) : (
          "Select Payment Method"
        )}
      </Button>
    </div>
  )
}
