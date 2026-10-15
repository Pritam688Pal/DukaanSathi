import dotenv from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { api } from './routes.js';
import { fail } from './middleware.js';

// Load local backend settings first, then fall back to the project-root .env.
dotenv.config();
dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env') });

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) throw new Error('JWT_SECRET must be configured with at least 32 characters.');
const app = express();
app.use(helmet()); app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '1mb' })); app.use(cookieParser());
app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60_000, limit: 30, standardHeaders: true, legacyHeaders: false }));
app.use('/api', (req, res, next) => {
  const origin = req.get('origin');
  if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method) && origin && origin !== (process.env.CLIENT_ORIGIN || 'http://localhost:5173')) return res.status(403).json({ error: 'Request origin is not allowed.' });
  next();
});
app.use('/api', api); app.use(fail);
const port = Number(process.env.PORT || 4000);
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dukaansathi?replicaSet=rs0').then(() => app.listen(port, () => console.log(`DukaanSathi API listening on ${port}`))).catch(err => { console.error('Database connection failed', err); process.exit(1); });
export default app;
