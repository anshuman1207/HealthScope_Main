"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, Users, Shield, Download, Search } from "lucide-react"
import { motion } from "framer-motion"

export default function VaccinationAnalyticsPage() {
  const [selectedState, setSelectedState] = useState("all")
  const [selectedVaccine, setSelectedVaccine] = useState("all")
  const [timeRange, setTimeRange] = useState("6months")

  const stateData = [
    { state: "Maharashtra", coverage: 91, population: 112000000, vaccinated: 102000000, efficiency: 94 },
    { state: "Uttar Pradesh", coverage: 78, population: 200000000, vaccinated: 156000000, efficiency: 87 },
    { state: "Tamil Nadu", coverage: 89, population: 72000000, vaccinated: 64000000, efficiency: 92 },
    { state: "Karnataka", coverage: 85, population: 61000000, vaccinated: 52000000, efficiency: 90 },
    { state: "Gujarat", coverage: 88, population: 60000000, vaccinated: 53000000, efficiency: 91 },
    { state: "West Bengal", coverage: 82, population: 91000000, vaccinated: 75000000, efficiency: 88 },
  ]

  const vaccineEfficiency = [
    {
      vaccine: "COVID-19 mRNA",
      effectiveness: 95,
      sideEffects: 2.1,
      duration: "12 months",
      ageGroups: {
        "18-30": 97,
        "31-50": 95,
        "51-65": 93,
        "65+": 89,
      },
    },
    {
      vaccine: "COVID-19 Viral Vector",
      effectiveness: 88,
      sideEffects: 3.2,
      duration: "10 months",
      ageGroups: {
        "18-30": 91,
        "31-50": 88,
        "51-65": 86,
        "65+": 82,
      },
    },
    {
      vaccine: "Influenza Quadrivalent",
      effectiveness: 72,
      sideEffects: 1.8,
      duration: "12 months",
      ageGroups: {
        "18-30": 75,
        "31-50": 72,
        "51-65": 69,
        "65+": 65,
      },
    },
  ]

  const demographicData = [
    { ageGroup: "0-5", total: 120000000, vaccinated: 95000000, coverage: 79 },
    { ageGroup: "6-17", total: 250000000, vaccinated: 215000000, coverage: 86 },
    { ageGroup: "18-30", total: 350000000, vaccinated: 315000000, coverage: 90 },
    { ageGroup: "31-50", total: 400000000, vaccinated: 368000000, coverage: 92 },
    { ageGroup: "51-65", total: 200000000, vaccinated: 174000000, coverage: 87 },
    { ageGroup: "65+", total: 100000000, vaccinated: 83000000, coverage: 83 },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Vaccination Analytics</h1>
            <p className="text-muted-foreground">Comprehensive analysis of vaccination programs and effectiveness</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <BarChart3 className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">State/UT</label>
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                    <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                    <SelectItem value="karnataka">Karnataka</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Vaccine Type</label>
                <Select value={selectedVaccine} onValueChange={setSelectedVaccine}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vaccine" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Vaccines</SelectItem>
                    <SelectItem value="covid19">COVID-19</SelectItem>
                    <SelectItem value="influenza">Influenza</SelectItem>
                    <SelectItem value="hepatitis">Hepatitis B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Time Range</label>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1month">Last Month</SelectItem>
                    <SelectItem value="3months">Last 3 Months</SelectItem>
                    <SelectItem value="6months">Last 6 Months</SelectItem>
                    <SelectItem value="1year">Last Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search..." className="pl-10" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="coverage" className="space-y-4">
          <TabsList>
            <TabsTrigger value="coverage">Coverage Analysis</TabsTrigger>
            <TabsTrigger value="efficiency">Vaccine Efficiency</TabsTrigger>
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="coverage" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">National Coverage</CardTitle>
                  <Shield className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">84.2%</div>
                  <p className="text-xs text-muted-foreground">+2.1% from last quarter</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Vaccinated</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1.19B</div>
                  <p className="text-xs text-muted-foreground">Out of 1.42B population</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Daily Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2.3M</div>
                  <p className="text-xs text-muted-foreground">Vaccinations per day</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>State-wise Coverage Analysis</CardTitle>
                <CardDescription>Vaccination coverage and efficiency by state</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stateData.map((state, index) => (
                    <motion.div
                      key={state.state}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 border rounded-lg space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{state.state}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{state.coverage}% Coverage</Badge>
                          <Badge variant="outline">{state.efficiency}% Efficiency</Badge>
                        </div>
                      </div>
                      <Progress value={state.coverage} className="h-2" />
                      <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Population:</span> {(state.population / 1000000).toFixed(0)}M
                        </div>
                        <div>
                          <span className="font-medium">Vaccinated:</span> {(state.vaccinated / 1000000).toFixed(0)}M
                        </div>
                        <div>
                          <span className="font-medium">Remaining:</span>{" "}
                          {((state.population - state.vaccinated) / 1000000).toFixed(0)}M
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="efficiency" className="space-y-4">
            <div className="space-y-4">
              {vaccineEfficiency.map((vaccine, index) => (
                <motion.div
                  key={vaccine.vaccine}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>{vaccine.vaccine}</CardTitle>
                      <CardDescription>Effectiveness and safety analysis</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{vaccine.effectiveness}%</div>
                          <p className="text-sm text-muted-foreground">Effectiveness</p>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{vaccine.sideEffects}%</div>
                          <p className="text-sm text-muted-foreground">Side Effects</p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">{vaccine.duration}</div>
                          <p className="text-sm text-muted-foreground">Protection Duration</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Effectiveness by Age Group</h4>
                        <div className="space-y-2">
                          {Object.entries(vaccine.ageGroups).map(([age, effectiveness]) => (
                            <div key={age} className="flex items-center justify-between">
                              <span className="text-sm">{age} years</span>
                              <div className="flex items-center space-x-2">
                                <Progress value={effectiveness} className="w-24 h-2" />
                                <span className="text-sm font-medium">{effectiveness}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="demographics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Age Group Analysis</CardTitle>
                <CardDescription>Vaccination coverage across different age demographics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {demographicData.map((group, index) => (
                    <motion.div
                      key={group.ageGroup}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 border rounded-lg space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Age {group.ageGroup}</h4>
                        <Badge variant="outline">{group.coverage}% Coverage</Badge>
                      </div>
                      <Progress value={group.coverage} className="h-2" />
                      <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Total:</span> {(group.total / 1000000).toFixed(0)}M
                        </div>
                        <div>
                          <span className="font-medium">Vaccinated:</span> {(group.vaccinated / 1000000).toFixed(0)}M
                        </div>
                        <div>
                          <span className="font-medium">Pending:</span>{" "}
                          {((group.total - group.vaccinated) / 1000000).toFixed(0)}M
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Vaccination Trends</CardTitle>
                  <CardDescription>Vaccination rates over the past 12 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <BarChart3 className="h-8 w-8 mr-2" />
                    Chart visualization would be implemented here
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Seasonal Patterns</CardTitle>
                  <CardDescription>Vaccination uptake by season and disease type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <TrendingUp className="h-8 w-8 mr-2" />
                    Seasonal analysis chart would be implemented here
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
