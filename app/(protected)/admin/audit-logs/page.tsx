import PortalModuleRoute from '@/components/dashboard/PortalModuleRoute';

export default function Page() {
  return <PortalModuleRoute portal='admin' slug='audit-logs' requiredRoles={['super_admin','admin','account_manager']} />;
}
