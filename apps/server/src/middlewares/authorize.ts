import type { Response, NextFunction } from 'express';
import { Role } from '@/generated/prisma/client';
import type { AuthRequest } from '@/types/auth.types';

/**
 * Role hierarchy: SUPER_ADMIN > ADMIN > CLIENT
 *
 * Usage:
 *   router.get('/users',   authenticate, authorize('ADMIN'),       ...)
 *   router.post('/admins', authenticate, authorize('SUPER_ADMIN'), ...)
 */

const ROLE_RANK: Record<Role, number> = {
  CLIENT: 1,
  ADMIN: 2,
  SUPER_ADMIN: 3,
};

/**
 * authorize(minimumRole)
 * Allows the minimum role AND any role above it.
 * e.g. authorize('ADMIN') → ADMIN and SUPER_ADMIN can access
 */
export function authorize(...allowedRoles: Role[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const hasAccess = allowedRoles.some(
      (role) => ROLE_RANK[user.role] >= ROLE_RANK[role]
    );

    if (!hasAccess) {
      res.status(403).json({
        message: `Access denied. Required: ${allowedRoles.join(' or ')}`,
      });
      return;
    }

    next();
  };
}

/**
 * authorizeExact(...roles)
 * Only allows the exact roles specified — no rank escalation.
 * e.g. authorizeExact('SUPER_ADMIN') → only SUPER_ADMIN, not ADMIN
 */
export function authorizeExact(...roles: Role[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    if (!roles.includes(user.role)) {
      res.status(403).json({
        message: `Access denied. Required: ${roles.join(' or ')}`,
      });
      return;
    }

    next();
  };
}

// ─── Named shortcuts ──────────────────────────────────────────────────────────

/**
 * authorizeAdmin
 * Allows ADMIN and SUPER_ADMIN (rank-based: anyone >= ADMIN).
 *
 * Usage:
 *   router.get('/users', authenticate, authorizeAdmin, controller.listUsers)
 */
export const authorizeAdmin = authorize('ADMIN');

/**
 * authorizeSuperAdmin
 * Allows SUPER_ADMIN only — strictly no one else.
 *
 * Usage:
 *   router.post('/admin/create', authenticate, authorizeSuperAdmin, controller.createAdmin)
 */
export const authorizeSuperAdmin = authorizeExact('SUPER_ADMIN');
