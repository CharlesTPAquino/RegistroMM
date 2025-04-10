import { Dashboard } from '../features/dashboard/Dashboard';
import { DashboardLayout } from '../layouts/DashboardLayout';

export function DashboardPage() {
  console.log('DashboardPage renderizado');
  return (
    <DashboardLayout>
      <Dashboard />
    </DashboardLayout>
  );
}
