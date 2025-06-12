import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Função para substituir imports @/ por caminhos relativos
function fixImports(filePath, srcDir) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Substituir @/ por caminhos relativos baseados na estrutura
  const relativePath = path.relative(path.dirname(filePath), srcDir);
  const prefix = relativePath ? `${relativePath}/` : './';
  
  content = content.replace(/@\//g, prefix);
  
  fs.writeFileSync(filePath, content);
}

// Função para processar recursivamente todos os arquivos
function processDirectory(dir, srcDir) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath, srcDir);
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      fixImports(fullPath, srcDir);
    }
  }
}

try {
  console.log('🔧 Preparando build otimizado...');
  
  // Fazer backup e corrigir imports
  const srcDir = path.join(__dirname, 'client/src');
  const tempDir = path.join(__dirname, 'client/src-backup');
  
  // Criar backup
  execSync(`cp -r ${srcDir} ${tempDir}`);
  
  console.log('📝 Corrigindo imports...');
  processDirectory(srcDir, srcDir);
  
  console.log('🏗️ Executando build...');
  
  // Build com timeout maior
  process.chdir('client');
  execSync('VITE_FIREBASE_API_KEY="AIzaSyBmyJtUkJ9-W_k6VYSI5bC1B1iVpzjJBhs" VITE_FIREBASE_PROJECT_ID="laboratorio-evcs" VITE_FIREBASE_APP_ID="1:123456789:web:abcdef123456" npx vite build --outDir ../dist/public --emptyOutDir', {
    stdio: 'inherit',
    timeout: 300000 // 5 minutos
  });
  
  process.chdir('..');
  
  console.log('🚀 Fazendo deploy...');
  execSync('firebase deploy --only hosting', { stdio: 'inherit' });
  
  console.log('✅ Deploy concluído com sucesso!');
  
  // Restaurar backup
  execSync(`rm -rf ${srcDir} && mv ${tempDir} ${srcDir}`);
  
} catch (error) {
  console.error('❌ Erro no processo:', error.message);
  
  // Restaurar backup em caso de erro
  const srcDir = path.join(__dirname, 'client/src');
  const tempDir = path.join(__dirname, 'client/src-backup');
  
  if (fs.existsSync(tempDir)) {
    execSync(`rm -rf ${srcDir} && mv ${tempDir} ${srcDir}`);
  }
  
  process.exit(1);
}