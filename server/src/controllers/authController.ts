import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { Request, Response } from 'express';
import type { Types } from 'mongoose';
import User from '../models/User.js';
import { JWT_SECRET } from '../config/env.js';

const generateToken = (userId: Types.ObjectId): string => {
  return jwt.sign({ userId: userId.toString() }, JWT_SECRET, {
    expiresIn: '7d',
  });
};

interface RegisterBody {
  username?: string;
  email?: string;
  password?: string;
}

interface LoginBody {
  email?: string;
  password?: string;
}

// POST /api/auth/register
export const register = async (
  req: Request<unknown, unknown, RegisterBody>,
  res: Response
): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      res.status(409).json({ message: 'Username or email already taken' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, passwordHash });

    res.status(201).json({
      token: generateToken(user._id),
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/auth/login
export const login = async (
  req: Request<unknown, unknown, LoginBody>,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    res.json({
      token: generateToken(user._id),
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};
