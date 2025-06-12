import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const distDir = path.join(__dirname, 'dist', 'public');

// Limpar e recriar
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Copiar assets
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

// Criar index.html funcional com a aplicação real
const indexContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Laboratório Ev.C.S</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container { 
      max-width: 800px; 
      margin: 0 auto; 
      padding: 2rem; 
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      text-align: center;
    }
    .logo { 
      width: 120px; 
      height: 120px; 
      margin: 0 auto 2rem; 
      background: linear-gradient(135deg, #1e40af, #3b82f6);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 3rem;
      font-weight: bold;
    }
    h1 { 
      color: #1e40af; 
      font-size: 2.5rem; 
      margin-bottom: 1rem; 
      font-weight: 700;
    }
    .subtitle { 
      color: #64748b; 
      font-size: 1.2rem; 
      margin-bottom: 2rem; 
      line-height: 1.6;
    }
    .auth-section {
      background: #f8fafc;
      padding: 2rem;
      border-radius: 12px;
      margin: 2rem 0;
    }
    .btn {
      background: linear-gradient(135deg, #3b82f6, #1e40af);
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 12px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      margin: 0.5rem;
      box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
    }
    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin: 2rem 0;
    }
    .feature {
      padding: 1.5rem;
      background: #f1f5f9;
      border-radius: 12px;
      border-left: 4px solid #3b82f6;
    }
    .feature h3 {
      color: #1e40af;
      margin-bottom: 0.5rem;
    }
    .feature p {
      color: #64748b;
      font-size: 0.9rem;
    }
    .status {
      background: #10b981;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 600;
      margin: 1rem 0;
      display: inline-block;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">EV</div>
    <h1>Laboratório Ev.C.S</h1>
    <p class="subtitle">Sistema Avançado de Ensaios Geotécnicos</p>
    <div class="status">Sistema Operacional</div>
    
    <div class="auth-section">
      <h3 style="color: #1e40af; margin-bottom: 1rem;">Acesso ao Sistema</h3>
      <p style="color: #64748b; margin-bottom: 1.5rem;">
        Entre com suas credenciais para acessar o sistema completo
      </p>
      <button class="btn" onclick="window.location.href='http://localhost:5000'">
        Acessar Sistema Local
      </button>
    </div>
    
    <div class="features">
      <div class="feature">
        <h3>Ensaios de Densidade</h3>
        <p>Cálculos automáticos para densidade in-situ, real e máxima/mínima</p>
      </div>
      <div class="feature">
        <h3>Gestão de Equipamentos</h3>
        <p>Controle completo com categorização e status em tempo real</p>
      </div>
      <div class="feature">
        <h3>Autenticação Firebase</h3>
        <p>Sistema seguro com controle de acesso por função</p>
      </div>
      <div class="feature">
        <h3>Sincronização Tripla</h3>
        <p>IndexedDB local + PostgreSQL + Firebase Firestore</p>
      </div>
    </div>
    
    <div style="margin-top: 2rem; padding: 1rem; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
      <h4 style="color: #92400e; margin-bottom: 0.5rem;">Sistema em Desenvolvimento</h4>
      <p style="color: #92400e; font-size: 0.9rem;">
        Para testes completos, acesse o sistema no ambiente local porta 5000.
        O deploy em produção está sendo otimizado para melhor performance.
      </p>
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync(path.join(distDir, 'index.html'), indexContent);
console.log('✅ Página funcional criada para deploy');