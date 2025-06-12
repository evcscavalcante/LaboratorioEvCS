#!/bin/bash
set -e

echo "Iniciando build da aplicação React..."

# Limpar diretório de build
rm -rf dist/public/*
mkdir -p dist/public/assets

# Copiar assets estáticos
cp -r client/public/* dist/public/ 2>/dev/null || true

# Build com timeout reduzido
timeout 60 npx vite build --outDir dist/public --emptyOutDir || {
    echo "Build com Vite falhou, tentando esbuild direto..."
    
    # Fallback: build direto com esbuild
    npx esbuild client/src/main.tsx \
        --bundle \
        --outfile=dist/public/assets/main.js \
        --format=esm \
        --target=es2020 \
        --minify \
        --jsx=automatic \
        --loader:.tsx=tsx \
        --loader:.ts=ts \
        --loader:.css=css \
        --alias:@=./client/src \
        --alias:@shared=./shared \
        --define:process.env.NODE_ENV='"production"' \
        --define:import.meta.env.VITE_FIREBASE_API_KEY='"process_from_env"' \
        --define:import.meta.env.VITE_FIREBASE_PROJECT_ID='"laboratorio-evcs"' \
        --define:import.meta.env.VITE_FIREBASE_APP_ID='"1:123456789:web:abcdef123456"'
    
    # CSS separado
    npx esbuild client/src/index.css \
        --outfile=dist/public/assets/main.css \
        --minify
    
    # HTML otimizado
    cat > dist/public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laboratório Ev.C.S - Sistema Geotécnico</title>
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="/assets/main.css">
    <script type="module">
        // Firebase configuração global
        window.firebaseConfig = {
            apiKey: "AIzaSyBmyJtUkJ9-W_k6VYSI5bC1B1iVpzjJBhs",
            authDomain: "laboratorio-evcs.firebaseapp.com",
            projectId: "laboratorio-evcs",
            storageBucket: "laboratorio-evcs.firebasestorage.app",
            appId: "1:123456789:web:abcdef123456"
        };
    </script>
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/assets/main.js"></script>
</body>
</html>
EOF
}

echo "Build concluído!"
ls -la dist/public/