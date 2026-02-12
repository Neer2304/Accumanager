// middleware/auth.ts
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import UserCompany from '../models/UserCompany';

export interface AuthenticatedRequest extends NextApiRequest {
  user?: any;
  companyId?: string;
  userCompany?: any;
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: NextApiResponse,
  next: () => void
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Account is deactivated' });
    }

    // Get user's default company
    const userCompany = await UserCompany.findOne({
      userId: user._id,
      isDefault: true,
      status: 'active'
    }).populate('companyId');

    if (!userCompany) {
      return res.status(403).json({ error: 'No active company found' });
    }

    req.user = user;
    req.companyId = userCompany.companyId._id.toString();
    req.userCompany = userCompany;

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: NextApiResponse, next: () => void) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role) && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

export const requireCompany = (
  req: AuthenticatedRequest,
  res: NextApiResponse,
  next: () => void
) => {
  if (!req.companyId) {
    return res.status(403).json({ error: 'Company context required' });
  }
  next();
};