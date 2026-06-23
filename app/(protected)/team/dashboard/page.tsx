import PortalModuleRoute from '@/components/dashboard/PortalModuleRoute';

export default function Page() {
  return <PortalModuleRoute portal='team' slug='dashboard' requiredRoles={['admin','account_manager','content_strategist','designer','video_editor','copywriter','contractor']} />;
}
