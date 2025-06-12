#!/bin/bash

echo "Iniciando build e deploy..."

# Build do frontend usando vite diretamente
echo "Fazendo build do frontend..."
vite build --mode production

# Verificar se o diretório de build existe
if [ -d "dist/public" ] && [ -f "dist/public/index.html" ]; then
    echo "Build concluído com sucesso!"
    
    # Deploy para Firebase
    echo "Fazendo deploy para Firebase..."
    firebase deploy --only hosting --token=$FIREBASE_TOKEN --non-interactive
    
    if [ $? -eq 0 ]; then
        echo "Deploy concluído com sucesso!"
        echo "Seu site está disponível em: https://YOUR-PROJECT-ID.web.app"
    else
        echo "Erro no deploy!"
        exit 1
    fi
else
    echo "Erro no build - diretório não encontrado!"
    exit 1
fi