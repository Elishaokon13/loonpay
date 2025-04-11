import { NextResponse } from "next/server"
import { createUsdcTransferTransaction } from "@/lib/blockchain-service"
import { sql } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { providerId, cardNumber, cardValueUsd, usdcAmount, processingFee, networkFee, walletAddress } =
      await request.json()

    // Validate inputs
    if (!providerId || !cardNumber || !cardValueUsd || !usdcAmount || !walletAddress) {
      return NextResponse.json(
        {
          error: "Missing required fields",
        },
        { status: 400 },
      )
    }

    // Create a transaction record in the database
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
        ${cardNumber}, 
        ${cardValueUsd}, 
        ${usdcAmount}, 
        ${processingFee}, 
        ${networkFee}, 
        ${walletAddress}, 
        ${"PENDING"}
      )
      RETURNING id
    `

    const transactionId = result[0].id

    // Create the blockchain transaction data
    const txRequest = {
      to: walletAddress,
      amount: usdcAmount,
      fromAddress: "0x1234567890123456789012345678901234567890", // This would be your service wallet
    }

    const { txData, estimatedGas } = await createUsdcTransferTransaction(txRequest)

    return NextResponse.json({
      success: true,
      data: {
        transactionId,
        txData,
        estimatedGas,
        gasPrice: "0.0000001", // Example gas price in ETH
        expiresAt: Date.now() + 30 * 60 * 1000, // 30 minutes from now
      },
    })
  } catch (error) {
    console.error("Transaction creation error:", error)
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 })
  }
}
