import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { db } from './database';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';
import type { SignupRequest, LoginRequest, User } from '@shared/schema';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function createUser(userData: SignupRequest): Promise<User> {
  // Check if user already exists
  const existingUser = await db.select().from(users).where(eq(users.email, userData.email));
  if (existingUser.length > 0) {
    throw new Error('User with this email already exists');
  }

  const existingUsername = await db.select().from(users).where(eq(users.username, userData.username));
  if (existingUsername.length > 0) {
    throw new Error('Username already taken');
  }

  // Hash password
  const passwordHash = await bcrypt.hash(userData.password, 10);

  // Create user
  const newUser = {
    id: randomUUID(),
    email: userData.email,
    name: userData.name,
    username: userData.username,
    passwordHash,
  };

  const [user] = await db.insert(users).values(newUser).returning();
  return user;
}

export async function authenticateUser(loginData: LoginRequest): Promise<{ user: User; token: string }> {
  // Find user by email
  const [user] = await db.select().from(users).where(eq(users.email, loginData.email));
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(loginData.password, user.passwordHash);
  if (!isValidPassword) {
    throw new Error('Invalid email or password');
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { user, token };
}

export async function verifyToken(token: string): Promise<User | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    const [user] = await db.select().from(users).where(eq(users.id, decoded.userId));
    return user || null;
  } catch (error) {
    return null;
  }
}


