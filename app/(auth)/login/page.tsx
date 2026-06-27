import { redirect } from 'next/navigation';
import { getCrmUrl } from '@/lib/crm';

export default function LoginPage() {
  redirect(getCrmUrl('/agencia'));
}
