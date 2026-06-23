import PortalModuleRoute from '@/components/dashboard/PortalModuleRoute';

export default function Page() {
  return <PortalModuleRoute portal='admin' slug='team' requiredRoles={['super_admin','admin','account_manager']} />;
}
