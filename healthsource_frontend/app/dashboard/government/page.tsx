"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Shield, Users, MapPin, AlertTriangle, Activity, Calendar, FileText, TrendingUp, TrendingDown, Brain, Zap, Globe, Bell, RefreshCw, BarChart3, Target } from "lucide-react"
import { motion } from "framer-motion"
import React, { useState, useEffect } from 'react'

export default function GovernmentDashboard() {
  // Live data states
  const [population, setPopulation] = useState(1420000000);
  const [vaccinationCoverage, setVaccinationCoverage] = useState(82.4);
  const [activeOutbreaks, setActiveOutbreaks] = useState(7);
  const [rdProjects, setRdProjects] = useState(23);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLive, setIsLive] = useState(true);
  
  const [vaccinationStats, setVaccinationStats] = useState([
    { name: "COVID-19", coverage: 89, total: 1200000000, trend: "+2.3%", velocity: 0.02, mlPrediction: "Herd immunity by Q2 2025", confidence: 94 },
    { name: "Influenza", coverage: 67, total: 900000000, trend: "+1.8%", velocity: 0.015, mlPrediction: "Seasonal peak coverage optimal", confidence: 87 },
    { name: "Hepatitis B", coverage: 78, total: 1050000000, trend: "+0.9%", velocity: 0.01, mlPrediction: "Rural uptake improving", confidence: 91 },
    { name: "Polio", coverage: 95, total: 1280000000, trend: "+0.2%", velocity: 0.002, mlPrediction: "Eradication target on track", confidence: 98 },
  ]);

  const [outbreakAlerts, setOutbreakAlerts] = useState([
    {
      disease: "Dengue Fever",
      location: "Mumbai, Maharashtra",
      severity: "high",
      cases: 1247,
      trend: "+15%",
      lastUpdated: "2 hours ago",
      velocity: 2.3,
      mlRisk: 8.7,
      predictedPeak: "Next 3-5 days",
      interventions: 15,
      resourcesDeployed: "24 teams, 156 bed capacity"
    },
    {
      disease: "Chikungunya",
      location: "Chennai, Tamil Nadu",
      severity: "medium",
      cases: 523,
      trend: "+8%",
      lastUpdated: "4 hours ago",
      velocity: 1.1,
      mlRisk: 6.2,
      predictedPeak: "Next 1-2 weeks",
      interventions: 8,
      resourcesDeployed: "12 teams, 89 bed capacity"
    },
    {
      disease: "Malaria",
      location: "Kolkata, West Bengal",
      severity: "low",
      cases: 189,
      trend: "-3%",
      lastUpdated: "6 hours ago",
      velocity: -0.3,
      mlRisk: 3.4,
      predictedPeak: "Declining",
      interventions: 4,
      resourcesDeployed: "6 teams, routine monitoring"
    },
  ]);

  const recentReports = [
    {
      title: "Q4 2024 Vaccination Efficiency Report",
      type: "AI-Enhanced Analysis",
      date: "2024-01-15",
      status: "published",
      aiInsights: "94% accuracy prediction model",
      impact: "Policy optimization achieved 23% efficiency gain"
    },
    {
      title: "COVID-19 Booster Campaign ML Analysis",
      type: "Predictive Report",
      date: "2024-01-10",
      status: "draft",
      aiInsights: "Real-time sentiment analysis integrated",
      impact: "Identified 12 high-hesitancy districts"
    },
    {
      title: "Multi-Disease Outbreak Pattern Recognition",
      type: "ML Research Study",
      date: "2024-01-08",
      status: "review",
      aiInsights: "Cross-correlation model deployed",
      impact: "Early warning system 87% faster"
    },
  ]

  // Live data simulation
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setPopulation(prev => prev + Math.floor(Math.random() * 100 + 50));
      setVaccinationCoverage(prev => Math.min(100, prev + (Math.random() - 0.3) * 0.1));
      
      if (Math.random() < 0.3) {
        setActiveOutbreaks(prev => Math.max(0, prev + (Math.random() > 0.7 ? 1 : -1)));
      }
      
      if (Math.random() < 0.1) {
        setRdProjects(prev => prev + (Math.random() > 0.8 ? 1 : 0));
      }

      setVaccinationStats(prev => prev.map(vaccine => ({
        ...vaccine,
        coverage: Math.min(100, Math.max(0, vaccine.coverage + (Math.random() - 0.4) * vaccine.velocity)),
        total: Math.floor(vaccine.total + (Math.random() * 10000 + 5000)),
        confidence: Math.max(80, Math.min(99, vaccine.confidence + (Math.random() - 0.5)))
      })));

      setOutbreakAlerts(prev => prev.map(outbreak => ({
        ...outbreak,
        cases: Math.max(0, Math.floor(outbreak.cases + (Math.random() - 0.3) * outbreak.velocity * 10)),
        mlRisk: Math.max(1, Math.min(10, outbreak.mlRisk + (Math.random() - 0.5) * 0.1))
      })));

      setLastUpdate(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  const formatNumber = (num:number) => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center">
              Government Dashboard
              <div className={`ml-3 h-3 w-3 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            </h1>
            <p className="text-muted-foreground flex items-center">
              <Brain className="h-4 w-4 mr-1" />
              AI-powered national health surveillance • Live updates: {lastUpdate.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsLive(!isLive)}
              className={isLive ? "border-green-500 text-green-600" : "border-gray-300"}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLive ? 'animate-spin' : ''}`} />
              {isLive ? 'Live Mode' : 'Paused'}
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Create Alert
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Population</CardTitle>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-blue-600" />
                <Activity className="h-3 w-3 text-blue-600 animate-pulse" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(population)}</div>
              <p className="text-xs text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +0.8% from last year
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI-Optimized Coverage</CardTitle>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-600" />
                <Brain className="h-3 w-3 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vaccinationCoverage.toFixed(1)}%</div>
              <p className="text-xs text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                ML-predicted +3.2% efficiency
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ML-Monitored Outbreaks</CardTitle>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                {activeOutbreaks > 7 && <Zap className="h-3 w-3 text-red-600 animate-bounce" />}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeOutbreaks}</div>
              <p className="text-xs text-green-600 flex items-center">
                <TrendingDown className="h-3 w-3 mr-1" />
                AI-predicted containment in 5 days
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Smart R&D Projects</CardTitle>
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-purple-600" />
                <Badge variant="secondary" className="text-xs">AI</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rdProjects}</div>
              <p className="text-xs text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +5 AI-accelerated projects
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ML-Enhanced Vaccination Coverage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-green-600" />
                AI-Powered Vaccination Analytics
                <Badge variant="secondary" className="ml-2">Live ML</Badge>
              </CardTitle>
              <CardDescription>Real-time ML predictions and optimization insights</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {vaccinationStats.map((vaccine, index) => (
                <motion.div
                  key={vaccine.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-3 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{vaccine.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">{vaccine.coverage.toFixed(1)}%</span>
                      <Badge variant="outline" className="text-green-600">
                        {vaccine.trend}
                      </Badge>
                      <Badge variant="secondary" className="text-purple-600">
                        {vaccine.confidence}% AI
                      </Badge>
                    </div>
                  </div>
                  <Progress value={vaccine.coverage} className="h-3" />
                  <div className="grid grid-cols-1 gap-2 text-xs">
                    <p className="text-muted-foreground">
                      <strong>Vaccinated:</strong> {vaccine.total.toLocaleString()} people
                      <span className="ml-2 text-blue-600">
                        <Activity className="h-3 w-3 inline mr-1" />
                        Live tracking
                      </span>
                    </p>
                    <p className="text-purple-600 font-medium">
                      <Brain className="h-3 w-3 inline mr-1" />
                      AI Insight: {vaccine.mlPrediction}
                    </p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* AI-Enhanced Disease Outbreaks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                Smart Disease Surveillance
                <Badge variant="destructive" className="ml-2">AI Alert</Badge>
              </CardTitle>
              <CardDescription>Machine learning outbreak prediction and response</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {outbreakAlerts.map((outbreak, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border rounded-lg space-y-3 bg-gradient-to-r from-red-50 to-orange-50"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold flex items-center">
                      {outbreak.disease}
                      <Zap className="h-3 w-3 ml-2 text-orange-500 animate-pulse" />
                    </h4>
                    <div className="flex space-x-2">
                      <Badge
                        variant={
                          outbreak.severity === "high"
                            ? "destructive"
                            : outbreak.severity === "medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {outbreak.severity}
                      </Badge>
                      <Badge variant="outline" className="text-purple-600">
                        Risk: {outbreak.mlRisk.toFixed(1)}/10
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {outbreak.location}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Cases: </span>
                      <span className="font-semibold">{outbreak.cases}</span>
                      <span className={`ml-2 ${outbreak.velocity > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {outbreak.trend}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Interventions: </span>
                      <span className="font-semibold text-blue-600">{outbreak.interventions} active</span>
                    </div>
                  </div>
                  <div className="bg-white p-2 rounded text-xs">
                    <div className="flex items-center text-purple-600 font-medium mb-1">
                      <Brain className="h-3 w-3 mr-1" />
                      AI Prediction: Peak {outbreak.predictedPeak}
                    </div>
                    <div className="text-muted-foreground">
                      <strong>Resources:</strong> {outbreak.resourcesDeployed}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Real-time ML analysis • Updated {outbreak.lastUpdated}
                  </p>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* AI-Enhanced Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              AI-Enhanced Reports & Analysis
              <Badge variant="secondary" className="ml-2">ML Powered</Badge>
            </CardTitle>
            <CardDescription>Intelligent analytics with machine learning insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReports.map((report, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-purple-50 to-blue-50"
                >
                  <div className="space-y-2 flex-1">
                    <h4 className="font-semibold flex items-center">
                      {report.title}
                      <Brain className="h-4 w-4 ml-2 text-purple-600" />
                    </h4>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Badge variant="outline" className="mr-2">{report.type}</Badge>
                        <Calendar className="h-4 w-4 mr-1" />
                        {report.date}
                      </span>
                    </div>
                    <div className="text-sm space-y-1">
                      <div className="flex items-center text-purple-600">
                        <Zap className="h-3 w-3 mr-1" />
                        <strong>AI Insight:</strong> <span className="ml-1">{report.aiInsights}</span>
                      </div>
                      <div className="flex items-center text-green-600">
                        <Target className="h-3 w-3 mr-1" />
                        <strong>Impact:</strong> <span className="ml-1">{report.impact}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Badge 
                      variant={report.status === "published" ? "default" : report.status === "draft" ? "secondary" : "outline"}
                      className={report.status === "published" ? "bg-green-100 text-green-800" : ""}
                    >
                      {report.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Brain className="h-4 w-4 mr-1" />
                      AI Analysis
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}