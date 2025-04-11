"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { WalletConnect } from "@/components/wallet-connect"
import { baseConfig } from "@/lib/blockchain-service"

export default function PaymentPage() {
  const router = useRouter()
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")
  const [offer, setOffer] = useState<any>(null)
  const [transactionData, setTransactionData] = useState<{
    transactionId: number
    txData: string
    estimatedGas: number
    gasPrice: string
  } | null>(null)

  useEffect(() => {
    // Retrieve the offer from localStorage
    const storedOffer = localStorage.getItem("giftCardOffer")
    if (storedOffer) {
      setOffer(JSON.parse(storedOffer))
    } else {
      // If no offer is found, redirect back to validation page
      router.push("/validate")
    }
  }, [router])

  const handleWalletConnect = (connected: boolean, address = "") => {
    setWalletConnected(connected)
    setWalletAddress(address)
  }

  const handleCreateTransaction = async () => {
    if (!offer || !walletConnected || !walletAddress) {
      setError("Please connect your wallet first")
      return
    }

    setIsProcessing(true)
    setError("")

    try {
      // Call the transactions API to create a transaction
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          providerId: offer.providerId,
          cardNumber: offer.cardNumber,
          cardValueUsd: offer.cardValueUsd,
          usdcAmount: offer.usdcAmount,
          processingFee: offer.processingFee,
          networkFee: offer.networkFee,
          walletAddress: walletAddress,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to create transaction")
      }

      setTransactionData(data.data)
    } catch (error: any) {
      setError(error.message || "Failed to create transaction. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSignTransaction = async () => {
    if (!transactionData) {
      setError("No transaction data available")
      return
    }

    setIsProcessing(true)
    setError("")

    try {
      // In a real app, this would call the wallet to sign the transaction
      // For this demo, we'll simulate signing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate a mock signed transaction
      const signedTx = `0x${Array(130)
        .fill(0)
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("")}`

      // Call the settle API with the signed transaction
      const response = await fetch("/api/settle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transactionId: transactionData.transactionId,
          signedTx,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to submit transaction")
      }

      // Store the transaction ID and hash for the redemption page
      localStorage.setItem("transactionId", transactionData.transactionId.toString())
      localStorage.setItem("txHash", data.data.txHash)

      // Redirect to redemption page
      router.push("/redemption")
    } catch (error: any) {
      setError(error.message || "Failed to sign transaction. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (!offer) {
    return (
      <div className="container max-w-2xl mx-auto py-10 px-4">
        <Card>
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading offer details...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-2xl mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Exchange</CardTitle>
          <CardDescription>Connect your wallet and sign the transaction to receive your USDC</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-zinc-50 p-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-medium">Your Offer</h3>
              <div className="mt-1 text-3xl font-bold text-emerald-600">{offer.usdcAmount.toFixed(2)} USDC</div>
              <p className="text-sm text-zinc-500">for your ${offer.cardValueUsd.toFixed(2)} gift card</p>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Card Value:</span>
                <span className="font-medium">${offer.cardValueUsd.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Processing Fee:</span>
                <span className="font-medium">-${offer.processingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Network Fee:</span>
                <span className="font-medium">-${offer.networkFee.toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-medium">
                <span>You Receive:</span>
                <span className="text-emerald-600">{offer.usdcAmount.toFixed(2)} USDC</span>
              </div>
              <div className="text-xs text-zinc-500 text-center mt-2">
                Exchange Rate: 1 USD = {offer.exchangeRate.toFixed(3)} USDC on Base
              </div>
            </div>
          </div>

          <Alert className="bg-blue-50 border-blue-200">
            <AlertTriangle className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Transaction on Base</AlertTitle>
            <AlertDescription className="text-blue-700">
              You will receive USDC on the Base blockchain. Make sure your wallet is connected to Base (Chain ID:{" "}
              {baseConfig.chainId}).
            </AlertDescription>
          </Alert>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-medium">1. Connect Your Wallet</h3>
            <WalletConnect onConnect={handleWalletConnect} />

            {walletConnected && (
              <Alert className="bg-emerald-50 border-emerald-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <AlertTitle className="text-emerald-800">Wallet Connected</AlertTitle>
                <AlertDescription className="text-emerald-700">
                  Your wallet is connected and ready to receive USDC.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {walletConnected && !transactionData && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">2. Create Transaction</h3>
              <p className="text-sm text-zinc-500">
                Create a transaction to receive {offer.usdcAmount.toFixed(2)} USDC on Base.
              </p>
              <Button onClick={handleCreateTransaction} className="w-full" disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Transaction...
                  </>
                ) : (
                  "Create Transaction"
                )}
              </Button>
            </div>
          )}

          {transactionData && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">3. Sign Transaction</h3>
              <div className="rounded-md bg-zinc-100 p-3">
                <div className="text-xs font-mono overflow-hidden text-ellipsis">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Transaction Data:</span>
                    <span>
                      {transactionData.txData.substring(0, 10)}...
                      {transactionData.txData.substring(transactionData.txData.length - 8)}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-zinc-500">Gas Estimate:</span>
                    <span>{transactionData.estimatedGas}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-zinc-500">Gas Price:</span>
                    <span>{transactionData.gasPrice} ETH</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-zinc-500">
                Sign the transaction with your wallet to receive {offer.usdcAmount.toFixed(2)} USDC.
              </p>
              <Button
                onClick={handleSignTransaction}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing Transaction...
                  </>
                ) : (
                  "Sign Transaction"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
