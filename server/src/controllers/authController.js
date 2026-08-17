import jwt from 'jsonwebtoken';

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 8 * 60 * 60 * 1000
  };
}

export function login(req, res) {
  const { username, password } = req.body ?? {};
  if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  const token = jwt.sign({ username, role: 'owner' }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.cookie('owner_token', token, cookieOptions());
  return res.json({ authenticated: true, username });
}

export function logout(_req, res) {
  res.clearCookie('owner_token');
  return res.json({ authenticated: false });
}

export function me(req, res) {
  return res.json({ authenticated: true, username: req.owner.username });
}
