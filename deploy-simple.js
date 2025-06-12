import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Criar estrutura de build simples
const distDir = path.join(__dirname, 'dist', 'public');

// Limpar diretório
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Copiar index.html do client
const clientIndexPath = path.join(__dirname, 'client', 'index.html');
const distIndexPath = path.join(distDir, 'index.html');

if (fs.existsSync(clientIndexPath)) {
  let indexContent = fs.readFileSync(clientIndexPath, 'utf8');
  
  // Substituir imports para CDN
  indexContent = indexContent.replace(
    '<script type="module" src="/src/main.tsx"></script>',
    `<script type="module">
      import { createRoot } from 'https://esm.sh/react-dom@18/client';
      import React from 'https://esm.sh/react@18';
      
      // App simples para teste
      function App() {
        return React.createElement('div', {
          style: { padding: '20px', fontFamily: 'Arial, sans-serif' }
        }, [
          React.createElement('h1', { key: 'title' }, 'Laboratório Ev.C.S'),
          React.createElement('p', { key: 'desc' }, 'Sistema de Ensaios Geotécnicos'),
          React.createElement('div', { key: 'status' }, 'Deploy realizado com sucesso!')
        ]);
      }
      
      const root = createRoot(document.getElementById('root'));
      root.render(React.createElement(App));
    </script>`
  );
  
  fs.writeFileSync(distIndexPath, indexContent);
  console.log('✅ Arquivo index.html criado para deploy');
} else {
  console.error('❌ Arquivo client/index.html não encontrado');
}