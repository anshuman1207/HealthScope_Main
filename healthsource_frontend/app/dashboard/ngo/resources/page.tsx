"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Package, AlertTriangle, Plus, Search, Filter, TrendingUp } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [showAddForm, setShowAddForm] = useState(false)

  const resources = [
    {
      id: 1,
      name: "Medical Masks",
      category: "medical",
      currentStock: 2500,
      minStock: 1000,
      maxStock: 5000,
      unit: "pieces",
      location: "Warehouse A",
      lastUpdated: "2025-08-10",
      supplier: "MedSupply Co.",
      cost: 0.5,
    },
    {
      id: 2,
      name: "Hand Sanitizer",
      category: "hygiene",
      currentStock: 150,
      minStock: 200,
      maxStock: 500,
      unit: "bottles",
      location: "Warehouse B",
      lastUpdated: "2025-08-12",
      supplier: "CleanCare Ltd.",
      cost: 3.25,
    },
    {
      id: 3,
      name: "First Aid Kits",
      category: "medical",
      currentStock: 75,
      minStock: 50,
      maxStock: 200,
      unit: "kits",
      location: "Warehouse A",
      lastUpdated: "2025-08-08",
      supplier: "Emergency Supplies Inc.",
      cost: 25.0,
    },
    {
      id: 4,
      name: "Educational Brochures",
      category: "educational",
      currentStock: 5000,
      minStock: 2000,
      maxStock: 10000,
      unit: "pieces",
      location: "Office Storage",
      lastUpdated: "2025-08-11",
      supplier: "Print Solutions",
      cost: 0.15,
    },
  ]

  const getStockStatus = (current: number, min: number, max: number) => {
    const percentage = (current / max) * 100
    if (current < min) return { status: "low", color: "bg-red-100 text-red-800", percentage }
    if (current > max * 0.8) return { status: "high", color: "bg-green-100 text-green-800", percentage }
    return { status: "normal", color: "bg-blue-100 text-blue-800", percentage }
  }

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || resource.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const totalValue = resources.reduce((sum, resource) => sum + resource.currentStock * resource.cost, 0)
  const lowStockItems = resources.filter((resource) => resource.currentStock < resource.minStock).length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Resources</h1>
            <p className="text-muted-foreground">Manage NGO resources and inventory</p>
          </div>
          <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Resource
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                  <p className="text-2xl font-bold">{resources.length}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
                  <p className="text-2xl font-bold text-red-600">{lowStockItems}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Categories</p>
                  <p className="text-2xl font-bold">4</p>
                </div>
                <Filter className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="medical">Medical</SelectItem>
              <SelectItem value="hygiene">Hygiene</SelectItem>
              <SelectItem value="educational">Educational</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Resources Table */}
        <Card>
          <CardHeader>
            <CardTitle>Resource Inventory</CardTitle>
            <CardDescription>Current stock levels and resource details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredResources.map((resource) => {
                const stockInfo = getStockStatus(resource.currentStock, resource.minStock, resource.maxStock)
                return (
                  <div key={resource.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{resource.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {resource.category} • {resource.location} • ${resource.cost}/{resource.unit}
                        </p>
                      </div>
                      <Badge className={stockInfo.color}>{stockInfo.status}</Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Stock Level</span>
                        <span>
                          {resource.currentStock} / {resource.maxStock} {resource.unit}
                        </span>
                      </div>
                      <Progress value={stockInfo.percentage} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Min: {resource.minStock}</span>
                        <span>Current: {resource.currentStock}</span>
                        <span>Max: {resource.maxStock}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <div className="text-sm text-muted-foreground">
                        Supplier: {resource.supplier} • Updated: {resource.lastUpdated}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Update Stock
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Add Resource Form */}
        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Resource</CardTitle>
              <CardDescription>Add a new resource to your inventory</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Resource Name</Label>
                  <Input id="name" placeholder="Enter resource name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medical">Medical</SelectItem>
                      <SelectItem value="hygiene">Hygiene</SelectItem>
                      <SelectItem value="educational">Educational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentStock">Current Stock</Label>
                  <Input id="currentStock" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minStock">Minimum Stock</Label>
                  <Input id="minStock" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxStock">Maximum Stock</Label>
                  <Input id="maxStock" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Input id="unit" placeholder="e.g., pieces, bottles, kits" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="Storage location" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost per Unit</Label>
                  <Input id="cost" type="number" step="0.01" placeholder="0.00" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Input id="supplier" placeholder="Supplier name" />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowAddForm(false)}>Add Resource</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
