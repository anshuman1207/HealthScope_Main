"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Target, Activity, TrendingUp, CheckCircle, AlertCircle, Plus, Edit } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const healthGoals = [
  {
    id: "goal_001",
    title: "Weight Management",
    target: "Lose 10 lbs",
    current: "Lost 6 lbs",
    progress: 60,
    deadline: "2024-03-01",
    status: "on-track",
    activities: ["Daily walks", "Calorie tracking", "Weekly weigh-ins"],
  },
  {
    id: "goal_002",
    title: "Blood Sugar Control",
    target: "HbA1c < 7%",
    current: "HbA1c 7.2%",
    progress: 75,
    deadline: "2024-02-15",
    status: "needs-attention",
    activities: ["Medication adherence", "Diet monitoring", "Regular testing"],
  },
  {
    id: "goal_003",
    title: "Exercise Routine",
    target: "150 min/week",
    current: "120 min/week",
    progress: 80,
    deadline: "Ongoing",
    status: "on-track",
    activities: ["Morning walks", "Yoga sessions", "Weekend cycling"],
  },
]

const recommendations = [
  {
    id: "rec_001",
    type: "diet",
    title: "Reduce refined sugar intake",
    description: "Limit processed foods and sugary drinks to help manage blood glucose levels",
    priority: "high",
    completed: false,
  },
  {
    id: "rec_002",
    type: "exercise",
    title: "Add strength training",
    description: "Include 2 days of resistance exercises to improve muscle mass and metabolism",
    priority: "medium",
    completed: false,
  },
  {
    id: "rec_003",
    type: "monitoring",
    title: "Daily blood pressure checks",
    description: "Monitor BP daily for 2 weeks to establish baseline patterns",
    priority: "high",
    completed: true,
  },
]

export default function MyHealthPlan() {
  const [activeTab, setActiveTab] = useState("goals")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-track":
        return "text-green-600 bg-green-50 border-green-200"
      case "needs-attention":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "behind":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50"
      case "medium":
        return "text-orange-600 bg-orange-50"
      case "low":
        return "text-blue-600 bg-blue-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <DashboardLayout title="My Health Plan" breadcrumbs={[{ label: "My Health Plan" }]}>
      <div className="space-y-6">
        {/* Health Plan Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Goals</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">2 on track, 1 needs attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Overall Progress</p>
                  <p className="text-2xl font-bold">72%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">+8% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Recommendations</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
                <Activity className="h-8 w-8 text-purple-600" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">2 high priority</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="goals">Health Goals</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
          </TabsList>

          <TabsContent value="goals" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">My Health Goals</h3>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Goal
              </Button>
            </div>

            <div className="space-y-4">
              {healthGoals.map((goal, index) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold">{goal.title}</h4>
                          <p className="text-sm text-muted-foreground">Target: {goal.target}</p>
                          <p className="text-sm text-muted-foreground">Current: {goal.current}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(goal.status)}>{goal.status.replace("-", " ")}</Badge>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium">Activities:</p>
                        <div className="flex flex-wrap gap-2">
                          {goal.activities.map((activity, actIndex) => (
                            <Badge key={actIndex} variant="outline" className="text-xs">
                              {activity}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 text-xs text-muted-foreground">Deadline: {goal.deadline}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            <h3 className="text-lg font-semibold">Personalized Recommendations</h3>

            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {rec.completed ? (
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                          )}
                          <div>
                            <h4 className="font-semibold">{rec.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                          </div>
                        </div>
                        <Badge className={getPriorityColor(rec.priority)}>{rec.priority}</Badge>
                      </div>

                      {!rec.completed && (
                        <div className="mt-4 flex gap-2">
                          <Button size="sm">Mark Complete</Button>
                          <Button variant="outline" size="sm">
                            Remind Later
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            <h3 className="text-lg font-semibold">Progress Tracking</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Exercise Minutes</span>
                      <span className="font-semibold">120/150</span>
                    </div>
                    <Progress value={80} className="h-2" />

                    <div className="flex justify-between items-center">
                      <span className="text-sm">Steps Goal</span>
                      <span className="font-semibold">8,500/10,000</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Health Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Weight Progress</span>
                      <span className="font-semibold text-green-600">-6 lbs</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm">Blood Pressure</span>
                      <span className="font-semibold">125/82</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm">Last HbA1c</span>
                      <span className="font-semibold">7.2%</span>
                    </div>
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
