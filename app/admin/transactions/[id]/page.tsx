import Link from "next/link"
import { notFound } from "next/navigation"
import { getTransactionById } from "@/app/actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { format } from "date-fns"

export default async function TransactionDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const id = Number.parseInt(params.id)
  const { success, transaction, error } = await getTransactionById(id)

  if (!success) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <Link href="/admin/transactions">
            <Button variant="outline" size="icon" className="mr-4">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Transaction #{id}</h1>
        </div>
        <div className="flex space-x-2">
          {transaction.txHash && (
            <Button variant="outline" asChild>
              <Link href={`https://basescan.org/tx/${transaction.txHash}`} target="_blank">
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Blockchain
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                transaction.status === "COMPLETED"
                  ? "bg-emerald-100 text-emerald-800"
                  : transaction.status === "PROCESSING"
                    ? "bg-amber-100 text-amber-800"
                    : transaction.status === "PENDING"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-red-100 text-red-800"
              }`}
            >
              {transaction.status}
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Created At</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-medium">{format(new Date(transaction.createdAt), "PPP")}</div>
            <div className="text-xs text-zinc-500">{format(new Date(transaction.createdAt), "pp")}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-medium">{format(new Date(transaction.updatedAt), "PPP")}</div>
            <div className="text-xs text-zinc-500">{format(new Date(transaction.updatedAt), "pp")}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
            <CardDescription>Gift card conversion information</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-zinc-500">Card Number</dt>
                <dd className="text-sm">{transaction.cardNumber}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-zinc-500">Card Amount</dt>
                <dd className="text-sm">${transaction.cardAmount.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-zinc-500">USDC Amount</dt>
                <dd className="text-sm">{transaction.usdcAmount.toFixed(2)} USDC</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-zinc-500">Processing Fee</dt>
                <dd className="text-sm">${transaction.processingFee.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-zinc-500">Network Fee</dt>
                <dd className="text-sm">${transaction.networkFee.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-zinc-500">Conversion Rate</dt>
                <dd className="text-sm">1 USD = {(transaction.usdcAmount / transaction.cardAmount).toFixed(2)} USDC</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Blockchain Information</CardTitle>
            <CardDescription>Wallet and transaction details</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-zinc-500 mb-1">Wallet Address</dt>
                <dd className="text-sm break-all bg-zinc-50 p-2 rounded">{transaction.walletAddress}</dd>
              </div>

              {transaction.txHash ? (
                <div>
                  <dt className="text-sm font-medium text-zinc-500 mb-1">Transaction Hash</dt>
                  <dd className="text-sm break-all bg-zinc-50 p-2 rounded">{transaction.txHash}</dd>
                </div>
              ) : (
                <div className="text-sm text-zinc-500">No blockchain transaction hash available yet.</div>
              )}
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
