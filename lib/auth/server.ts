import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    '';

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Read-only contexts cannot mutate cookies.
        }
      },
    },
  });
}

export async function getSession() {
  try {
    const supabase = await createSupabaseServerClient();
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

  const supabase = await createSupabaseServerClient();

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

  const supabase = await createSupabaseServerClient();

  const { data: org } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', user.profile.organization_id)
    .single();

  return org;
}
