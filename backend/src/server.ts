import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

const app = express();
app.use(cors({
  origin: ['http://localhost:4200', 'https://erp-imperio-do-gas.web.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.options('/*path', cors());

app.use(express.json());

// Middlewares globais
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(cors({
  origin: ['http://localhost:4200', 'https://erp-imperio-do-gas.web.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Rotas da API
app.use('/api', routes);

// Error handler (deve ser o último middleware)
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor operando na porta ${PORT}`);
});


