const { build } = require('vite');
const path = require('path');

async function buildOptimized() {
  try {
    console.log('🚀 Iniciando build otimizado...');
    
    await build({
      root: 'client',
      build: {
        outDir: '../dist/public',
        emptyOutDir: true,
        minify: 'terser',
        sourcemap: false,
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom'],
              ui: ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-tabs'],
              utils: ['date-fns', 'clsx', 'tailwind-merge']
            }
          }
        }
      },
      define: {
        'process.env.NODE_ENV': '"production"'
      }
    });
    
    console.log('✅ Build otimizado concluído!');
  } catch (error) {
    console.error('❌ Erro no build:', error);
    process.exit(1);
  }
}

buildOptimized();