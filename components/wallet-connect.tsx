"use client"

import { useState } from "react"
import Image from "next/image"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface WalletConnectProps {
  onConnect: (connected: boolean, address?: string) => void
}

export function WalletConnect({ onConnect }: WalletConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  const handleConnect = async (walletType: string) => {
    setIsConnecting(true)

    try {
      // Simulate wallet connection
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock wallet address
      const address =
        "0x" +
        Array(40)
          .fill(0)
          .map(() => Math.floor(Math.random() * 16).toString(16))
          .join("")

      setConnectedWallet(walletType)
      setWalletAddress(address)
      onConnect(true, address)
    } catch (error) {
      console.error("Wallet connection error:", error)
      onConnect(false)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    setConnectedWallet(null)
    setWalletAddress(null)
    onConnect(false)
  }

  if (connectedWallet) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center">
                {connectedWallet === "metamask" ? (
                  <Image src="/placeholder.svg?height=40&width=40" alt="MetaMask" width={24} height={24} />
                ) : (
                  <Image src="/placeholder.svg?height=40&width=40" alt="Coinbase Wallet" width={24} height={24} />
                )}
              </div>
              <div>
                <p className="font-medium">{connectedWallet === "metamask" ? "MetaMask" : "Coinbase Wallet"}</p>
                <p className="text-xs text-zinc-500">
                  {walletAddress?.substring(0, 6)}...{walletAddress?.substring(walletAddress.length - 4)}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleDisconnect}>
              Disconnect
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Button
        variant="outline"
        className="h-auto py-4 px-4 flex flex-col items-center justify-center"
        onClick={() => handleConnect("metamask")}
        disabled={isConnecting}
      >
        {isConnecting ? (
          <Loader2 className="h-6 w-6 animate-spin mb-2" />
        ) : (
          <Image src="/placeholder.svg?height=48&width=48" alt="MetaMask" width={48} height={48} className="mb-2" />
        )}
        <span className="font-medium">MetaMask</span>
        <span className="text-xs text-zinc-500 mt-1">Connect to MetaMask</span>
      </Button>

      <Button
        variant="outline"
        className="h-auto py-4 px-4 flex flex-col items-center justify-center"
        onClick={() => handleConnect("coinbase")}
        disabled={isConnecting}
      >
        {isConnecting ? (
          <Loader2 className="h-6 w-6 animate-spin mb-2" />
        ) : (
          <Image
            src="/placeholder.svg?height=48&width=48"
            alt="Coinbase Wallet"
            width={48}
            height={48}
            className="mb-2"
          />
        )}
        <span className="font-medium">Coinbase Wallet</span>
        <span className="text-xs text-zinc-500 mt-1">Connect to Coinbase Wallet</span>
      </Button>
    </div>
  )
}
