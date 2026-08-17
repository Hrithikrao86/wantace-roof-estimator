import jwt from 'jsonwebtoken';

export function requireOwnerAuth(req, res, next) {
  const token = req.cookies?.owner_token;
  if (!token) return res.status(401).json({ error: 'Authentication required' });

  try {
    req.owner = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.clearCookie('owner_token');
    return res.status(401).json({ error: 'Session expired. Please log in again.' });
  }
}
