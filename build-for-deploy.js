const { build } = require('vite');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function buildForDeploy() {
  console.log('🚀 Iniciando build otimizado para deploy...');
  
  try {
    // Build apenas o necessário
    await build({
      root: 'client',
      build: {
        outDir: '../dist/public',
        emptyOutDir: true,
        rollupOptions: {
          external: ['lucide-react'],
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom'],
              firebase: ['firebase/app', 'firebase/auth'],
              ui: ['@radix-ui/react-dialog', '@radix-ui/react-select']
            }
          }
        }
      }
    });
    
    console.log('✅ Build da aplicação React concluído');
    
    // Verificar se os arquivos foram gerados
    const distPath = path.join(__dirname, 'dist/public');
    if (fs.existsSync(distPath)) {
      const files = fs.readdirSync(distPath);
      console.log('📁 Arquivos gerados:', files);
    }
    
  } catch (error) {
    console.error('❌ Erro no build:', error.message);
    process.exit(1);
  }
}

buildForDeploy();