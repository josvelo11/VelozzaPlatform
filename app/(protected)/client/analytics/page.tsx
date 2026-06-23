import PortalModuleRoute from '@/components/dashboard/PortalModuleRoute';

export default function Page() {
  return <PortalModuleRoute portal='client' slug='analytics' requiredRoles={['client']} />;
}
