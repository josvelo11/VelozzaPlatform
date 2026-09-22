import { MetadataRoute } from 'next';

// Única fuente de robots (se eliminó public/robots.txt, que duplicaba y contradecía esta regla).
// Se permite explícitamente a los rastreadores de buscadores de IA para que las guías puedan citarse.
export default function robots(): MetadataRoute.Robots {
  const disallow = ['/api/', '/dashboard/', '/private/', '/clientes/'];
  const ai = ['OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Perplexity-User', 'ClaudeBot', 'Claude-SearchBot', 'Google-Extended', 'Applebot-Extended'];
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow },
      ...ai.map((userAgent) => ({ userAgent, allow: '/', disallow })),
    ],
    sitemap: 'https://velozzacws.com/sitemap.xml',
  };
}
