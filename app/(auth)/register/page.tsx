import { redirect } from 'next/navigation';
import { getCrmUrl } from '@/lib/crm';

export default function RegisterPage() {
  redirect(getCrmUrl('/agencia'));
}
