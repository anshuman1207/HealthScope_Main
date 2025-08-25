"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, TrendingUp, Info, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

interface Contributor {
  factor: string
  impact: number
}

interface PredictionCardProps {
  condition: string
  riskScore: number
  confidence: number
  contributors: Contributor[]
  recommendations: string[]
  className?: string
}

export function PredictionCard({
  condition,
  riskScore,
  confidence,
  contributors,
  recommendations,
  className,
}: PredictionCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: "High", color: "destructive", icon: AlertTriangle }
    if (score >= 60) return { level: "Medium", color: "warning", icon: TrendingUp }
    return { level: "Low", color: "secondary", icon: Info }
  }

  const risk = getRiskLevel(riskScore)
  const RiskIcon = risk.icon

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{condition}</CardTitle>
          <Badge variant={risk.color as any} className="flex items-center gap-1">
            <RiskIcon className="h-3 w-3" />
            {risk.level} Risk
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Risk Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Risk Score</span>
            <span className="font-medium">{riskScore}/100</span>
          </div>
          <Progress value={riskScore} className="h-2" />
        </div>

        {/* Confidence */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">AI Confidence</span>
            <span className="font-medium">{Math.round(confidence * 100)}%</span>
          </div>
          <Progress value={confidence * 100} className="h-2" />
        </div>

        {/* Toggle Details */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDetails(!showDetails)}
          className="w-full justify-between"
        >
          <span>Explain Prediction</span>
          {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>

        {/* Detailed Explanation */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <Separator />

              {/* Contributing Factors */}
              <div>
                <h4 className="text-sm font-medium mb-3">Contributing Factors</h4>
                <div className="space-y-2">
                  {contributors.map((contributor, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-muted-foreground">{contributor.factor}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${contributor.impact * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium w-8">{Math.round(contributor.impact * 100)}%</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="text-sm font-medium mb-3">Recommendations</h4>
                <ul className="space-y-2">
                  {recommendations.map((recommendation, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-sm text-muted-foreground flex items-start gap-2"
                    >
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      {recommendation}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
