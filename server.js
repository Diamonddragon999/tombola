import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Development vs Production setup
const isDevelopment = process.env.NODE_ENV !== 'production';

if (isDevelopment) {
  // In development, proxy requests to Vite dev server
  app.use('/', createProxyMiddleware({
    target: 'http://localhost:5173',
    changeOrigin: true,
    ws: false, // Don't proxy websockets (we handle Socket.io separately)
  }));
} else {
  // In production, serve static files
  app.use(express.static(join(__dirname, 'dist')));
  
  // Fallback to index.html for SPA routing
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'));
  });
}

// Handle socket connections
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('request_spin', (data) => {
    console.log('Spin request from:', data.firstName);
    // Broadcast to all clients (including displays)
    io.emit('request_spin', data);
  });
  
  socket.on('spin_result', (data) => {
    console.log('Spin result:', data);
    // Broadcast result to all clients
    io.emit('spin_result', data);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});