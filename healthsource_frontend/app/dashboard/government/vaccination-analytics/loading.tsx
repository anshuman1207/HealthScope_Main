import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { LoadingSkeleton } from "@/components/common/loading-skeleton"

export default function VaccinationAnalyticsLoading() {
  return (
    <DashboardLayout>
      <LoadingSkeleton />
    </DashboardLayout>
  )
}
