#!/bin/bash

echo "🚀 Iniciando build e deploy..."

# Build do frontend
echo "📦 Fazendo build do frontend..."
npm run build:frontend

# Verificar se o build foi bem-sucedido
if [ $? -eq 0 ]; then
    echo "✅ Build concluído com sucesso!"
    
    # Deploy para Firebase
    echo "🔥 Fazendo deploy para Firebase..."
    firebase deploy --only hosting --token=$FIREBASE_TOKEN
    
    if [ $? -eq 0 ]; then
        echo "🎉 Deploy concluído com sucesso!"
    else
        echo "❌ Erro no deploy!"
        exit 1
    fi
else
    echo "❌ Erro no build!"
    exit 1
fi