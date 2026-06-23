import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function getSession() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

export async function getUserWithProfile() {
  const session = await getSession();
  
  if (!session?.user) {
    return null;
  }

  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single();

  return {
    authUser: session.user,
    profile: user,
  };
}

export async function requireAuth(requiredRole?: string | string[]) {
  const user = await getUserWithProfile();
  
  if (!user) {
    redirect('/login');
  }

  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!roles.includes(user.profile?.role)) {
      redirect('/unauthorized');
    }
  }

  return user;
}

export async function getOrganization() {
  const user = await getUserWithProfile();
  
  if (!user?.profile?.organization_id) {
    return null;
  }

  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  
  const { data: org } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', user.profile.organization_id)
    .single();

  return org;
}
