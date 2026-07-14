import PortalModuleRoute from '@/components/dashboard/PortalModuleRoute';

export const dynamic = 'force-dynamic';

export default function Page() {
  return <PortalModuleRoute portal='client' slug='social-crm' requiredRoles={['client']} />;
}
