"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Globe, Heart, Users, Stethoscope, MapPin, Phone, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/common/theme-toggle"

export default function LandingPage() {
  const router = useRouter()
  const { scrollYProgress } = useScroll()
  const [mounted, setMounted] = useState(false)

  // Animation transforms
  const earthX = useTransform(scrollYProgress, [0, 0.5], [0, 300])
  const earthRotate = useTransform(scrollYProgress, [0, 1], [0, 360])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const missionOpacity = useTransform(scrollYProgress, [0.2, 0.6], [0, 1])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">HealthScope AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button variant="outline" onClick={() => router.push("/auth")} className="hidden sm:inline-flex">
                Sign In
              </Button>
              <Button
                onClick={() => router.push("/auth")}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Get Started
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section
        className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16"
        style={{ opacity: heroOpacity }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Earth Animation */}
          <motion.div className="relative flex justify-center lg:justify-start" style={{ x: earthX }}>
            <motion.div className="relative w-80 h-80 sm:w-96 sm:h-96" style={{ rotate: earthRotate }}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-green-400 to-blue-600 rounded-full shadow-2xl">
                <div className="absolute inset-4 bg-gradient-to-br from-green-300 via-blue-300 to-green-500 rounded-full opacity-80">
                  <div className="absolute inset-8 bg-gradient-to-br from-blue-200 via-green-200 to-blue-400 rounded-full opacity-60">
                    <div className="absolute inset-12 bg-gradient-to-br from-green-100 via-blue-100 to-green-300 rounded-full opacity-40"></div>
                  </div>
                </div>
              </div>
              {/* Floating elements around earth */}
              <motion.div
                className="absolute -top-4 -right-4 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                <Heart className="w-4 h-4 text-white" />
              </motion.div>
              <motion.div
                className="absolute -bottom-4 -left-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY }}
              >
                <Users className="w-4 h-4 text-white" />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Hero Content */}
          <div className="text-center lg:text-left space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <Badge className="mb-4 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 dark:from-blue-900 dark:to-indigo-900 dark:text-blue-200">
                <Globe className="w-4 h-4 mr-2" />
                Connecting India's Healthcare
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Healthcare for
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {" "}
                  Everyone
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                Bridging the gap between patients, doctors, hospitals, and NGOs across India. AI-powered healthcare
                solutions that connect communities and save lives.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Button
                size="lg"
                onClick={() => router.push("/auth")}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-6"
              >
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 bg-transparent">
                Learn More
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-8 pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">50K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Patients Served</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">1K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Healthcare Providers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">100+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Cities Covered</div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Mission Section */}
      <motion.section
        className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20"
        style={{ opacity: missionOpacity }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Mission: Connecting India's Healthcare Ecosystem
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Breaking down barriers and building bridges between patients, healthcare providers, and communities across
              India through innovative AI-powered solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Heart,
                title: "For Patients",
                description:
                  "AI-powered symptom checking, appointment booking, and health tracking in Hindi and regional languages.",
                color: "from-red-500 to-pink-500",
              },
              {
                icon: Stethoscope,
                title: "For Doctors",
                description:
                  "Advanced diagnostic tools, patient management, and AI-assisted medical analysis for better outcomes.",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: Users,
                title: "For NGOs",
                description:
                  "Community outreach tools, volunteer management, and resource distribution for maximum impact.",
                color: "from-green-500 to-emerald-500",
              },
              {
                icon: Globe,
                title: "For Hospitals",
                description:
                  "Complete hospital management, bed tracking, and operational efficiency tools for Indian healthcare.",
                color: "from-purple-500 to-indigo-500",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center`}
                    >
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Ready to Transform Healthcare in India?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of healthcare providers and patients already using HealthScope AI to improve health outcomes
            across India.
          </p>
          <Button
            size="lg"
            onClick={() => router.push("/auth")}
            className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6"
          >
            Get Started Today
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">HealthScope AI</span>
              </div>
              <p className="text-gray-400">Connecting India's healthcare ecosystem through innovative AI solutions.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact Info</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Mumbai, Maharashtra, India</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>contact@healthscope.ai</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>AI Diagnostics</li>
                <li>Telemedicine</li>
                <li>Hospital Management</li>
                <li>Community Health</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Pricing</h3>
              <div className="space-y-2 text-gray-400">
                <div>Basic: ₹999/month</div>
                <div>Pro: ₹2,999/month</div>
                <div>Enterprise: ₹9,999/month</div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 HealthScope AI. All rights reserved. Made in India 🇮🇳</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
