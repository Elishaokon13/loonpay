import { Suspense } from "react"
import Link from "next/link"
import { ArrowRight, Cog } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ReferralProgram } from "@/components/referral-program"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-gradient-to-b from-zinc-50 to-zinc-100">
      <div className="max-w-3xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Gift Card to USDC Exchange</h1>
          <p className="text-zinc-600 max-w-xl mx-auto">
            Convert your unused gift cards to USDC quickly and securely. Get competitive rates and fast transfers
            directly to your wallet.
          </p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
            <CardTitle className="text-2xl">How It Works</CardTitle>
            <CardDescription className="text-zinc-100">Simple 3-step process</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xl">
                  1
                </div>
                <h3 className="font-medium">Submit Card Details</h3>
                <p className="text-sm text-zinc-500">Enter your gift card information for validation</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xl">
                  2
                </div>
                <h3 className="font-medium">Receive USDC Offer</h3>
                <p className="text-sm text-zinc-500">Get a competitive rate for your gift card value</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xl">
                  3
                </div>
                <h3 className="font-medium">Get USDC in Wallet</h3>
                <p className="text-sm text-zinc-500">Complete payment and receive USDC in your wallet</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <ReferralProgram />

        <div className="flex justify-center">
          <Suspense fallback={<Button disabled>Loading...</Button>}>
            <Link href="/validate">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                Start Converting <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </Suspense>
        </div>
      </div>
      <div className="fixed bottom-4 right-4">
        <Link href="/admin">
          <Button variant="outline" size="icon" className="rounded-full">
            <Cog className="h-4 w-4" />
            <span className="sr-only">Admin Dashboard</span>
          </Button>
        </Link>
      </div>
    </main>
  )
}
