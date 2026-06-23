import PortalModuleRoute from '@/components/dashboard/PortalModuleRoute';

export default function Page() {
  return <PortalModuleRoute portal='admin' slug='packages' requiredRoles={['super_admin','admin','account_manager']} />;
}
