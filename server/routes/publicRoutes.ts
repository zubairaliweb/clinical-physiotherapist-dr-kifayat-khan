import { Router, Request, Response } from 'express';
import { db } from '../db';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Health Check
router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Public Content
router.get('/content', (req: Request, res: Response) => {
  try {
    const content = db.getPublicContent();
    res.json(content);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load public content', details: err.message });
  }
});

// Contact Form Submission
router.post('/contact', (req: Request, res: Response) => {
  try {
    const { fullName, phoneNumber, email, subject, message } = req.body;

    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ error: 'Full name is required.' });
    }
    if (!phoneNumber || !phoneNumber.trim()) {
      return res.status(400).json({ error: 'Phone number is required.' });
    }
    if (!email || !email.trim() || !email.includes('@')) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message content is required.' });
    }

    const created = db.addContactMessage({
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      email: email.trim(),
      subject: (subject || 'General Clinical Inquiry').trim(),
      message: message.trim(),
    });

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been received. Dr. Kifayat Khan’s clinic will contact you promptly.',
      id: created.id,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to process inquiry', details: err.message });
  }
});

// Admin Authentication: Login
router.post('/auth/login', (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Email/Username and Password are required.' });
    }

    const result = db.authenticateUser(identifier, password);
    if (!result) {
      return res.status(401).json({ error: 'Invalid credentials. Please verify your username and password.' });
    }

    res.json({
      success: true,
      token: result.token,
      user: {
        id: result.user.id,
        username: result.user.username,
        email: result.user.email,
        role: result.user.role,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Authentication error', details: err.message });
  }
});

// Admin Authentication: Current User Status
router.get('/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    user: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

// Admin Authentication: Logout
router.post('/auth/logout', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    db.invalidateToken(token);
  }
  res.json({ success: true, message: 'Logged out successfully' });
});

export default router;
