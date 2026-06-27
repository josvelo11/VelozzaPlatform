const DEFAULT_CRM_URL = 'https://disciplined-wisdom-production-82b0.up.railway.app';

export function getCrmBaseUrl() {
  return process.env.NEXT_PUBLIC_CRM_URL || DEFAULT_CRM_URL;
}

export function getCrmUrl(path = '') {
  return new URL(path, getCrmBaseUrl()).toString();
}