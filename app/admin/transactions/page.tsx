import Link from "next/link"
import { getTransactions } from "@/app/actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1
  const { success, transactions, pagination, error } = await getTransactions(page)

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <Link href="/admin">
            <Button variant="outline" size="icon" className="mr-4">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Transactions</h1>
        </div>
      </div>

      {!success ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error loading transactions: {error}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
            <CardDescription>{pagination?.total} total transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">ID</th>
                    <th className="text-left py-3 px-4 font-medium">Card Amount</th>
                    <th className="text-left py-3 px-4 font-medium">USDC Amount</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Created</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-zinc-500">
                        No transactions found
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx: any) => (
                      <tr key={tx.id} className="border-b hover:bg-zinc-50">
                        <td className="py-3 px-4">{tx.id}</td>
                        <td className="py-3 px-4">${tx.cardAmount.toFixed(2)}</td>
                        <td className="py-3 px-4">{tx.usdcAmount.toFixed(2)} USDC</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              tx.status === "COMPLETED"
                                ? "bg-emerald-100 text-emerald-800"
                                : tx.status === "PROCESSING"
                                  ? "bg-amber-100 text-amber-800"
                                  : tx.status === "PENDING"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-red-100 text-red-800"
                            }`}
                          >
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {formatDistanceToNow(new Date(tx.createdAt), { addSuffix: true })}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Link href={`/admin/transactions/${tx.id}`}>
                              <Button variant="outline" size="sm">
                                Details
                              </Button>
                            </Link>
                            {tx.txHash && (
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`https://basescan.org/tx/${tx.txHash}`} target="_blank">
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  Blockchain
                                </Link>
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {pagination && pagination.pages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-zinc-500">
                  Page {pagination.current} of {pagination.pages}
                </div>
                <div className="flex space-x-2">
                  {pagination.current > 1 && (
                    <Link href={`/admin/transactions?page=${pagination.current - 1}`}>
                      <Button variant="outline" size="sm">
                        Previous
                      </Button>
                    </Link>
                  )}
                  {pagination.current < pagination.pages && (
                    <Link href={`/admin/transactions?page=${pagination.current + 1}`}>
                      <Button variant="outline" size="sm">
                        Next
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
