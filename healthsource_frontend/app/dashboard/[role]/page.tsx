"use client"

import { useParams } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { LoadingSkeleton } from "@/components/common/loading-skeleton"

// Import all role-specific dashboard components
import PatientDashboard from "@/app/dashboard/patient/page"
import DoctorDashboard from "@/app/dashboard/doctor/page"
import NgoDashboard from "@/app/dashboard/ngo/page"
import HospitalDashboard from "@/app/dashboard/hospital/page"
import AdminDashboard from "@/app/dashboard/admin/page"
import GovernmentDashboard from "@/app/dashboard/government/page"

export default function DashboardPage() {
  const params = useParams()
  const { user, loading } = useAuth()
  const role = params.role as string

  if (loading) {
    return <LoadingSkeleton type="dashboard" />
  }

  if (!user) {
    return null
  }

  const renderDashboard = () => {
    switch (role) {
      case "patient":
        return <PatientDashboard />
      case "doctor":
        return <DoctorDashboard />
      case "ngo":
        return <NgoDashboard />
      case "hospital":
        return <HospitalDashboard />
      case "admin":
        return <AdminDashboard />
      case "government":
        return <GovernmentDashboard />
      default:
        return (
          <DashboardLayout>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
              <p>Invalid role: {role}</p>
            </div>
          </DashboardLayout>
        )
    }
  }

  return renderDashboard()
}
