import Link from "next/link"
import { getTransactionStats } from "../actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, CreditCard, DollarSign } from "lucide-react"

export default async function AdminDashboard() {
  const { success, stats, error } = await getTransactionStats()

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="space-x-4">
          <Link href="/admin/analytics">
            <Button variant="outline">Analytics Dashboard</Button>
          </Link>
          <Link href="/admin/transactions">
            <Button>
              View All Transactions <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {!success ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error loading dashboard data: {error}
        </div>
      ) : (
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                  <BarChart3 className="h-4 w-4 text-zinc-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCount}</div>
                  <p className="text-xs text-zinc-500 mt-1">All time</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Card Value</CardTitle>
                  <CreditCard className="h-4 w-4 text-zinc-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.totalCardAmount.toFixed(2)}</div>
                  <p className="text-xs text-zinc-500 mt-1">USD</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total USDC Issued</CardTitle>
                  <DollarSign className="h-4 w-4 text-zinc-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsdcAmount.toFixed(2)}</div>
                  <p className="text-xs text-zinc-500 mt-1">USDC</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Transaction Status</CardTitle>
                <CardDescription>Distribution of transaction statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(stats.statusCounts || {}).map(([status, count]) => (
                    <div key={status} className="flex items-center">
                      <div className="w-1/4 font-medium">{status}</div>
                      <div className="w-3/4">
                        <div className="w-full bg-zinc-100 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${
                              status === "COMPLETED"
                                ? "bg-emerald-500"
                                : status === "PROCESSING"
                                  ? "bg-amber-500"
                                  : status === "PENDING"
                                    ? "bg-blue-500"
                                    : "bg-red-500"
                            }`}
                            style={{ width: `${(Number(count) / stats.totalCount) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-zinc-500 mt-1">
                          <span>{count} transactions</span>
                          <span>{((Number(count) / stats.totalCount) * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>View the most recent gift card conversions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="mb-4">View the full transaction list for detailed information</p>
                  <Link href="/admin/transactions">
                    <Button>
                      View All Transactions <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
