import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => ({
  plugins: [
    react(),
    tailwindcss(),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
  define: {
    'process.env': {},
    global: 'globalThis',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      onwarn(warning, defaultHandler) {
        if (warning.code === 'SOURCEMAP_ERROR' || warning.message?.includes('points to missing source files')) {
          return;
        }
        defaultHandler(warning);
      },
      output: {},
    },
  },
  optimizeDeps: {
    include: [
      'buffer',
      '@solana/web3.js',
      '@solana/wallet-adapter-base',
      '@solana/wallet-adapter-react',
      '@solana/wallet-adapter-react-ui',
      '@solana/wallet-adapter-solflare',
      '@metaplex-foundation/umi',
      '@metaplex-foundation/umi-bundle-defaults',
      '@metaplex-foundation/umi-signer-wallet-adapters',
      '@metaplex-foundation/mpl-core',
      '@metaplex-foundation/mpl-toolbox',
      'lucide-react',
      'react',
      'react-dom',
    ],
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  server: {
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
}));
