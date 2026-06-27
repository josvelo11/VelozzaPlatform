import PortalModuleRoute from '@/components/dashboard/PortalModuleRoute';

export default function Page() {
  return <PortalModuleRoute portal='admin' slug='clients' requiredRoles={['super_admin', 'admin']} />;
}
