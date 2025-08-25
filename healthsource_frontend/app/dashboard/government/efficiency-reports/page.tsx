"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, TrendingUp, Shield, Target, Download, Calendar, Filter } from "lucide-react"

export default function EfficiencyReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("6months")
  const [selectedVaccine, setSelectedVaccine] = useState("all")

  const efficiencyData = [
    {
      vaccine: "COVID-19 (Covishield)",
      effectiveness: 94.2,
      coverage: 89.5,
      adverseEvents: 0.02,
      costPerDose: 150,
      totalDoses: 1250000000,
      trend: "up",
    },
    {
      vaccine: "COVID-19 (Covaxin)",
      effectiveness: 91.8,
      coverage: 78.3,
      adverseEvents: 0.01,
      costPerDose: 200,
      totalDoses: 850000000,
      trend: "up",
    },
    {
      vaccine: "Influenza",
      effectiveness: 76.4,
      coverage: 45.2,
      adverseEvents: 0.05,
      costPerDose: 75,
      totalDoses: 125000000,
      trend: "stable",
    },
    {
      vaccine: "Hepatitis B",
      effectiveness: 98.1,
      coverage: 92.7,
      adverseEvents: 0.003,
      costPerDose: 45,
      totalDoses: 95000000,
      trend: "up",
    },
  ]

  const stateComparison = [
    { state: "Kerala", efficiency: 96.2, coverage: 94.8, rank: 1 },
    { state: "Tamil Nadu", efficiency: 94.7, coverage: 91.3, rank: 2 },
    { state: "Karnataka", efficiency: 92.1, coverage: 88.9, rank: 3 },
    { state: "Maharashtra", efficiency: 89.8, coverage: 86.2, rank: 4 },
    { state: "Gujarat", efficiency: 87.3, coverage: 83.7, rank: 5 },
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down":
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
      default:
        return <TrendingUp className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Efficiency Reports</h1>
            <p className="text-muted-foreground">Analyze vaccination program effectiveness and outcomes</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Efficiency</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">91.2%</div>
              <p className="text-xs text-muted-foreground">+2.3% from last quarter</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cost Effectiveness</CardTitle>
              <Target className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹142</div>
              <p className="text-xs text-muted-foreground">Per dose average</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Safety Score</CardTitle>
              <Shield className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">99.97%</div>
              <p className="text-xs text-muted-foreground">Adverse events: 0.03%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Programs Active</CardTitle>
              <Calendar className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">Across all states</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Report Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Time Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="1year">Last Year</SelectItem>
                  <SelectItem value="2years">Last 2 Years</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedVaccine} onValueChange={setSelectedVaccine}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Vaccine Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vaccines</SelectItem>
                  <SelectItem value="covid">COVID-19</SelectItem>
                  <SelectItem value="influenza">Influenza</SelectItem>
                  <SelectItem value="hepatitis">Hepatitis B</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="vaccine-efficiency" className="space-y-4">
          <TabsList>
            <TabsTrigger value="vaccine-efficiency">Vaccine Efficiency</TabsTrigger>
            <TabsTrigger value="state-comparison">State Comparison</TabsTrigger>
            <TabsTrigger value="cost-analysis">Cost Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="vaccine-efficiency" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Vaccine Effectiveness Analysis</CardTitle>
                <CardDescription>Comprehensive efficiency metrics for all vaccination programs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {efficiencyData.map((vaccine, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{vaccine.vaccine}</h3>
                          {getTrendIcon(vaccine.trend)}
                        </div>
                        <Badge variant="outline">{vaccine.totalDoses.toLocaleString()} doses</Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Effectiveness</p>
                          <p className="font-semibold text-lg text-green-600">{vaccine.effectiveness}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Coverage</p>
                          <p className="font-semibold text-lg">{vaccine.coverage}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Adverse Events</p>
                          <p className="font-semibold text-lg">{vaccine.adverseEvents}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Cost per Dose</p>
                          <p className="font-semibold text-lg">₹{vaccine.costPerDose}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total Investment</p>
                          <p className="font-semibold text-lg">
                            ₹{((vaccine.totalDoses * vaccine.costPerDose) / 10000000).toFixed(1)}Cr
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="state-comparison" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>State-wise Performance Ranking</CardTitle>
                <CardDescription>Comparative analysis of vaccination program efficiency across states</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stateComparison.map((state, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold">
                          {state.rank}
                        </div>
                        <div>
                          <h3 className="font-semibold">{state.state}</h3>
                          <p className="text-sm text-muted-foreground">Coverage: {state.coverage}%</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">{state.efficiency}%</p>
                        <p className="text-sm text-muted-foreground">Efficiency Score</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cost-analysis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cost-Benefit Analysis</CardTitle>
                <CardDescription>Financial efficiency and return on investment analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Cost Breakdown</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Vaccine Procurement</span>
                        <span className="font-semibold">₹2,45,000 Cr</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Distribution & Logistics</span>
                        <span className="font-semibold">₹45,000 Cr</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Healthcare Infrastructure</span>
                        <span className="font-semibold">₹78,000 Cr</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Training & Awareness</span>
                        <span className="font-semibold">₹12,000 Cr</span>
                      </div>
                      <hr />
                      <div className="flex justify-between font-semibold">
                        <span>Total Investment</span>
                        <span>₹3,80,000 Cr</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Economic Impact</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Healthcare Savings</span>
                        <span className="font-semibold text-green-600">₹5,67,000 Cr</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Productivity Gains</span>
                        <span className="font-semibold text-green-600">₹2,34,000 Cr</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Lives Saved (Value)</span>
                        <span className="font-semibold text-green-600">₹1,89,000 Cr</span>
                      </div>
                      <hr />
                      <div className="flex justify-between font-semibold">
                        <span>Total Benefit</span>
                        <span className="text-green-600">₹9,90,000 Cr</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg">
                        <span>ROI</span>
                        <span className="text-green-600">260%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
