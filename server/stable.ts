import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import cors from "cors";
import { setupVite, serveStatic } from "./vite";
import { storage } from "./storage";

const app = express();
const server = createServer(app);

// Basic middleware
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static assets
app.use('/attached_assets', express.static('attached_assets'));

// Temporary density test route (no authentication)
app.post('/api/tests/density-in-situ/temp', async (req: Request, res: Response) => {
  try {
    const testData = {
      ...req.body,
      userId: 1,
      createdBy: 'system'
    };
    
    const savedTest = await storage.createDensityInSituTest(testData);
    res.json(savedTest);
  } catch (error) {
    console.error('Erro ao salvar ensaio:', error);
    res.status(500).json({ message: 'Falha ao salvar ensaio' });
  }
});

// Get density tests
app.get('/api/tests/density-in-situ', async (req: Request, res: Response) => {
  try {
    const tests = await storage.getDensityInSituTests();
    res.json(tests);
  } catch (error) {
    console.error('Erro ao buscar ensaios:', error);
    res.status(500).json({ message: 'Falha ao buscar ensaios' });
  }
});

// Error handling
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ message: "Internal server error" });
});

// Setup Vite for development
if (process.env.NODE_ENV !== "production") {
  setupVite(app, server);
} else {
  serveStatic(app);
}

const port = process.env.PORT || 5000;

// Improved server startup with error handling
server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${port} is already in use, trying alternative...`);
    setTimeout(() => {
      server.close();
      server.listen(port);
    }, 1000);
  } else {
    console.error('Server error:', err);
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`✅ Servidor estável iniciado na porta ${port}`);
  console.log(`🌐 Acesse: http://localhost:${port}`);
});