"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Package, Search, Filter, Plus, AlertTriangle, Package2, Pill, Syringe, Heart, Eye } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const inventoryItems = [
  {
    id: "inv_001",
    name: "Surgical Masks",
    category: "PPE",
    currentStock: 150,
    minStock: 200,
    maxStock: 1000,
    unit: "boxes",
    cost: 25.99,
    supplier: "MedSupply Co.",
    lastRestocked: "2025-08-15",
    expiryDate: "2025-01-15",
    status: "low",
    location: "Storage Room A",
  },
  {
    id: "inv_002",
    name: "Paracetamol 500mg",
    category: "Medication",
    currentStock: 2400,
    minStock: 500,
    maxStock: 5000,
    unit: "tablets",
    cost: 0.15,
    supplier: "PharmaCorp",
    lastRestocked: "2025-08-10",
    expiryDate: "2025-06-30",
    status: "good",
    location: "Pharmacy",
  },
  {
    id: "inv_003",
    name: "Disposable Syringes",
    category: "Medical Supplies",
    currentStock: 45,
    minStock: 100,
    maxStock: 500,
    unit: "packs",
    cost: 12.5,
    supplier: "MedTech Solutions",
    lastRestocked: "2025-08-08",
    expiryDate: "2026-01-08",
    status: "critical",
    location: "Supply Room B",
  },
  {
    id: "inv_004",
    name: "Blood Pressure Monitors",
    category: "Equipment",
    currentStock: 8,
    minStock: 5,
    maxStock: 15,
    unit: "units",
    cost: 89.99,
    supplier: "HealthTech Inc.",
    lastRestocked: "2023-12-20",
    expiryDate: "N/A",
    status: "good",
    location: "Equipment Room",
  },
]

const categoryStats = [
  { category: "Medication", items: 156, lowStock: 12, value: "$45,230" },
  { category: "Medical Supplies", items: 89, lowStock: 8, value: "$23,450" },
  { category: "PPE", items: 34, lowStock: 5, value: "$12,890" },
  { category: "Equipment", items: 67, lowStock: 3, value: "$89,670" },
]

export default function HospitalInventoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-600 bg-green-50 border-green-200"
      case "low":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "critical":
        return "text-red-600 bg-red-50 border-red-200"
      case "overstocked":
        return "text-blue-600 bg-blue-50 border-blue-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getStockPercentage = (current: number, min: number, max: number) => {
    return Math.min((current / max) * 100, 100)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Medication":
        return Pill
      case "Medical Supplies":
        return Syringe
      case "PPE":
        return Package2
      case "Equipment":
        return Heart
      default:
        return Package
    }
  }

  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <DashboardLayout
      title="Inventory Management"
      breadcrumbs={[{ label: "Hospital Dashboard", href: "/dashboard/hospital" }, { label: "Inventory" }]}
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-1 gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Reports
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>

        {/* Category Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryStats.map((stat, index) => {
            const IconComponent = getCategoryIcon(stat.category)
            return (
              <motion.div
                key={stat.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.category}</p>
                        <p className="text-2xl font-bold">{stat.items}</p>
                        <p className="text-sm text-muted-foreground">Total Items</p>
                        {stat.lowStock > 0 && (
                          <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                            <AlertTriangle className="h-3 w-3" />
                            {stat.lowStock} low stock
                          </p>
                        )}
                      </div>
                      <div className="p-3 rounded-full bg-gray-50">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm font-medium">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">Total Value</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Inventory Items */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Inventory Items</CardTitle>
              <Tabs defaultValue="all" className="w-auto">
                <TabsList>
                  <TabsTrigger value="all">All Items</TabsTrigger>
                  <TabsTrigger value="low">Low Stock</TabsTrigger>
                  <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-muted-foreground">{item.category}</p>
                    </div>
                    <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Stock Level</span>
                          <span className="text-sm text-muted-foreground">
                            {item.currentStock} / {item.maxStock} {item.unit}
                          </span>
                        </div>
                        <Progress
                          value={getStockPercentage(item.currentStock, item.minStock, item.maxStock)}
                          className="h-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>Min: {item.minStock}</span>
                          <span>Max: {item.maxStock}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Unit Cost:</span>
                        <span className="text-sm font-medium">${item.cost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Value:</span>
                        <span className="text-sm font-medium">${(item.currentStock * item.cost).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Location:</span>
                        <span className="text-sm font-medium">{item.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Supplier:</span>
                        <span className="text-sm font-medium">{item.supplier}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Last Restocked:</span>
                        <span className="text-sm font-medium">{item.lastRestocked}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Expiry Date:</span>
                        <span className="text-sm font-medium">{item.expiryDate}</span>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline">
                          <Package className="h-4 w-4 mr-1" />
                          Restock
                        </Button>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </div>
                    </div>
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
