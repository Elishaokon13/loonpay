"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, AlertCircle, CheckCircle2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { CountdownTimer } from "@/components/countdown-timer"
import { maskCardNumber } from "@/lib/utils"
import { giftCardProviders, getCardNumberLengthRequirement, validateCardNumberLength } from "@/lib/gift-card-providers"

// Add import for CardScanner
import { CardScanner } from "@/components/card-scanner"
// Add import for SecurityBadges
import { SecurityBadges } from "@/components/security-badges"

// Create a dynamic form schema that will update based on the selected provider
const createFormSchema = (selectedProviderId: string | null) => {
  return z.object({
    providerId: z.string().min(1, {
      message: "Please select a gift card provider.",
    }),
    cardNumber: z
      .string()
      .min(1, {
        message: "Card number is required.",
      })
      .refine(
        (value) => {
          if (!selectedProviderId) return true
          return validateCardNumberLength(selectedProviderId, value)
        },
        (value) => ({
          message: selectedProviderId
            ? `Invalid card number length. ${getCardNumberLengthRequirement(selectedProviderId)} required.`
            : "Invalid card number length.",
        }),
      ),
    pin: z.string().optional(),
    amount: z.string().optional(),
  })
}

export default function ValidateCard() {
  const router = useRouter()
  const [isValidating, setIsValidating] = useState(false)
  const [validationError, setValidationError] = useState("")
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null)
  const [offer, setOffer] = useState<{
    providerId: string
    cardNumber: string
    cardValueUsd: number
    usdcAmount: number
    processingFee: number
    networkFee: number
    exchangeRate: number
    expiryTime: number
  } | null>(null)

  // Create form with dynamic schema
  const form = useForm<z.infer<ReturnType<typeof createFormSchema>>>({
    resolver: zodResolver(createFormSchema(selectedProviderId)),
    defaultValues: {
      providerId: "",
      cardNumber: "",
      pin: "",
      amount: "",
    },
  })

  // Watch the providerId to determine if PIN is required and update schema
  const watchedProviderId = form.watch("providerId")
  const selectedProvider = giftCardProviders.find((p) => p.id === watchedProviderId)
  const requiresPin = selectedProvider?.requiresPin || false

  // Update selected provider ID when it changes
  useEffect(() => {
    if (watchedProviderId !== selectedProviderId) {
      setSelectedProviderId(watchedProviderId)
      // Reset card number and pin when provider changes
      form.setValue("cardNumber", "")
      form.setValue("pin", "")
    }
  }, [watchedProviderId, selectedProviderId, form])

  async function onSubmit(values: z.infer<ReturnType<typeof createFormSchema>>) {
    setIsValidating(true)
    setValidationError("")

    try {
      // Call the validate API
      const response = await fetch("/api/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          providerId: values.providerId,
          cardNumber: values.cardNumber,
          pin: values.pin,
          amount: values.amount,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to validate gift card")
      }

      setOffer(data.data)
    } catch (error: any) {
      setValidationError(error.message || "Failed to validate card. Please check your details and try again.")
    } finally {
      setIsValidating(false)
    }
  }

  function handleCardNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.replace(/\s/g, "")
    form.setValue("cardNumber", value, { shouldValidate: true })
  }

  function handleAcceptOffer() {
    if (offer) {
      // Store offer in localStorage to pass to the next page
      localStorage.setItem("giftCardOffer", JSON.stringify(offer))
      router.push("/payment")
    }
  }

  return (
    <div className="container max-w-2xl mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Validate Your Gift Card</CardTitle>
          <CardDescription>Enter your gift card details to get an instant USDC offer</CardDescription>
        </CardHeader>
        <CardContent>
          {!offer ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="providerId"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Gift Card Provider</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-2 gap-4"
                        >
                          {giftCardProviders.map((provider) => (
                            <FormItem key={provider.id}>
                              <FormControl>
                                <RadioGroupItem value={provider.id} id={provider.id} className="peer sr-only" />
                              </FormControl>
                              <FormLabel
                                htmlFor={provider.id}
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                              >
                                <Image
                                  src={provider.logo || "/placeholder.svg"}
                                  alt={provider.name}
                                  width={40}
                                  height={40}
                                  className="mb-3"
                                />
                                <span className="text-sm font-medium">{provider.name}</span>
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedProvider && (
                  <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gift Card Number</FormLabel>
                        <div className="flex space-x-2">
                          <FormControl>
                            <Input
                              placeholder={`Enter card number (${getCardNumberLengthRequirement(selectedProvider.id)})`}
                              {...field}
                              value={maskCardNumber(field.value)}
                              onChange={handleCardNumberChange}
                              autoComplete="off"
                            />
                          </FormControl>
                          <CardScanner
                            onScan={(cardNumber) => {
                              form.setValue("cardNumber", cardNumber, { shouldValidate: true })
                            }}
                          />
                        </div>
                        <FormDescription className="flex items-center">
                          <Info className="h-3 w-3 mr-1" />
                          {selectedProvider.name} cards require {getCardNumberLengthRequirement(selectedProvider.id)}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {requiresPin && (
                  <FormField
                    control={form.control}
                    name="pin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PIN</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter PIN" type="password" autoComplete="off" {...field} />
                        </FormControl>
                        <FormDescription>This gift card requires a PIN for validation</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {selectedProvider && (
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Card Amount</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-2 gap-2"
                          >
                            {selectedProvider.supportedDenominations.map((amount) => (
                              <FormItem key={amount}>
                                <FormControl>
                                  <RadioGroupItem
                                    value={amount.toString()}
                                    id={`amount-${amount}`}
                                    className="peer sr-only"
                                  />
                                </FormControl>
                                <FormLabel
                                  htmlFor={`amount-${amount}`}
                                  className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                  ${amount.toFixed(2)}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormDescription>Select the amount loaded on your gift card</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {validationError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{validationError}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isValidating || !selectedProvider}>
                  {isValidating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Validating...
                    </>
                  ) : (
                    "Validate Card"
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="space-y-6">
              <Alert className="bg-emerald-50 border-emerald-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <AlertTitle className="text-emerald-800">Card Validated Successfully</AlertTitle>
                <AlertDescription className="text-emerald-700">
                  Your gift card has been validated and we can offer you the following exchange rate.
                </AlertDescription>
              </Alert>

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

              <div className="text-center">
                <p className="text-sm text-zinc-500 mb-2">This offer expires in:</p>
                <CountdownTimer expiryTime={offer.expiryTime} />
              </div>
            </div>
          )}
        </CardContent>
        {!offer && (
          <div className="px-6 pb-6">
            <SecurityBadges />
          </div>
        )}
        {offer && (
          <CardFooter className="flex-col space-y-4">
            <Button onClick={handleAcceptOffer} className="w-full bg-emerald-600 hover:bg-emerald-700">
              Accept Offer & Continue
            </Button>
            <SecurityBadges />
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
