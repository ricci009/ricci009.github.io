import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const site = process.env.SITE_URL?.trim() || undefined;

export default defineConfig({
  output: 'static',
  site,
  integrations: site ? [sitemap({ filter: (page) => !['/classic/', '/explore/'].includes(new URL(page).pathname) })] : [],
  devToolbar: { enabled: false },
  markdown: { shikiConfig: { theme: 'github-dark' } },
});
