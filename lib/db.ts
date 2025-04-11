import { neon } from "@neondatabase/serverless"

// Create a SQL client with the connection string from environment variables
export const sql = neon(process.env.DATABASE_URL!)

// Helper function to format a transaction for the frontend
export function formatTransaction(transaction: any) {
  return {
    id: transaction.id,
    cardNumber: transaction.card_number,
    cardAmount: Number.parseFloat(transaction.card_amount),
    usdcAmount: Number.parseFloat(transaction.usdc_amount),
    processingFee: Number.parseFloat(transaction.processing_fee),
    networkFee: Number.parseFloat(transaction.network_fee),
    walletAddress: transaction.wallet_address,
    txHash: transaction.tx_hash,
    status: transaction.status,
    createdAt: new Date(transaction.created_at).toISOString(),
    updatedAt: new Date(transaction.updated_at).toISOString(),
  }
}
