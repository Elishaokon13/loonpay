import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

async function getAnalyticsData() {
  // Provider distribution
  const providerData = [
    { name: "Amazon", count: 42, percentage: 42 },
    { name: "Walmart", count: 28, percentage: 28 },
    { name: "Target", count: 18, percentage: 18 },
    { name: "Best Buy", count: 12, percentage: 12 },
  ]

  // Amount distribution
  const amountData = [
    { amount: 25, count: 15, percentage: 15 },
    { amount: 50, count: 35, percentage: 35 },
    { amount: 100, count: 40, percentage: 40 },
    { amount: 200, count: 10, percentage: 10 },
  ]

  // Daily conversions
  const dailyData = [
    { date: "2023-05-01", count: 8, volume: 450 },
    { date: "2023-05-02", count: 12, volume: 720 },
    { date: "2023-05-03", count: 10, volume: 550 },
    { date: "2023-05-04", count: 15, volume: 875 },
    { date: "2023-05-05", count: 18, volume: 1200 },
    { date: "2023-05-06", count: 14, volume: 950 },
    { date: "2023-05-07", count: 23, volume: 1450 },
  ]

  // Revenue data
  const revenueData = {
    totalProcessingFees: 1250.75,
    totalNetworkFees: 750.25,
    totalRevenue: 2001.0,
    averageMargin: 0.08, // 8%
  }

  return {
    providerData,
    amountData,
    dailyData,
    revenueData,
  }
}

export default async function AnalyticsPage() {
  const { providerData, amountData, dailyData, revenueData } = await getAnalyticsData()

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Conversion Analytics</h1>
      </div>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="amounts">Amounts</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">100</div>
                <p className="text-xs text-zinc-500 mt-1">Last 7 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$6,195.00</div>
                <p className="text-xs text-zinc-500 mt-1">Last 7 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Card Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$61.95</div>
                <p className="text-xs text-zinc-500 mt-1">Last 7 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${revenueData.totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-zinc-500 mt-1">Last 7 days</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Conversions</CardTitle>
                <CardDescription>Number of gift cards converted per day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-end space-x-2">
                  {dailyData.map((day) => (
                    <div key={day.date} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-emerald-500 rounded-t"
                        style={{ height: `${(day.count / 23) * 100}%` }}
                      ></div>
                      <div className="text-xs mt-2 text-zinc-500">{day.date.split("-")[2]}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Provider Distribution</CardTitle>
                <CardDescription>Gift card providers by conversion volume</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {providerData.map((provider) => (
                    <div key={provider.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{provider.name}</span>
                        <span className="font-medium">
                          {provider.count} cards ({provider.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-zinc-100 rounded-full h-2.5">
                        <div
                          className="bg-emerald-500 h-2.5 rounded-full"
                          style={{ width: `${provider.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="providers">
          <Card>
            <CardHeader>
              <CardTitle>Gift Card Provider Analysis</CardTitle>
              <CardDescription>Detailed breakdown by provider</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Provider</th>
                      <th className="text-left py-3 px-4 font-medium">Conversions</th>
                      <th className="text-left py-3 px-4 font-medium">Total Value</th>
                      <th className="text-left py-3 px-4 font-medium">Avg. Value</th>
                      <th className="text-left py-3 px-4 font-medium">Success Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4">Amazon</td>
                      <td className="py-3 px-4">42</td>
                      <td className="py-3 px-4">$2,520.00</td>
                      <td className="py-3 px-4">$60.00</td>
                      <td className="py-3 px-4">98%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Walmart</td>
                      <td className="py-3 px-4">28</td>
                      <td className="py-3 px-4">$1,680.00</td>
                      <td className="py-3 px-4">$60.00</td>
                      <td className="py-3 px-4">95%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Target</td>
                      <td className="py-3 px-4">18</td>
                      <td className="py-3 px-4">$1,080.00</td>
                      <td className="py-3 px-4">$60.00</td>
                      <td className="py-3 px-4">92%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Best Buy</td>
                      <td className="py-3 px-4">12</td>
                      <td className="py-3 px-4">$720.00</td>
                      <td className="py-3 px-4">$60.00</td>
                      <td className="py-3 px-4">90%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="amounts">
          <Card>
            <CardHeader>
              <CardTitle>Gift Card Amount Analysis</CardTitle>
              <CardDescription>Distribution by card denomination</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="space-y-4">
                    {amountData.map((item) => (
                      <div key={item.amount}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>${item.amount}</span>
                          <span className="font-medium">
                            {item.count} cards ({item.percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-zinc-100 rounded-full h-2.5">
                          <div
                            className="bg-emerald-500 h-2.5 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="w-64 h-64 rounded-full border-8 border-emerald-100 relative">
                    {amountData.map((item, index) => {
                      const previousPercentages = amountData.slice(0, index).reduce((sum, i) => sum + i.percentage, 0)

                      return (
                        <div
                          key={item.amount}
                          className="absolute inset-0"
                          style={{
                            background: `conic-gradient(transparent ${previousPercentages}%, #10b981 ${previousPercentages}%, #10b981 ${previousPercentages + item.percentage}%, transparent ${previousPercentages + item.percentage}%)`,
                          }}
                        ></div>
                      )
                    })}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white w-48 h-48 rounded-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-lg font-bold">$61.95</div>
                          <div className="text-xs text-zinc-500">Average Value</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Processing Fees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${revenueData.totalProcessingFees.toFixed(2)}</div>
                <p className="text-xs text-zinc-500 mt-1">Last 7 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Network Fees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${revenueData.totalNetworkFees.toFixed(2)}</div>
                <p className="text-xs text-zinc-500 mt-1">Last 7 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${revenueData.totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-zinc-500 mt-1">Last 7 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Margin</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(revenueData.averageMargin * 100).toFixed(1)}%</div>
                <p className="text-xs text-zinc-500 mt-1">Per transaction</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
              <CardDescription>Analysis of revenue sources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Revenue Source</th>
                        <th className="text-right py-3 px-4 font-medium">Amount</th>
                        <th className="text-right py-3 px-4 font-medium">Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3 px-4">Processing Fees</td>
                        <td className="py-3 px-4 text-right">${revenueData.totalProcessingFees.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right">
                          {((revenueData.totalProcessingFees / revenueData.totalRevenue) * 100).toFixed(1)}%
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">Network Fees</td>
                        <td className="py-3 px-4 text-right">${revenueData.totalNetworkFees.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right">
                          {((revenueData.totalNetworkFees / revenueData.totalRevenue) * 100).toFixed(1)}%
                        </td>
                      </tr>
                      <tr className="border-b font-medium">
                        <td className="py-3 px-4">Total Revenue</td>
                        <td className="py-3 px-4 text-right">${revenueData.totalRevenue.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right">100%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-center">
                  <div className="w-64 h-64 rounded-full border-8 border-emerald-100 relative">
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `conic-gradient(#10b981 0%, #10b981 ${(revenueData.totalProcessingFees / revenueData.totalRevenue) * 100}%, #34d399 ${(revenueData.totalProcessingFees / revenueData.totalRevenue) * 100}%, #34d399 100%)`,
                      }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white w-48 h-48 rounded-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-lg font-bold">${revenueData.totalRevenue.toFixed(2)}</div>
                          <div className="text-xs text-zinc-500">Total Revenue</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
