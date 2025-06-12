import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Copiar todos os arquivos da aplicação React
const srcDir = path.join(__dirname, 'client', 'src');
const distDir = path.join(__dirname, 'dist', 'public');

// Limpar e recriar
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true });
}
fs.mkdirSync(distDir, { recursive: true });
fs.mkdirSync(path.join(distDir, 'src'), { recursive: true });

// Função para copiar diretório recursivamente
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const files = fs.readdirSync(src);
  files.forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

// Copiar todos os arquivos src
copyDir(srcDir, path.join(distDir, 'src'));

// Copiar assets públicos
const publicDir = path.join(__dirname, 'client', 'public');
if (fs.existsSync(publicDir)) {
  const files = fs.readdirSync(publicDir);
  files.forEach(file => {
    fs.copyFileSync(
      path.join(publicDir, file),
      path.join(distDir, file)
    );
  });
}

// Copiar index.html e modificar para usar CDN
const indexPath = path.join(__dirname, 'client', 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Substituir o script module por uma versão com import maps
indexContent = indexContent.replace(
  '<script type="module" src="/src/main.tsx"></script>',
  `
  <script type="importmap">
  {
    "imports": {
      "react": "https://esm.sh/react@18",
      "react-dom/client": "https://esm.sh/react-dom@18/client",
      "wouter": "https://esm.sh/wouter@3",
      "@tanstack/react-query": "https://esm.sh/@tanstack/react-query@5",
      "firebase/app": "https://esm.sh/firebase@10/app",
      "firebase/auth": "https://esm.sh/firebase@10/auth",
      "lucide-react": "https://esm.sh/lucide-react@0.400.0"
    }
  }
  </script>
  <script type="module" src="/src/main.tsx"></script>
  `
);

fs.writeFileSync(path.join(distDir, 'index.html'), indexContent);

console.log('✅ Aplicação React completa copiada para deploy');
console.log('📁 Estrutura completa preservada em dist/public/');