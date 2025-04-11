import { NextResponse } from "next/server"
import { validateGiftCard, giftCardProviders, validateCardNumberLength } from "@/lib/gift-card-providers"
import { calculateUsdcFromUsd } from "@/lib/blockchain-service"

export async function POST(request: Request) {
  try {
    const { providerId, cardNumber, pin, amount } = await request.json()

    // Validate inputs
    if (!providerId || !cardNumber) {
      return NextResponse.json({ error: "Provider ID and card number are required" }, { status: 400 })
    }

    // Find the provider
    const provider = giftCardProviders.find((p) => p.id === providerId)
    if (!provider) {
      return NextResponse.json({ error: "Invalid gift card provider" }, { status: 400 })
    }

    // Validate card number length
    if (!validateCardNumberLength(providerId, cardNumber)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid card number length. ${provider.name} gift cards require ${
            Array.isArray(provider.cardNumberLength)
              ? `${provider.cardNumberLength[0]}-${provider.cardNumberLength[1]}`
              : provider.cardNumberLength
          } digits.`,
        },
        { status: 400 },
      )
    }

    // Validate the gift card with the provider
    const validationResult = await validateGiftCard(providerId, cardNumber, pin, Number(amount))

    if (!validationResult.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: validationResult.errorMessage || "Invalid gift card",
        },
        { status: 400 },
      )
    }

    // Calculate the card value in USD
    const cardValueUsd = validationResult.cardBalance || 0

    // Calculate processing fee (provider's cut)
    const processingFee = cardValueUsd * (1 - provider.exchangeRate)

    // Calculate USDC amount and network fee
    const { usdcAmount, exchangeRate, networkFee } = calculateUsdcFromUsd(cardValueUsd - processingFee)

    // Set offer expiry time (15 minutes from now)
    const expiryTime = Date.now() + 15 * 60 * 1000

    return NextResponse.json({
      success: true,
      data: {
        providerId,
        cardNumber,
        cardValueUsd,
        usdcAmount,
        processingFee,
        networkFee,
        exchangeRate,
        expiryTime,
      },
    })
  } catch (error) {
    console.error("Validation error:", error)
    return NextResponse.json({ error: "Failed to validate gift card" }, { status: 500 })
  }
}
