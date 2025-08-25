"use client"

import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const { user } = useAuth()

  if (!user) return null

  const allItems = [{ label: "Dashboard", href: `/dashboard/${user.role}` }, ...items]

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      <Link href={`/dashboard/${user.role}`} className="flex items-center hover:text-foreground transition-colors">
        <Home className="h-4 w-4" />
      </Link>

      {allItems.slice(1).map((item, index) => (
        <div key={index} className="flex items-center space-x-1">
          <ChevronRight className="h-4 w-4" />
          {item.href ? (
            <Link href={item.href} className="hover:text-foreground transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
