import { NextResponse } from "next/server"
import { submitSignedTransaction } from "@/lib/blockchain-service"
import { sql } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { transactionId, signedTx } = await request.json()

    // Validate inputs
    if (!transactionId || !signedTx) {
      return NextResponse.json(
        {
          error: "Transaction ID and signed transaction are required",
        },
        { status: 400 },
      )
    }

    // Update transaction status in the database
    await sql`
      UPDATE transactions 
      SET status = ${"PROCESSING"}, updated_at = NOW() 
      WHERE id = ${transactionId}
    `

    // Submit the signed transaction to the blockchain
    const result = await submitSignedTransaction(signedTx)

    if (!result.success) {
      await sql`
        UPDATE transactions 
        SET status = ${"FAILED"}, updated_at = NOW() 
        WHERE id = ${transactionId}
      `

      return NextResponse.json(
        {
          success: false,
          error: result.errorMessage || "Failed to submit transaction",
        },
        { status: 500 },
      )
    }

    // Update transaction with tx hash
    await sql`
      UPDATE transactions 
      SET status = ${"PROCESSING"}, tx_hash = ${result.txHash}, updated_at = NOW() 
      WHERE id = ${transactionId}
    `

    return NextResponse.json({
      success: true,
      data: {
        status: "PROCESSING",
        txHash: result.txHash,
        estimatedCompletionTime: Date.now() + 2 * 60 * 1000, // 2 minutes from now
      },
    })
  } catch (error) {
    console.error("Settlement error:", error)
    return NextResponse.json({ error: "Failed to settle transaction" }, { status: 500 })
  }
}
