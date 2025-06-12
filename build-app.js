import esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';

// Copiar assets públicos
const copyPublicAssets = () => {
  if (fs.existsSync('client/public')) {
    fs.cpSync('client/public', 'dist/public', { recursive: true });
  }
};

// Build da aplicação React
const buildApp = async () => {
  try {
    copyPublicAssets();
    
    await esbuild.build({
      entryPoints: ['client/src/main.tsx'],
      bundle: true,
      minify: true,
      sourcemap: false,
      target: 'es2020',
      format: 'esm',
      outfile: 'dist/public/assets/main.js',
      define: {
        'process.env.NODE_ENV': '"production"',
        'import.meta.env.VITE_FIREBASE_API_KEY': '"AIzaSyBmyJtUkJ9-W_k6VYSI5bC1B1iVpzjJBhs"',
        'import.meta.env.VITE_FIREBASE_PROJECT_ID': '"laboratorio-evcs"',
        'import.meta.env.VITE_FIREBASE_APP_ID': '"1:123456789:web:abcdef123456"'
      },
      loader: {
        '.tsx': 'tsx',
        '.ts': 'ts',
        '.jsx': 'jsx',
        '.js': 'js',
        '.css': 'css',
        '.svg': 'file',
        '.png': 'file',
        '.jpg': 'file',
        '.jpeg': 'file'
      },
      jsx: 'automatic',
      resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.css'],
      alias: {
        '@': path.resolve('./client/src'),
        '@shared': path.resolve('./shared'),
        '@assets': path.resolve('./attached_assets')
      },
      external: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
      plugins: [{
        name: 'css-bundle',
        setup(build) {
          build.onLoad({ filter: /\.css$/ }, async (args) => {
            const css = await fs.promises.readFile(args.path, 'utf8');
            return {
              contents: css,
              loader: 'css'
            };
          });
        }
      }]
    });
    
    // Criar index.html da aplicação React
    const indexHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laboratório Ev.C.S - Sistema Geotécnico</title>
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <style>
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        #root { min-height: 100vh; }
        .loading { display: flex; justify-content: center; align-items: center; height: 100vh; }
    </style>
    <script type="module">
        import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
        import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
        import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';
        
        const firebaseConfig = {
            apiKey: "AIzaSyBmyJtUkJ9-W_k6VYSI5bC1B1iVpzjJBhs",
            authDomain: "laboratorio-evcs.firebaseapp.com",
            projectId: "laboratorio-evcs",
            storageBucket: "laboratorio-evcs.firebasestorage.app",
            appId: "1:123456789:web:abcdef123456"
        };

        window.firebaseApp = initializeApp(firebaseConfig);
        window.firebaseAuth = getAuth();
        window.firebaseDb = getFirestore();
    </script>
</head>
<body>
    <div id="root">
        <div class="loading">
            <div>Carregando Sistema Laboratório Ev.C.S...</div>
        </div>
    </div>
    <script type="module" src="/assets/main.js"></script>
</body>
</html>`;
    
    fs.writeFileSync('dist/public/index.html', indexHtml);
    
    console.log('✅ Build da aplicação React concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro no build:', error);
    process.exit(1);
  }
};

buildApp();