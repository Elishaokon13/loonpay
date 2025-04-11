"use client"

import { useState } from "react"
import { Download, Copy, Check, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { baseConfig } from "@/lib/blockchain-service"

interface TransactionReceiptProps {
  transactionId: number
  txHash: string
  cardProvider: string
  cardAmount: number
  usdcAmount: number
  processingFee: number
  networkFee: number
  walletAddress: string
  timestamp: string
}

export function TransactionReceipt({
  transactionId,
  txHash,
  cardProvider,
  cardAmount,
  usdcAmount,
  processingFee,
  networkFee,
  walletAddress,
  timestamp,
}: TransactionReceiptProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    // Create receipt content
    const receiptContent = `
Transaction Receipt
-------------------
Transaction ID: ${transactionId}
Date: ${timestamp}
Provider: ${cardProvider}
Card Amount: $${cardAmount.toFixed(2)}
USDC Amount: ${usdcAmount.toFixed(2)}
Processing Fee: $${processingFee.toFixed(2)}
Network Fee: $${networkFee.toFixed(2)}
Wallet Address: ${walletAddress}
Transaction Hash: ${txHash}
Block Explorer: ${baseConfig.blockExplorer}/tx/${txHash}
    `.trim()

    // Create download link
    const element = document.createElement("a")
    const file = new Blob([receiptContent], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `receipt-${transactionId}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <Card className="border border-emerald-200 bg-emerald-50/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Transaction Receipt</span>
          <Button variant="ghost" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-zinc-500">Transaction ID:</span>
            <span className="font-medium">{transactionId}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-500">Date:</span>
            <span className="font-medium">{timestamp}</span>
          </div>

          <Separator className="my-1" />

          <div className="flex justify-between">
            <span className="text-zinc-500">Provider:</span>
            <span className="font-medium">{cardProvider}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-500">Card Amount:</span>
            <span className="font-medium">${cardAmount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-500">Processing Fee:</span>
            <span className="font-medium">-${processingFee.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-500">Network Fee:</span>
            <span className="font-medium">-${networkFee.toFixed(2)}</span>
          </div>

          <div className="flex justify-between font-medium">
            <span>USDC Amount:</span>
            <span className="text-emerald-600">{usdcAmount.toFixed(2)} USDC</span>
          </div>

          <Separator className="my-1" />

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-zinc-500">Wallet Address:</span>
              <Button variant="ghost" size="icon" className="h-4 w-4 -mr-1" onClick={() => handleCopy(walletAddress)}>
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
            <div className="bg-white p-2 rounded text-xs font-mono break-all">{walletAddress}</div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-zinc-500">Transaction Hash:</span>
              <a
                href={`${baseConfig.blockExplorer}/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:underline flex items-center"
              >
                View <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
            <div className="bg-white p-2 rounded text-xs font-mono break-all">{txHash}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
