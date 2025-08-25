"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/use-auth"
import { useTranslation } from "@/hooks/use-translation"
import { ThemeToggle } from "@/components/common/theme-toggle"
import { LanguageSelector } from "@/components/common/language-selector"
import { Heart, Shield, Users, Building2, Settings } from "lucide-react"

const roleIcons = {
  patient: Heart,
  doctor: Shield,
  ngo: Users,
  hospital: Building2,
  admin: Settings,
  government: Settings
}

const roleDescriptions = {
  patient: "Access your health records, get AI-powered insights, and connect with healthcare providers",
  doctor: "Analyze patient data with AI assistance, manage appointments, and collaborate with colleagues",
  ngo: "Monitor community health trends, identify at-risk populations, and coordinate outreach programs",
  hospital: "Manage hospital operations, track resources, and oversee patient care across departments",
  admin: "Oversee system operations, manage users, and maintain platform security and compliance",
}

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    name: "",
  })
  const [loading, setLoading] = useState(false)

  const { signIn, signUp, resetPassword } = useAuth()
  const { t } = useTranslation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === "signin") {
        await signIn(formData.email, formData.password)
      } else if (mode === "signup") {
        await signUp(formData.email, formData.password, formData.role, formData.name)
      } else {
        await resetPassword(formData.email)
      }
    } catch (error) {
      console.error("Auth error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <LanguageSelector />
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4"
          >
            <Heart className="w-8 h-8 text-primary-foreground" />
          </motion.div>
          <h1 className="text-3xl font-bold text-foreground">HealthScope AI</h1>
          <p className="text-muted-foreground mt-2">Intelligent Healthcare for Everyone</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {mode === "signin" && t("auth.signin")}
              {mode === "signup" && t("auth.signup")}
              {mode === "forgot" && "Reset Password"}
            </CardTitle>
            <CardDescription>
              {mode === "signin" && "Welcome back to HealthScope AI"}
              {mode === "signup" && "Join the future of healthcare"}
              {mode === "forgot" && "Enter your email to reset your password"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {mode === "signup" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="role">Select Your Role</Label>
                      <Select
                        value={formData.role}
                        onValueChange={(value) => setFormData({ ...formData, role: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose your role" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(roleIcons).map(([role, Icon]) => (
                            <SelectItem key={role} value={role}>
                              <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4" />
                                <span className="capitalize">{role}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formData.role && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {roleDescriptions[formData.role as keyof typeof roleDescriptions]}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              {mode !== "forgot" && (
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
              )}

              {mode === "signup" && (
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    {mode === "signin" && t("auth.signin")}
                    {mode === "signup" && t("auth.signup")}
                    {mode === "forgot" && "Send Reset Link"}
                  </>
                )}
              </Button>
            </form>

            <div className="mt-4 text-center space-y-2">
              {mode === "signin" && (
                <>
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="text-sm text-primary hover:underline"
                  >
                    {t("auth.forgot")}
                  </button>
                  <div>
                    <span className="text-sm text-muted-foreground">Don't have an account? </span>
                    <button
                      type="button"
                      onClick={() => setMode("signup")}
                      className="text-sm text-primary hover:underline"
                    >
                      Sign up
                    </button>
                  </div>
                </>
              )}

              {(mode === "signup" || mode === "forgot") && (
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="text-sm text-primary hover:underline"
                >
                  Back to sign in
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
