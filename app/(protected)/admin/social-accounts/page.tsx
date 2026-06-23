import PortalModuleRoute from '@/components/dashboard/PortalModuleRoute';

export default function Page() {
  return <PortalModuleRoute portal='admin' slug='social-accounts' requiredRoles={['super_admin','admin','account_manager']} />;
}
