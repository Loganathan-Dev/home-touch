import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { userRepository } from '../repositories/userRepository';
import { hashPassword, comparePassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { AppError } from '../utils/AppError';
import { pool } from '../config/db';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, phone, role } = req.body;

  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) throw new AppError('Email already in use', 409);

  const password_hash = await hashPassword(password);
  const user = await userRepository.create({ name, email, password_hash, phone, role: role || 'buyer' });

  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id);

  // Save refresh token to DB
  await pool.query(
    'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'7 days\')',
    [user.id, refreshToken]
  );

  res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.status(201).json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role }, accessToken });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await userRepository.findByEmail(email);
  if (!user || !(await comparePassword(password, user.password_hash))) {
    throw new AppError('Invalid email or password', 401);
  }

  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id);

  await pool.query(
    'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'7 days\')',
    [user.id, refreshToken]
  );

  res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role }, accessToken });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  if (refreshToken) {
    await pool.query('DELETE FROM refresh_tokens WHERE token_hash = $1', [refreshToken]);
  }
  res.clearCookie('refreshToken');
  res.json({ success: true, message: 'Logged out' });
});

export const profile = asyncHandler(async (req: Request, res: Response) => {
  const user = await userRepository.findById(req.user!.id);
  res.json({ success: true, user });
});