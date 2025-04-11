// This file simulates different gift card providers and their validation APIs

export interface GiftCardProvider {
  id: string
  name: string
  logo: string
  supportedDenominations: number[]
  requiresPin: boolean
  exchangeRate: number // Percentage of face value offered (0-1)
  cardNumberLength: number | [number, number] // Either fixed length or [min, max] range
  cardNumberFormat?: RegExp // Optional regex pattern for card number format
}

export interface ValidationResult {
  isValid: boolean
  cardBalance?: number
  errorMessage?: string
}

// Simulated gift card providers
export const giftCardProviders: GiftCardProvider[] = [
  {
    id: "amazon",
    name: "Amazon",
    logo: "/images/gift-cards/amazon.svg",
    supportedDenominations: [25, 50, 100, 200],
    requiresPin: false,
    exchangeRate: 0.92,
    cardNumberLength: [16, 16],
    cardNumberFormat: /^[A-Z0-9]{4}-[A-Z0-9]{6}-[A-Z0-9]{4}$/i,
  },
  {
    id: "walmart",
    name: "Walmart",
    logo: "/images/gift-cards/walmart.svg",
    supportedDenominations: [25, 50, 100, 200, 500],
    requiresPin: true,
    exchangeRate: 0.9,
    cardNumberLength: [16, 19],
  },
  {
    id: "target",
    name: "Target",
    logo: "/images/gift-cards/target.svg",
    supportedDenominations: [25, 50, 100],
    requiresPin: true,
    exchangeRate: 0.88,
    cardNumberLength: 15,
  },
  {
    id: "bestbuy",
    name: "Best Buy",
    logo: "/images/gift-cards/bestbuy.svg",
    supportedDenominations: [25, 50, 100, 250],
    requiresPin: false,
    exchangeRate: 0.85,
    cardNumberLength: [12, 13],
  },
]

// Helper function to validate card number length
export function validateCardNumberLength(providerId: string, cardNumber: string): boolean {
  const provider = giftCardProviders.find((p) => p.id === providerId)
  if (!provider) return false

  // Remove any spaces or dashes for length checking
  const cleanCardNumber = cardNumber.replace(/[\s-]/g, "")

  if (Array.isArray(provider.cardNumberLength)) {
    const [min, max] = provider.cardNumberLength
    return cleanCardNumber.length >= min && cleanCardNumber.length <= max
  } else {
    return cleanCardNumber.length === provider.cardNumberLength
  }
}

// Helper function to get card number length requirements as string
export function getCardNumberLengthRequirement(providerId: string): string {
  const provider = giftCardProviders.find((p) => p.id === providerId)
  if (!provider) return "Valid card number"

  if (Array.isArray(provider.cardNumberLength)) {
    const [min, max] = provider.cardNumberLength
    return min === max ? `${min} digits` : `${min}-${max} digits`
  } else {
    return `${provider.cardNumberLength} digits`
  }
}

// Simulated validation function
export async function validateGiftCard(
  providerId: string,
  cardNumber: string,
  pin?: string,
  amount?: number,
): Promise<ValidationResult> {
  // Simulate API call to gift card provider
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const provider = giftCardProviders.find((p) => p.id === providerId)

  if (!provider) {
    return {
      isValid: false,
      errorMessage: "Invalid gift card provider",
    }
  }

  // Validate card number length
  if (!validateCardNumberLength(providerId, cardNumber)) {
    return {
      isValid: false,
      errorMessage: `Invalid card number length. ${provider.name} gift cards require ${getCardNumberLengthRequirement(providerId)}.`,
    }
  }

  // Validate card number format if specified
  if (provider.cardNumberFormat && !provider.cardNumberFormat.test(cardNumber)) {
    return {
      isValid: false,
      errorMessage: `Invalid card number format for ${provider.name} gift card.`,
    }
  }

  // Simulate PIN validation
  if (provider.requiresPin && !pin) {
    return {
      isValid: false,
      errorMessage: "PIN is required for this gift card",
    }
  }

  // Simple validation logic (in a real app, this would call the provider's API)
  const isValidCard = cardNumber.length >= 10 && !cardNumber.includes("invalid")

  if (!isValidCard) {
    return {
      isValid: false,
      errorMessage: "Invalid gift card number",
    }
  }

  // If amount is provided, validate it against the card
  if (amount) {
    // In a real app, we would check if the card has sufficient balance
    const isValidAmount = provider.supportedDenominations.includes(amount)

    if (!isValidAmount) {
      return {
        isValid: false,
        errorMessage: "Invalid amount for this gift card",
      }
    }

    return {
      isValid: true,
      cardBalance: amount,
    }
  }

  // If no amount provided, return a random balance from supported denominations
  const randomIndex = Math.floor(Math.random() * provider.supportedDenominations.length)
  const cardBalance = provider.supportedDenominations[randomIndex]

  return {
    isValid: true,
    cardBalance,
  }
}
