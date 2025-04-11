import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function maskCardNumber(cardNumber: string): string {
  if (!cardNumber) return ""

  // Format the card number with spaces every 4 digits
  const formatted = cardNumber
    .replace(/\s/g, "")
    .replace(/(.{4})/g, "$1 ")
    .trim()

  // Mask all but the last 4 digits if length is greater than 4
  if (formatted.length > 4) {
    const parts = formatted.split(" ")
    const maskedParts = parts.map((part, index) => {
      if (index === parts.length - 1 || parts.length === 1) {
        return part // Keep the last group visible
      }
      return part.replace(/./g, "•")
    })
    return maskedParts.join(" ")
  }

  return formatted
}
