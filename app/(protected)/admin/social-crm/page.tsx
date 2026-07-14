import PortalModuleRoute from '@/components/dashboard/PortalModuleRoute';

export const dynamic = 'force-dynamic';

export default function Page() {
  return <PortalModuleRoute portal='admin' slug='social-crm' requiredRoles={['super_admin','admin','account_manager']} />;
}
