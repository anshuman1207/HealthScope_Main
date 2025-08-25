"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname, useRouter } from "next/navigation"
import {
  Heart,
  Shield,
  Users,
  Building2,
  Settings,
  LayoutDashboard,
  MessageSquare,
  User,
  FileText,
  Stethoscope,
  Calendar,
  Bell,
  UserCheck,
  MapPin,
  HeartHandshake,
  Target,
  Briefcase,
  Archive,
  Activity,
  ClipboardList,
  UserCog,
  CheckSquare,
  Database,
  HelpCircle,
  Menu,
  X,
  Landmark,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useTranslation } from "@/hooks/use-translation"
import { cn } from "@/lib/utils"
import sidebarStructure from "@/mock-data/sidebar-structure.json"

const roleIcons = {
  patient: Heart,
  doctor: Shield,
  ngo: Users,
  hospital: Building2,
  admin: Settings,
  government: Landmark, // Added government role icon
}

const menuIcons: Record<string, any> = {
  Dashboard: LayoutDashboard,
  "My Patients": UserCheck,
  "AI Analysis": Activity,
  Appointments: Calendar,
  Alerts: Bell,
  Messages: MessageSquare,
  Referrals: HeartHandshake,
  Profile: User,
  "My Reports": FileText,
  "Symptom Checker": Stethoscope,
  "Nearby Clinics": MapPin,
  "My Health Plan": Target,
  "Community Heatmap": MapPin,
  "Cases Needing Help": HeartHandshake,
  "Match Suggestions": Target,
  "Outreach Planner": Briefcase,
  Resources: Archive,
  Doctors: UserCheck,
  Admissions: ClipboardList,
  Inventory: Archive,
  "AI Alerts": Activity,
  Reports: FileText,
  "User Management": UserCog,
  Approvals: CheckSquare,
  "System Logs": Database,
  "Data Requests": HelpCircle,
  Settings: Settings,
  "Audit Trail": ClipboardList,
}

export function DashboardSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()
  const { t } = useTranslation()
  const pathname = usePathname()
  const router = useRouter()

  if (!user) return null

  const RoleIcon = roleIcons[user.role]
  const menuItems = sidebarStructure[user.role as keyof typeof sidebarStructure] || []

  const handleNavigation = (item: string) => {
    if (item === "Dashboard") {
      router.push(`/dashboard/${user.role}`)
    } else {
      const route = item.toLowerCase().replace(/\s+/g, "-")
      router.push(`/dashboard/${user.role}/${route}`)
    }
    setIsOpen(false)
  }

  const getDisplayName = (item: string, role: string) => {
    const key = `${role}.${item.toLowerCase().replace(/\s+/g, "")}`
    const translated = t(key)

    // If translation exists and is different from key, use it
    if (translated !== key) {
      return translated
    }

    // Otherwise, create a proper display name
    if (item === "Dashboard") {
      return `${role.charAt(0).toUpperCase() + role.slice(1)} Dashboard`
    }

    // For other items, just return the item name as is (it's already properly formatted)
    return item
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
            <RoleIcon className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground capitalize">{user.role}</h2>
            <p className="text-sm text-muted-foreground">{user.name}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => {
          const Icon = menuIcons[item] || LayoutDashboard
          const route = `/dashboard/${user.role}/${item.toLowerCase().replace(/\s+/g, "-")}`
          const isActive = pathname === route || (item === "Dashboard" && pathname === `/dashboard/${user.role}`)

          return (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-11 font-medium",
                  isActive && "bg-secondary text-secondary-foreground",
                )}
                onClick={() => handleNavigation(item)}
              >
                <Icon className="w-4 h-4" />
                <span>{getDisplayName(item, user.role)}</span>
              </Button>
            </motion.div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground text-center font-medium">HealthScope AI v1.0</div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden bg-transparent"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-64 lg:block">
        <div className="flex flex-col h-full bg-card border-r border-border">{sidebarContent}</div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border lg:hidden"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
