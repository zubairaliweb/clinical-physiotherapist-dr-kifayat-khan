import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';

interface AuthenticatedRequest extends Request {
  user?: any;
}

const DEFAULT_PORT = 3000;
const PORT = Number(process.env.PORT) || DEFAULT_PORT;

// Ensure public upload directory
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

async function startServer() {
  const app = express();

  // Middlewares
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // Static uploads directory
  app.use('/uploads', express.static(UPLOAD_DIR));

  // Authentication Middleware for Protected Routes
  const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized. Admin authentication required.' });
    }

    const token = authHeader.split(' ')[1];
    const user = db.getUserByToken(token);
    if (!user) {
      return res.status(401).json({ error: 'Session expired or invalid token. Please log in again.' });
    }

    req.user = user;
    next();
  };

  // ==========================================
  // PUBLIC API ROUTES
  // ==========================================

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Public Content
  app.get('/api/content', (req: Request, res: Response) => {
    try {
      const content = db.getPublicContent();
      res.json(content);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to load public content', details: err.message });
    }
  });

  // Contact Form Submission
  app.post('/api/contact', (req: Request, res: Response) => {
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

  // Admin Auth Login
  app.post('/api/auth/login', (req: Request, res: Response) => {
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

  // Admin Auth Me
  app.get('/api/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    res.json({
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
      },
    });
  });

  // Admin Auth Logout
  app.post('/api/auth/logout', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      db.invalidateToken(token);
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });

  // Admin Change Password
  app.post('/api/auth/change-password', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { newPassword } = req.body;
      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters.' });
      }
      db.updatePassword(req.user.id, newPassword);
      res.json({ success: true, message: 'Password updated successfully.' });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update password', details: err.message });
    }
  });

  // ==========================================
  // PROTECTED ADMIN API ROUTES
  // ==========================================

  // Overview Stats
  app.get('/api/admin/overview', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    res.json(db.getOverviewStats());
  });

  // CUSTOMER RECORDS: Search, List, Pagination
  app.get('/api/admin/customers', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const query = (req.query.search as string) || '';
      const status = (req.query.status as string) || '';
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = db.searchCustomers(query, status, page, limit);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch customer records', details: err.message });
    }
  });

  // View Customer by ID
  app.get('/api/admin/customers/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const customer = db.getCustomerById(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer record not found.' });
    }
    res.json(customer);
  });

  // Add Customer
  app.post('/api/admin/customers', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { fullName, phoneNumber, email, address, date, status, notes, additionalInfo } = req.body;

      if (!fullName || !fullName.trim()) {
        return res.status(400).json({ error: 'Customer full name is required.' });
      }
      if (!phoneNumber || !phoneNumber.trim()) {
        return res.status(400).json({ error: 'Phone number is required.' });
      }

      const newCustomer = db.addCustomer({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: (email || '').trim(),
        address: (address || '').trim(),
        date: date || new Date().toISOString().split('T')[0],
        status: status || 'Active',
        notes: (notes || '').trim(),
        additionalInfo: (additionalInfo || '').trim(),
      });

      res.status(201).json({ success: true, customer: newCustomer });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to create customer record', details: err.message });
    }
  });

  // Update Customer
  app.put('/api/admin/customers/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const updated = db.updateCustomer(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Customer record not found.' });
      }
      res.json({ success: true, customer: updated });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update customer record', details: err.message });
    }
  });

  // Delete Customer
  app.delete('/api/admin/customers/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const success = db.deleteCustomer(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Customer record not found or already deleted.' });
    }
    res.json({ success: true, message: 'Customer record removed permanently.' });
  });

  // VIDEOS MANAGEMENT
  app.get('/api/admin/videos', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    res.json(db.getVideos(true));
  });

  app.post('/api/admin/videos', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { title, description, thumbnail, videoUrl, category, date, isPublished } = req.body;
      if (!title || !videoUrl) {
        return res.status(400).json({ error: 'Video title and URL are required.' });
      }
      const vid = db.addVideo({
        title: title.trim(),
        description: (description || '').trim(),
        thumbnail: thumbnail || '/images/physio_clinic.jpg',
        videoUrl: videoUrl.trim(),
        category: category || 'Physical Therapy',
        date: date || new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
        isPublished: isPublished !== undefined ? isPublished : true,
      });
      res.status(201).json({ success: true, video: vid });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to add video', details: err.message });
    }
  });

  app.put('/api/admin/videos/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const updated = db.updateVideo(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Video not found.' });
    res.json({ success: true, video: updated });
  });

  app.delete('/api/admin/videos/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const success = db.deleteVideo(req.params.id);
    if (!success) return res.status(404).json({ error: 'Video not found.' });
    res.json({ success: true, message: 'Video deleted.' });
  });

  // PRODUCTS / SERVICES MANAGEMENT
  app.get('/api/admin/products', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    res.json(db.getProducts());
  });

  app.post('/api/admin/products', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const {
        title,
        description,
        image,
        price,
        category,
        status,
        contactButton,
        itemType,
        sku,
        stockQuantity,
        featured,
      } = req.body;
      if (!title) return res.status(400).json({ error: 'Product/Service title is required.' });
      const prod = db.addProduct({
        title: title.trim(),
        description: (description || '').trim(),
        image: image || '/images/physio_clinic.jpg',
        price: price || '',
        category: category || 'Physical Therapy',
        status: status || 'In Stock',
        contactButton: contactButton !== undefined ? contactButton : true,
        itemType: itemType || 'physical',
        sku: sku ? String(sku).trim() : undefined,
        stockQuantity: stockQuantity !== undefined ? Number(stockQuantity) : 0,
        featured: featured !== undefined ? Boolean(featured) : false,
      });
      res.status(201).json({ success: true, product: prod });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to add product/service', details: err.message });
    }
  });

  app.put('/api/admin/products/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Product not found.' });
    res.json({ success: true, product: updated });
  });

  app.delete('/api/admin/products/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const success = db.deleteProduct(req.params.id);
    if (!success) return res.status(404).json({ error: 'Product not found.' });
    res.json({ success: true, message: 'Product deleted.' });
  });

  // GALLERY MANAGEMENT
  app.get('/api/admin/gallery', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    res.json(db.getGallery(true));
  });

  app.post('/api/admin/gallery', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { title, description, imageUrl, isPublished } = req.body;
      if (!imageUrl) return res.status(400).json({ error: 'Image URL or upload is required.' });
      const item = db.addGalleryItem({
        title: (title || 'Clinical Photo').trim(),
        description: (description || '').trim(),
        imageUrl: imageUrl.trim(),
        isPublished: isPublished !== undefined ? isPublished : true,
      });
      res.status(201).json({ success: true, item });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to add gallery item', details: err.message });
    }
  });

  app.put('/api/admin/gallery/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const updated = db.updateGalleryItem(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Gallery item not found.' });
    res.json({ success: true, item: updated });
  });

  app.delete('/api/admin/gallery/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const success = db.deleteGalleryItem(req.params.id);
    if (!success) return res.status(404).json({ error: 'Gallery item not found.' });
    res.json({ success: true, message: 'Gallery item deleted.' });
  });

  // CONTACT MESSAGES MANAGEMENT
  app.get('/api/admin/messages', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    res.json(db.getContactMessages());
  });

  app.put('/api/admin/messages/:id/read', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const ok = db.markMessageRead(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Message not found.' });
    res.json({ success: true });
  });

  app.delete('/api/admin/messages/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const ok = db.deleteContactMessage(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Message not found.' });
    res.json({ success: true, message: 'Message removed.' });
  });

  // SETTINGS & METADATA MANAGEMENT
  app.get('/api/admin/settings', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    res.json(db.getData().settings);
  });

  app.put('/api/admin/settings', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    db.updateSettings(req.body);
    res.json({ success: true, settings: db.getData().settings });
  });

  // EDUCATION & EXPERIENCE MANAGEMENT
  app.put('/api/admin/education', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    if (Array.isArray(req.body)) {
      db.updateEducation(req.body);
      res.json({ success: true, education: db.getData().education });
    } else {
      res.status(400).json({ error: 'Education must be an array of records.' });
    }
  });

  app.put('/api/admin/experience', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    if (Array.isArray(req.body)) {
      db.updateExperience(req.body);
      res.json({ success: true, experience: db.getData().experience });
    } else {
      res.status(400).json({ error: 'Experience must be an array of records.' });
    }
  });

  // SOCIAL LINKS MANAGEMENT
  app.put('/api/admin/social', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    db.updateSocialLinks(req.body);
    res.json({ success: true, socialLinks: db.getData().socialLinks });
  });

  // FILE UPLOAD (Base64 handler)
  app.post('/api/admin/upload', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { base64Data, filename } = req.body;
      if (!base64Data) {
        return res.status(400).json({ error: 'Base64 data required' });
      }

      // Check mime type
      const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ error: 'Invalid base64 image data' });
      }

      const mimeType = matches[1];
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!validTypes.includes(mimeType)) {
        return res.status(400).json({ error: 'Only JPG, PNG, WEBP, and GIF images are allowed' });
      }

      const extension = mimeType.split('/')[1] === 'jpeg' ? 'jpg' : mimeType.split('/')[1];
      const safeName = `upload_${Date.now()}_${crypto.randomBytes(4).toString('hex')}.${extension}`;
      const filePath = path.join(UPLOAD_DIR, safeName);

      fs.writeFileSync(filePath, Buffer.from(matches[2], 'base64'));

      res.json({
        success: true,
        url: `/uploads/${safeName}`,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Upload failed', details: err.message });
    }
  });

  // ==========================================
  // VITE DEV SERVER OR STATIC PRODUCTION
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Dr. Kifayat Khan Physiotherapist portal running on http://0.0.0.0:${PORT}`);
  });
}

if (process.env.VERCEL) {
  // Vercel uses the runtime-provided PORT value and doesn't need a random local port search.
  startServer();
} else {
  startServer();
}
