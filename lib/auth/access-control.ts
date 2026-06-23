export type AppRole = 'super_admin' | 'admin' | 'content_strategist' | 'client';

type ManagedNetwork = 'Facebook' | 'Instagram' | 'TikTok' | 'YouTube';

interface ClientDirectoryEntry {
  email: string;
  companyName: string;
  contactName: string;
  accountManager: string;
  plan: string;
  managedNetworks: ManagedNetwork[];
  networkProfiles: Array<{
    platform: ManagedNetwork;
    handle: string;
    url: string;
  }>;
}

const CLIENT_DIRECTORY: ClientDirectoryEntry[] = [
  {
    email: 'clientnorth@velozza.com',
    companyName: 'North Law Group',
    contactName: 'Carla North',
    accountManager: 'Andres Molina',
    plan: 'Professional',
    managedNetworks: ['Facebook', 'Instagram', 'TikTok', 'YouTube'],
    networkProfiles: [
      { platform: 'Facebook', handle: '@northlawgroup', url: 'https://facebook.com/northlawgroup' },
      { platform: 'Instagram', handle: '@northlawgroup', url: 'https://instagram.com/northlawgroup' },
      { platform: 'TikTok', handle: '@northlawgroup', url: 'https://www.tiktok.com/@northlawgroup' },
      { platform: 'YouTube', handle: '@northlawgroup', url: 'https://youtube.com/@northlawgroup' },
    ],
  },
  {
    email: 'clientacme@velozza.com',
    companyName: 'Acme Foods',
    contactName: 'Daniel Acosta',
    accountManager: 'Laura Ruiz',
    plan: 'Growth',
    managedNetworks: ['Facebook', 'Instagram', 'TikTok', 'YouTube'],
    networkProfiles: [
      { platform: 'Facebook', handle: '@acmefoods', url: 'https://facebook.com/acmefoods' },
      { platform: 'Instagram', handle: '@acmefoods', url: 'https://instagram.com/acmefoods' },
      { platform: 'TikTok', handle: '@acmefoods', url: 'https://www.tiktok.com/@acmefoods' },
      { platform: 'YouTube', handle: '@acmefoods', url: 'https://youtube.com/@acmefoods' },
    ],
  },
];

const ADMIN_MARKERS = ['admin'];
const TEAM_MARKERS = ['team'];
const UNIVERSAL_EMAIL = 'velozajosedavid@gmail.com';

function normalizeRole(rawRole: string): AppRole | null {
  const role = rawRole.trim().toLowerCase();
  if (role === 'super_admin' || role === 'admin' || role === 'content_strategist' || role === 'client') {
    return role;
  }
  return null;
}

export function isUniversalUser(email: string) {
  return email.trim().toLowerCase() === UNIVERSAL_EMAIL;
}

export function resolveRoleFromEmail(email: string, preferredRole?: string | null): AppRole | null {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return null;

  if (isUniversalUser(normalizedEmail)) {
    return 'super_admin';
  }

  const preferred = preferredRole ? normalizeRole(preferredRole) : null;
  if (preferred) {
    return preferred;
  }

  if (ADMIN_MARKERS.some((marker) => normalizedEmail.includes(marker))) {
    return 'admin';
  }

  if (TEAM_MARKERS.some((marker) => normalizedEmail.includes(marker))) {
    return 'content_strategist';
  }

  if (isAllowedClientEmail(normalizedEmail)) {
    return 'client';
  }

  return null;
}

export function isAllowedClientEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  return CLIENT_DIRECTORY.some((item) => item.email.toLowerCase() === normalizedEmail);
}

export function getClientProfileByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const account = CLIENT_DIRECTORY.find((item) => item.email.toLowerCase() === normalizedEmail);
  if (!account) return null;

  return {
    email: account.email,
    companyName: account.companyName,
    contactName: account.contactName,
    accountManager: account.accountManager,
    plan: account.plan,
    managedNetworks: account.managedNetworks,
    networkProfiles: account.networkProfiles,
  };
}
