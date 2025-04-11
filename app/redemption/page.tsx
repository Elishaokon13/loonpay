"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { CheckCircle2, Loader2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { updateTransactionStatus } from "../actions"
import { getTransactionStatus, baseConfig } from "@/lib/blockchain-service"
import { ConfettiEffect } from "@/components/confetti-effect"
import { TransactionReceipt } from "@/components/transaction-receipt"
import { giftCardProviders } from "@/lib/gift-card-providers"

enum TransactionStatus {
  PAYMENT_RECEIVED = "PAYMENT_RECEIVED",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
}

export default function RedemptionPage() {
  const [status, setStatus] = useState<TransactionStatus>(TransactionStatus.PAYMENT_RECEIVED)
  const [progress, setProgress] = useState(33)
  const [txHash, setTxHash] = useState("")
  const [copied, setCopied] = useState(false)
  const [transactionId, setTransactionId] = useState<number | null>(null)
  const [blockNumber, setBlockNumber] = useState<number | null>(null)
  const [confirmations, setConfirmations] = useState<number>(0)
  const [offer, setOffer] = useState<any>(null)

  useEffect(() => {
    // Retrieve data from localStorage
    const id = localStorage.getItem("transactionId")
    const hash = localStorage.getItem("txHash")
    const storedOffer = localStorage.getItem("giftCardOffer")

    if (id) {
      setTransactionId(Number.parseInt(id))
    }

    if (hash) {
      setTxHash(hash)
      setStatus(TransactionStatus.PROCESSING)
      setProgress(66)
    }

    if (storedOffer) {
      setOffer(JSON.parse(storedOffer))
    }
  }, [])

  useEffect(() => {
    if (!txHash) return

    // Poll for transaction status
    const checkStatus = async () => {
      try {
        const result = await getTransactionStatus(txHash)

        if (result.confirmed) {
          setStatus(TransactionStatus.COMPLETED)
          setProgress(100)
          setBlockNumber(result.blockNumber || null)
          setConfirmations(result.confirmations || 0)

          // Update transaction status in the database
          if (transactionId) {
            await updateTransactionStatus(transactionId, "COMPLETED", txHash)
          }

          // Clear the interval
          return true
        } else {
          setConfirmations(result.confirmations || 0)
          return false
        }
      } catch (error) {
        console.error("Error checking transaction status:", error)
        return false
      }
    }

    // Initial check
    checkStatus()

    // Set up polling
    const interval = setInterval(async () => {
      const isComplete = await checkStatus()
      if (isComplete) {
        clearInterval(interval)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [txHash, transactionId])

  const copyTxHash = () => {
    navigator.clipboard.writeText(txHash)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!offer) {
    return (
      <div className="container max-w-2xl mx-auto py-10 px-4">
        <Card>
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading transaction details...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-2xl mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Transaction in Progress</CardTitle>
          <CardDescription>Your gift card is being converted to USDC</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Progress value={progress} className="h-2" />

            <div className="grid grid-cols-3 text-center">
              <div className="space-y-2">
                <div className="mx-auto w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
                <p className="text-sm font-medium">Transaction Created</p>
              </div>

              <div className="space-y-2">
                <div className="mx-auto w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  {status === TransactionStatus.PAYMENT_RECEIVED ? (
                    <div className="w-5 h-5 rounded-full border-2 border-zinc-300" />
                  ) : status === TransactionStatus.PROCESSING ? (
                    <Loader2 className="h-5 w-5 text-emerald-600 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  )}
                </div>
                <p className="text-sm font-medium">Processing on Base</p>
              </div>

              <div className="space-y-2">
                <div className="mx-auto w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  {status === TransactionStatus.COMPLETED ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-zinc-300" />
                  )}
                </div>
                <p className="text-sm font-medium">USDC Sent</p>
              </div>
            </div>
          </div>

          {status === TransactionStatus.COMPLETED ? (
            <>
              <Alert className="bg-emerald-50 border-emerald-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <AlertTitle className="text-emerald-800">Transaction Complete!</AlertTitle>
                <AlertDescription className="text-emerald-700">
                  {offer.usdcAmount.toFixed(2)} USDC has been sent to your wallet.
                </AlertDescription>
              </Alert>

              <TransactionReceipt
                transactionId={transactionId || 0}
                txHash={txHash}
                cardProvider={giftCardProviders.find((p) => p.id === offer.providerId)?.name || ""}
                cardAmount={offer.cardValueUsd}
                usdcAmount={offer.usdcAmount}
                processingFee={offer.processingFee}
                networkFee={offer.networkFee}
                walletAddress={offer.walletAddress || "0x..."}
                timestamp={new Date().toLocaleString()}
              />
            </>
          ) : (
            <div className="text-center p-8">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-emerald-600 mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {status === TransactionStatus.PAYMENT_RECEIVED
                  ? "Preparing Transaction"
                  : "Processing Your Transaction"}
              </h3>
              <p className="text-zinc-500">
                {status === TransactionStatus.PAYMENT_RECEIVED
                  ? "We're preparing to submit your transaction to the Base blockchain."
                  : `Your transaction is being processed on the Base blockchain. This may take a few moments. Current confirmations: ${confirmations}`}
              </p>

              {txHash && (
                <div className="mt-4">
                  <Link
                    href={`${baseConfig.blockExplorer}/tx/${txHash}`}
                    target="_blank"
                    className="text-sm text-emerald-600 hover:underline flex items-center justify-center"
                  >
                    View on Block Explorer <ExternalLink className="h-3 w-3 ml-1" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </CardContent>
        {status === TransactionStatus.COMPLETED && (
          <CardFooter>
            <div className="w-full space-y-4">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700" asChild>
                <Link href="/">Convert Another Gift Card</Link>
              </Button>

              <div className="text-center text-sm text-zinc-500">
                <p>Check your wallet for the USDC tokens. They should appear shortly.</p>
              </div>
            </div>
          </CardFooter>
        )}
      </Card>
      {status === TransactionStatus.COMPLETED && <ConfettiEffect />}
    </div>
  )
}
