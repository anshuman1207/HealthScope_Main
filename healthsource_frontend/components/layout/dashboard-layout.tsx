"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import { DashboardSidebar } from "./dashboard-sidebar"
import { DashboardTopbar } from "./dashboard-topbar"
import { Breadcrumbs } from "./breadcrumbs"

interface DashboardLayoutProps {
  children: ReactNode
  title?: string
  breadcrumbs?: Array<{ label: string; href?: string }>
}

export function DashboardLayout({ children, title, breadcrumbs }: DashboardLayoutProps) {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />

      <div className="lg:pl-64">
        <DashboardTopbar />

        <main className="p-6">
          {(title || breadcrumbs) && (
            <div className="mb-6">
              {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
              {title && (
                <motion.h1
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-bold text-foreground mt-2"
                >
                  {title}
                </motion.h1>
              )}
            </div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
