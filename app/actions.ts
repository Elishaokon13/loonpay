"use server"

import { sql, formatTransaction } from "@/lib/db"
import { revalidatePath } from "next/cache"

// Create a new transaction
export async function createTransaction(data: {
  cardNumber: string
  cardAmount: number
  usdcAmount: number
  processingFee: number
  networkFee: number
  walletAddress: string
  status: string
}) {
  try {
    const result = await sql`
      INSERT INTO transactions (
        card_number, 
        card_amount, 
        usdc_amount, 
        processing_fee, 
        network_fee, 
        wallet_address, 
        status
      ) 
      VALUES (
        ${data.cardNumber}, 
        ${data.cardAmount}, 
        ${data.usdcAmount}, 
        ${data.processingFee}, 
        ${data.networkFee}, 
        ${data.walletAddress}, 
        ${data.status}
      )
      RETURNING id
    `

    revalidatePath("/admin/transactions")
    return { success: true, id: result[0].id }
  } catch (error) {
    console.error("Error creating transaction:", error)
    return { success: false, error: "Failed to create transaction" }
  }
}

// Update transaction status and tx_hash
export async function updateTransactionStatus(id: number, status: string, txHash?: string) {
  try {
    if (txHash) {
      await sql`
        UPDATE transactions 
        SET status = ${status}, tx_hash = ${txHash}, updated_at = NOW() 
        WHERE id = ${id}
      `
    } else {
      await sql`
        UPDATE transactions 
        SET status = ${status}, updated_at = NOW() 
        WHERE id = ${id}
      `
    }

    revalidatePath("/admin/transactions")
    return { success: true }
  } catch (error) {
    console.error("Error updating transaction:", error)
    return { success: false, error: "Failed to update transaction" }
  }
}

// Get all transactions with pagination
export async function getTransactions(page = 1, limit = 10) {
  try {
    const offset = (page - 1) * limit

    const transactions = await sql`
      SELECT * FROM transactions 
      ORDER BY created_at DESC 
      LIMIT ${limit} OFFSET ${offset}
    `

    const countResult = await sql`SELECT COUNT(*) FROM transactions`
    const totalCount = Number.parseInt(countResult[0].count)

    return {
      success: true,
      transactions: transactions.map(formatTransaction),
      pagination: {
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
        current: page,
      },
    }
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return { success: false, error: "Failed to fetch transactions" }
  }
}

// Get transaction by ID
export async function getTransactionById(id: number) {
  try {
    const result = await sql`SELECT * FROM transactions WHERE id = ${id}`

    if (result.length === 0) {
      return { success: false, error: "Transaction not found" }
    }

    return { success: true, transaction: formatTransaction(result[0]) }
  } catch (error) {
    console.error("Error fetching transaction:", error)
    return { success: false, error: "Failed to fetch transaction" }
  }
}

// Get transaction statistics
export async function getTransactionStats() {
  try {
    const totalResult = await sql`
      SELECT 
        COUNT(*) as total_count,
        SUM(card_amount) as total_card_amount,
        SUM(usdc_amount) as total_usdc_amount
      FROM transactions
    `

    const statusCounts = await sql`
      SELECT status, COUNT(*) as count
      FROM transactions
      GROUP BY status
    `

    return {
      success: true,
      stats: {
        totalCount: Number.parseInt(totalResult[0].total_count),
        totalCardAmount: Number.parseFloat(totalResult[0].total_card_amount || 0),
        totalUsdcAmount: Number.parseFloat(totalResult[0].total_usdc_amount || 0),
        statusCounts: statusCounts.reduce((acc: any, curr: any) => {
          acc[curr.status] = Number.parseInt(curr.count)
          return acc
        }, {}),
      },
    }
  } catch (error) {
    console.error("Error fetching transaction stats:", error)
    return { success: false, error: "Failed to fetch transaction statistics" }
  }
}
