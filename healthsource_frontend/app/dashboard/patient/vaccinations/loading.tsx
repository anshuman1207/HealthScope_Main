import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { LoadingSkeleton } from "@/components/common/loading-skeleton"

export default function VaccinationsLoading() {
  return (
    <DashboardLayout>
      <LoadingSkeleton />
    </DashboardLayout>
  )
}
