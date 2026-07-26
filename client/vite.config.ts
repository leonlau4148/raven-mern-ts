import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Vite config — the equivalent of your build settings.
// react() enables JSX and fast refresh; tailwindcss() compiles the
// utility classes straight from index.css (no PostCSS config needed in v4).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Must match the repo name — GitHub Pages serves the site from a
  // subpath, and assets 404 if this is wrong.
  base: '/raven-mern-ts/',
});
