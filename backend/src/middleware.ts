import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Types, User } from './models.js';

declare global { namespace Express { interface Request { userId?: Types.ObjectId; shopId?: Types.ObjectId } } }
export function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.session;
  if (!token) return res.status(401).json({ error: 'Please log in to continue.' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    User.findById(decoded.userId).then(user => { if (!user) return res.status(401).json({ error: 'Session expired.' }); req.userId = user._id; req.shopId = user.shop; next(); }).catch(next);
  } catch { return res.status(401).json({ error: 'Session expired.' }); }
}
export function fail(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err && typeof err === 'object' && 'status' in err) return res.status(Number((err as any).status) || 500).json({ error: (err as any).message || 'Something went wrong.' });
  if (err && typeof err === 'object' && 'name' in err && err.name === 'ZodError') return res.status(400).json({ error: 'Please check the information you entered.', details: (err as any).issues });
  if (err && typeof err === 'object' && 'code' in err && (err as any).code === 11000) return res.status(409).json({ error: 'That SKU or email is already in use.' });
  console.error(err); return res.status(500).json({ error: 'Something went wrong. Please try again.' });
}
