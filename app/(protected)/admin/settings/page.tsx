import PortalModuleRoute from '@/components/dashboard/PortalModuleRoute';

export default function Page() {
  return <PortalModuleRoute portal='admin' slug='settings' requiredRoles={['super_admin','admin','account_manager']} />;
}
