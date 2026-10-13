// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: 'https://studioparadoxal.com.br',

  // Adapter: prepara o build para rodar na infraestrutura da Cloudflare (Workers).
  // Páginas são estáticas (pré-renderizadas) por padrão; só rotas marcadas como
  // on-demand rodam no servidor (formulários, login, APIs).
  adapter: cloudflare({
    // Otimiza imagens no momento do build: zero custo e zero processamento por visita.
    imageService: 'compile',
  }),

  // Fonts API: baixa as fontes do Google no build e serve do próprio domínio
  // (self-hosting). Mais rápido, sem requisição extra ao Google e melhor para a LGPD.
  fonts: [
    {
      name: 'Urbanist',
      cssVariable: '--font-display',
      provider: fontProviders.google(),
      weights: ['100 900'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      name: 'Roboto Mono',
      cssVariable: '--font-mono',
      provider: fontProviders.google(),
      weights: ['400', '500'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-monospace', 'monospace'],
    },
  ],
});
