import type { Request, Response, NextFunction } from 'express';

// Recursively sanitize object
const sanitizeObject = (obj: any): any => {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const sanitized: any = {};

  for (const key in obj) {
    // Replace dangerous MongoDB operators
    const cleanKey = key.replace(/\$/g, '_').replace(/\./g, '_');

    sanitized[cleanKey] = sanitizeObject(obj[key]);
  }

  return sanitized;
};

// NoSQL injection protection
export const sanitizeData = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  if (req.params) {
    req.params = sanitizeObject(req.params);
  }

  // Express 5 safe
  if (req.query) {
    Object.assign(req.query, sanitizeObject(req.query));
  }

  next();
};

export const addSecurityHeaders = (
  _req: Request,
  res: Response,
  next: NextFunction,
): void => {
  res.removeHeader('X-Powered-By');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  next();
};

export const preventParamPollution = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const whitelist = ['sort', 'fields', 'page', 'limit', 'filter'];

  const sanitizedQuery: Record<string, any> = {};

  for (const key in req.query) {
    const value = req.query[key];

    if (!whitelist.includes(key) && Array.isArray(value)) {
      sanitizedQuery[key] = value[0];
    } else {
      sanitizedQuery[key] = value;
    }
  }

  Object.assign(req.query, sanitizedQuery);

  next();
};
