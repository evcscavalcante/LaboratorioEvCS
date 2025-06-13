const express = require('express');
const app = express();

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth endpoints for the geotechnical lab app
app.get('/api/auth/user', (req, res) => {
  res.json({
    id: 'admin',
    email: 'admin@lab.com',
    firstName: 'Administrator',
    lastName: 'User',
    role: 'ADMIN'
  });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    res.json({
      id: 'admin',
      email: 'admin@lab.com',
      firstName: 'Administrator',
      lastName: 'User',
      role: 'ADMIN'
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Laboratory test endpoints
app.get('/api/density-in-situ-tests', (req, res) => {
  res.json([]);
});

app.get('/api/real-density-tests', (req, res) => {
  res.json([]);
});

app.get('/api/max-min-density-tests', (req, res) => {
  res.json([]);
});

// Users endpoint for admin interface
app.get('/api/users', (req, res) => {
  res.json([
    {
      id: 'admin',
      email: 'admin@lab.com',
      firstName: 'Administrator',
      lastName: 'User',
      role: 'ADMIN'
    }
  ]);
});

const port = 5000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Geotechnical Laboratory Server running on port ${port}`);
});