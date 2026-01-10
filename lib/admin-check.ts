// lib/admin-check.ts
import { verifyToken } from './jwt';

export function isAdmin(authToken: string): boolean {
  try {
    const decoded = verifyToken(authToken);
    const allowedRoles = ['admin', 'superadmin'];
    return allowedRoles.includes(decoded.role);
  } catch {
    return false;
  }
}

export function isSuperAdmin(authToken: string): boolean {
  try {
    const decoded = verifyToken(authToken);
    return decoded.role === 'superadmin';
  } catch {
    return false;
  }
}

export function getUserRole(authToken: string): string | null {
  try {
    const decoded = verifyToken(authToken);
    return decoded.role || null;
  } catch {
    return null;
  }
}