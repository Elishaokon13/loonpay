"use client"

import { useState } from "react"
import { Gift, Copy, Check, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ReferralProgram() {
  const [copied, setCopied] = useState(false)
  const referralCode = "FRIEND25"
  const referralLink = `https://giftcard2usdc.com/ref/${referralCode}`

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center">
          <Gift className="h-5 w-5 mr-2 text-emerald-600" />
          Referral Program
        </CardTitle>
        <CardDescription>Earn $25 in USDC for each friend who converts their first gift card</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="link">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="link">Referral Link</TabsTrigger>
            <TabsTrigger value="code">Referral Code</TabsTrigger>
          </TabsList>
          <TabsContent value="link" className="space-y-4">
            <div className="flex space-x-2">
              <Input value={referralLink} readOnly className="font-mono text-sm" />
              <Button variant="outline" size="icon" onClick={() => handleCopy(referralLink)} className="shrink-0">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="w-full">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Invite Friends</Button>
            </div>
          </TabsContent>
          <TabsContent value="code" className="space-y-4">
            <div className="flex justify-center">
              <div className="text-2xl font-bold tracking-wider bg-zinc-100 px-6 py-3 rounded-md font-mono">
                {referralCode}
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={() => handleCopy(referralCode)}>
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? "Copied!" : "Copy Code"}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
