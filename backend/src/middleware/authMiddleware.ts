import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import 'dotenv/config';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;
  const secret = process.env.JWT_SECRET!;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, secret) as { id: string };

      req.user = { id: decoded.id };

      next(); // El token vale

    } catch (error) {
      console.error(error);
      return res.status(401).json({ msg: 'Error, token inválido' });
    }
  }

  if (!token) {
    return res.status(401).json({ msg: 'Error, no se encuentra el token' });
  }
};