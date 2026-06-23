import { notFound } from 'next/navigation';
import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import PortalModuleView from '@/components/dashboard/PortalModuleView';
import { getPortalModule } from '@/lib/constants/portal-modules';
import { hydrateModuleFromSupabase } from '@/lib/api/portal-data';
import { PortalType } from '@/types/portal';

interface PortalModuleRouteProps {
  portal: PortalType;
  slug: string;
  requiredRoles: string[];
}

export default async function PortalModuleRoute({ portal, slug, requiredRoles }: PortalModuleRouteProps) {
  const moduleData = getPortalModule(portal, slug);

  if (!moduleData) {
    notFound();
  }

  const hydratedModule = await hydrateModuleFromSupabase(portal, moduleData);

  return (
    <ProtectedLayout requiredRoles={requiredRoles} portalType={portal}>
      <PortalModuleView module={hydratedModule} portal={portal} />
    </ProtectedLayout>
  );
}
