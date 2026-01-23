import jwt from 'jsonwebtoken';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || "";
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

// --- FOR API ROUTES (Node.js Runtime) ---
export const generateToken = (payload: any) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

// Keep this for your standard API routes
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

// --- FOR MIDDLEWARE (Edge Runtime) ---
// Middleware MUST use this version because it doesn't support 'jsonwebtoken'
export const verifyTokenEdge = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, encodedSecret);
    return payload as any;
  } catch (error) {
    return null;
  }
};