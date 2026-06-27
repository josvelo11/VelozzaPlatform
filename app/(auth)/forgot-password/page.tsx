import { redirect } from 'next/navigation';
import { getCrmUrl } from '@/lib/crm';

export default function ForgotPasswordPage() {
  redirect(getCrmUrl('/agencia'));
}
