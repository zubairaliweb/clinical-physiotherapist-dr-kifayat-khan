import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface CustomerRecord {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  date: string;
  status: 'Active' | 'Under Treatment' | 'Discharged' | 'Follow-up' | 'Inquiry';
  notes: string;
  additionalInfo: string;
  createdAt: string;
  updatedAt: string;
}

export interface VideoRecord {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  category: string;
  date?: string;
  isPublished: boolean;
  createdAt: string;
}

export interface ProductRecord {
  id: string;
  title: string;
  description: string;
  image: string;
  price?: string;
  category: string;
  status: 'In Stock' | 'Available on Request' | 'Active' | 'Out of Stock';
  contactButton: boolean;
  itemType?: 'physical' | 'service';
  sku?: string;
  stockQuantity?: number;
  featured?: boolean;
  createdAt: string;
}

export interface GalleryRecord {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  isPublished: boolean;
  createdAt: string;
}

export interface EducationRecord {
  id: string;
  institution: string;
  degree: string;
  field: string;
  duration: string;
  grade?: string;
  activities?: string;
}

export interface ExperienceRecord {
  id: string;
  title: string;
  employmentType: string;
  locations: string[];
  notes?: string;
}

export interface SocialLinksRecord {
  facebook: string;
  tiktok: string;
  linkedin: string;
}

export interface ContactMessageRecord {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  isRead: boolean;
}

export interface WebsiteSettingsRecord {
  doctorName: string;
  primaryTitle: string;
  secondaryTitles: string;
  experienceYears: string;
  phone: string;
  whatsapp: string;
  clinicAddress: string;
  clinicFloorRoom: string;
  cityCountry: string;
  heroStatement: string;
  professionalStatement: string;
  profileImage: string;
  clinicImage: string;
  googleMapsEmbedUrl: string;
  googleMapsDirectionsUrl: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: 'owner' | 'staff';
}

export interface DatabaseSchema {
  users: AdminUser[];
  sessions: { token: string; userId: string; expiresAt: number }[];
  customers: CustomerRecord[];
  videos: VideoRecord[];
  products: ProductRecord[];
  gallery: GalleryRecord[];
  education: EducationRecord[];
  experience: ExperienceRecord[];
  socialLinks: SocialLinksRecord;
  contactMessages: ContactMessageRecord[];
  settings: WebsiteSettingsRecord;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

function getInitialDatabase(): DatabaseSchema {
  const defaultSalt = crypto.randomBytes(16).toString('hex');
  const defaultPasswordHash = hashPassword('admin123', defaultSalt);

  return {
    users: [
      {
        id: 'admin-1',
        username: 'drkifayat',
        email: 'admin@drkifayat.com',
        passwordHash: defaultPasswordHash,
        salt: defaultSalt,
        role: 'owner',
      },
    ],
    sessions: [],
    customers: [
      {
        id: 'cust-101',
        fullName: 'Muhammad Ali',
        phoneNumber: '03138161676',
        email: 'ali.rehab@example.com',
        address: 'Sector F-7/2, Islamabad',
        date: '2026-09-18',
        status: 'Under Treatment',
        notes: 'Post-ACL reconstruction physical therapy, Week 6 progress. Good knee extension, focus on quadriceps activation and gait re-education.',
        additionalInfo: 'Referred by Orthopedic Specialist. Attends Monday/Thursday sessions.',
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
      {
        id: 'cust-102',
        fullName: 'Zubair Ahmed',
        phoneNumber: '03005541298',
        email: 'zubair.ahmed@example.com',
        address: 'Blue Area, Islamabad',
        date: '2026-09-15',
        status: 'Active',
        notes: 'Rotator cuff impingement following cricket bowling. Prescribed scapular stabilization exercises and eccentric strengthening.',
        additionalInfo: 'Sports physical therapy protocol stage 2.',
        createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
      },
      {
        id: 'cust-103',
        fullName: 'Fatima Noor',
        phoneNumber: '03335129481',
        email: 'fatima.noor@example.com',
        address: 'Sector G-9/1, Islamabad',
        date: '2026-09-10',
        status: 'Follow-up',
        notes: 'Postural cervical strain with thoracic stiffness from prolonged desk work. Ergonomic adjustments and cervical retraction exercise plan.',
        additionalInfo: 'Scheduled for bi-weekly posture check.',
        createdAt: new Date(Date.now() - 11 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 11 * 86400000).toISOString(),
      },
      {
        id: 'cust-104',
        fullName: 'Hamza Tariq',
        phoneNumber: '03459871234',
        email: 'hamza.tariq@example.com',
        address: 'Mall of Islamabad Executive Suites, Islamabad',
        date: '2026-09-02',
        status: 'Discharged',
        notes: 'Ankle inversion sprain grade II. Completed 8-week mobility and neuromuscular proprioception rehab. Full functional return achieved.',
        additionalInfo: 'Discharge summary issued with home maintenance routine.',
        createdAt: new Date(Date.now() - 19 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 19 * 86400000).toISOString(),
      },
    ],
    videos: [
      {
        id: 'vid-1',
        title: 'ACL Rehabilitation & Knee Stability Mobility Drills',
        description: 'Evidence-based clinical movement drills designed to restore neuromuscular control, quadriceps symmetry, and safe knee joint loading.',
        thumbnail: '/images/sports_rehab.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        category: 'Sports Physical Therapy',
        date: 'September 2026',
        isPublished: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'vid-2',
        title: 'Cervical Spine Mobility & Posture Correction at Desk',
        description: 'Step-by-step physical therapy routine targeting upper trapezius tension, deep neck flexor activation, and ergonomic posture alignment.',
        thumbnail: '/images/spine_posture.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        category: 'Spine & Posture',
        date: 'August 2026',
        isPublished: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'vid-3',
        title: 'Rotator Cuff Strengthening & Functional Shoulder Movement',
        description: 'Clinical physiotherapy exercises utilizing controlled resistance band techniques for shoulder joint stability and impingement relief.',
        thumbnail: '/images/physio_clinic.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        category: 'Rehabilitation & Mobility',
        date: 'July 2026',
        isPublished: true,
        createdAt: new Date().toISOString(),
      },
    ],
    products: [
      {
        id: 'prod-1',
        title: 'Clinical Physiotherapy Comprehensive Assessment',
        description: 'In-depth physical therapy evaluation including range of motion, muscle strength testing, joint mobility, posture screening, and a tailored recovery plan.',
        image: '/images/physio_clinic.jpg',
        price: 'Consultation Fee on Inquiry',
        category: 'Clinical Assessment',
        status: 'Active',
        contactButton: true,
        itemType: 'service',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'prod-2',
        title: 'Sports Physical Therapy & Injury Rehabilitation',
        description: 'Specialized therapy for athletes and active individuals focusing on ligament rehab, tendon recovery, return-to-sport protocols, and athletic conditioning.',
        image: '/images/sports_rehab.jpg',
        price: 'Personalized Program',
        category: 'Sports Rehabilitation',
        status: 'Active',
        contactButton: true,
        itemType: 'service',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'prod-3',
        title: 'Spine & Postural Alignment Therapy',
        description: 'Targeted clinical physical therapy for neck strain, lower back stiffness, disc decompression mobility, and chronic postural correction.',
        image: '/images/spine_posture.jpg',
        price: 'Per Session Plan',
        category: 'Spine & Posture',
        status: 'Active',
        contactButton: true,
        itemType: 'service',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'prod-4',
        title: 'Ergonomic Lumbar Support & Posture Cushion',
        description: 'High-density memory foam contoured lumbar cushion designed to maintain natural lordotic curvature during extended seating and driving.',
        image: '/images/physio_clinic.jpg',
        price: 'PKR 3,500',
        category: 'Ergonomic Support',
        status: 'In Stock',
        contactButton: true,
        itemType: 'physical',
        sku: 'LUM-CUSH-01',
        stockQuantity: 15,
        featured: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'prod-5',
        title: 'Physiotherapy Stress Ball & Hand Grip Strengthener Set',
        description: 'Medical-grade ergonomic therapeutic stress relief balls (soft, medium, firm resistance) for carpal tunnel, arthritis hand therapy, and neuromuscular grip strengthening.',
        image: '/images/stress_ball.jpg',
        price: 'PKR 1,800',
        category: 'Rehabilitation Equipment',
        status: 'In Stock',
        contactButton: true,
        itemType: 'physical',
        sku: 'STR-BALL-02',
        stockQuantity: 28,
        featured: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'prod-6',
        title: 'Clinical Resistance Loop Bands & Exercise Tubes',
        description: 'Multi-level progressive resistance elastic loop bands for rotator cuff conditioning, glute activation, lower-limb stability, and home rehabilitation routines.',
        image: '/images/rehab_bands.jpg',
        price: 'PKR 2,400',
        category: 'Rehabilitation Equipment',
        status: 'In Stock',
        contactButton: true,
        itemType: 'physical',
        sku: 'RES-BAND-03',
        stockQuantity: 35,
        featured: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'prod-7',
        title: 'High-Density Foam Roller & Myofascial Trigger Ball',
        description: 'Targeted deep-tissue self-myofascial release roller with spiky trigger point ball for spinal mobility, IT band decompression, and sports muscular recovery.',
        image: '/images/foam_roller.jpg',
        price: 'PKR 3,200',
        category: 'Recovery & Mobility',
        status: 'In Stock',
        contactButton: true,
        itemType: 'physical',
        sku: 'FOAM-ROLL-04',
        stockQuantity: 12,
        featured: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'prod-8',
        title: 'Reusable Hot & Cold Gel Compression Pack',
        description: 'Contoured therapeutic dual-temperature ice/heat wrap with adjustable Velcro strapping for acute joint swelling, muscular spasm, and post-exercise inflammation.',
        image: '/images/hot_cold_pack.jpg',
        price: 'PKR 2,100',
        category: 'Pain Relief & Recovery',
        status: 'In Stock',
        contactButton: true,
        itemType: 'physical',
        sku: 'HOT-COLD-05',
        stockQuantity: 20,
        featured: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'prod-9',
        title: 'Clinical Kinesiology Athletic Recovery Tape',
        description: 'Elastic therapeutic neuromuscular tape providing dynamic joint stabilization, lymphatic drainage facilitation, and soft-tissue pain alleviation for athletes.',
        image: '/images/kinesiology_tape.jpg',
        price: 'PKR 1,500',
        category: 'Rehabilitation Equipment',
        status: 'In Stock',
        contactButton: true,
        itemType: 'physical',
        sku: 'KIN-TAPE-06',
        stockQuantity: 42,
        featured: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'prod-10',
        title: 'Non-Slip Rehabilitation Wobble & Balance Board',
        description: 'Heavy-duty 360-degree rotational wooden balance trainer for ankle proprioception, knee rehabilitation, core stabilization, and vestibular therapy.',
        image: '/images/balance_wobble_board.jpg',
        price: 'PKR 4,800',
        category: 'Rehabilitation Equipment',
        status: 'In Stock',
        contactButton: true,
        itemType: 'physical',
        sku: 'BAL-BORD-07',
        stockQuantity: 8,
        featured: true,
        createdAt: new Date().toISOString(),
      },
    ],
    gallery: [
      {
        id: 'gal-1',
        title: 'Dr. Kifayat Khan – Clinical Practice',
        description: 'Providing dedicated clinical physiotherapy and sports physical therapy consultations in Islamabad.',
        imageUrl: '/images/dr_kifayat_khan.jpg',
        isPublished: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'gal-2',
        title: 'Mall of Islamabad Clinical Suite',
        description: 'Modern, fully equipped physiotherapy and rehabilitation suite located at Room #607, 6th Floor, Mall of Islamabad.',
        imageUrl: '/images/physio_clinic.jpg',
        isPublished: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'gal-3',
        title: 'Sports Injury & Mobility Rehabilitation',
        description: 'Functional movement screening, joint mobilization, and guided resistance exercise programs.',
        imageUrl: '/images/sports_rehab.jpg',
        isPublished: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'gal-4',
        title: 'Spine Assessment & Anatomical Review',
        description: 'Comprehensive spinal analysis, postural re-alignment, and patient education on biomechanics.',
        imageUrl: '/images/spine_posture.jpg',
        isPublished: true,
        createdAt: new Date().toISOString(),
      },
    ],
    education: [
      {
        id: 'edu-1',
        institution: 'Khyber Medical University',
        degree: 'Doctor of Physical Therapy (DPT)',
        field: 'Physiotherapy',
        duration: 'October 2014 – May 2020',
        grade: 'B',
        activities: 'Sportsman',
      },
      {
        id: 'edu-2',
        institution: 'PEF University College Peshawar',
        degree: 'FSc',
        field: 'Pre-Medicine / Pre-Medical Studies',
        duration: '2012 – 2014',
      },
    ],
    experience: [
      {
        id: 'exp-1',
        title: 'Clinical Physiotherapist',
        employmentType: 'Full-time / Part-time / Contract',
        locations: [
          'Islamabad, Pakistan',
          'Dubai, United Arab Emirates',
          'Riyadh, Saudi Arabia',
          'Saudi Arabia',
        ],
        notes: 'Providing clinical musculoskeletal assessment, manual therapy, and patient-centered rehabilitation.',
      },
      {
        id: 'exp-2',
        title: 'Sports Physical Therapist',
        employmentType: 'Full-time / Contract',
        locations: ['Islamabad, Pakistan', 'Dubai, United Arab Emirates', 'Saudi Arabia'],
        notes: 'Sports injury management, athletic mobility, neuromuscular retraining, and return-to-sport programs.',
      },
      {
        id: 'exp-3',
        title: 'Head of Department',
        employmentType: 'Full-time',
        locations: ['Islamabad, Pakistan'],
        notes: 'Leading clinical physiotherapy operations, patient protocols, quality standards, and staff coordination.',
      },
      {
        id: 'exp-4',
        title: 'Physiotherapist',
        employmentType: 'Full-time / Part-time',
        locations: ['Islamabad, Pakistan', 'Riyadh, Saudi Arabia'],
        notes: 'Comprehensive physical therapy care, active movement rehabilitation, and physical well-being.',
      },
    ],
    socialLinks: {
      facebook: 'https://www.facebook.com/share/1QHUMWEYrL/',
      tiktok: 'https://www.tiktok.com/@drkaifpt',
      linkedin: 'https://www.linkedin.com/in/dr-kifayat-khan-670672156/',
    },
    contactMessages: [
      {
        id: 'msg-1',
        fullName: 'Usman Farooq',
        phoneNumber: '03018765432',
        email: 'usman.f@example.com',
        subject: 'Appointment Inquiry for Sports Knee Injury',
        message: 'Hello Dr. Kifayat, I sustained a knee injury during soccer last weekend. I would like to schedule a clinical consultation at your Mall of Islamabad clinic this week.',
        date: '2026-09-19',
        isRead: false,
      },
    ],
    settings: {
      doctorName: 'Dr. Kifayat Khan',
      primaryTitle: 'Clinical Physiotherapist',
      secondaryTitles: 'Sports Physical Therapist · Head of Department · Physiotherapist',
      experienceYears: '4+',
      phone: '03138161676',
      whatsapp: '923138161676',
      clinicAddress: 'Room #607, 6th Floor, Mall of Islamabad, Jinnah Ave, Block J, Blue Area, Area F 7/1, Islamabad, 44210, Pakistan.',
      clinicFloorRoom: 'Room #607, 6th Floor',
      cityCountry: 'Islamabad, Pakistan',
      heroStatement: 'Dedicated to helping people improve movement, physical function, and quality of life through professional physiotherapy care.',
      professionalStatement: 'With 4 years of experience in physiotherapy, Dr. Kifayat Khan is committed to helping people improve movement, recover from physical challenges, and achieve better physical well-being.',
      profileImage: '/images/dr_kifayat_khan.jpg',
      clinicImage: '/images/physio_clinic.jpg',
      googleMapsEmbedUrl: 'https://maps.google.com/maps?q=Mall+of+Islamabad,+Jinnah+Ave,+Block+J,+Blue+Area,+Islamabad&t=&z=16&ie=UTF8&iwloc=&output=embed',
      googleMapsDirectionsUrl: 'https://www.google.com/maps/search/?api=1&query=Mall+of+Islamabad+Blue+Area+Islamabad',
    },
  };
}

class DatabaseService {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDataDir();
    this.data = this.readFromDisk();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private readFromDisk(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return { ...getInitialDatabase(), ...parsed };
      }
    } catch (err) {
      console.error('Error reading database file, resetting to defaults:', err);
    }
    const initial = getInitialDatabase();
    this.writeToDisk(initial);
    return initial;
  }

  private writeToDisk(data: DatabaseSchema) {
    try {
      this.ensureDataDir();
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing to database:', err);
    }
  }

  public getData(): DatabaseSchema {
    return this.data;
  }

  public save() {
    this.writeToDisk(this.data);
  }

  // Auth & Session
  public authenticateUser(identifier: string, pass: string): { user: AdminUser; token: string } | null {
    const user = this.data.users.find(
      (u) => u.email.toLowerCase() === identifier.toLowerCase() || u.username.toLowerCase() === identifier.toLowerCase()
    );
    if (!user) return null;

    const hash = hashPassword(pass, user.salt);
    if (hash !== user.passwordHash) return null;

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
    this.data.sessions = this.data.sessions.filter((s) => s.expiresAt > Date.now());
    this.data.sessions.push({ token, userId: user.id, expiresAt });
    this.save();

    return { user, token };
  }

  public getUserByToken(token: string): AdminUser | null {
    if (!token) return null;
    const session = this.data.sessions.find((s) => s.token === token && s.expiresAt > Date.now());
    if (!session) return null;
    const user = this.data.users.find((u) => u.id === session.userId);
    return user || null;
  }

  public invalidateToken(token: string) {
    this.data.sessions = this.data.sessions.filter((s) => s.token !== token);
    this.save();
  }

  public updatePassword(userId: string, newPass: string): boolean {
    const user = this.data.users.find((u) => u.id === userId);
    if (!user) return false;
    const salt = crypto.randomBytes(16).toString('hex');
    user.salt = salt;
    user.passwordHash = hashPassword(newPass, salt);
    this.save();
    return true;
  }

  // Public Content
  public getPublicContent() {
    return {
      settings: this.data.settings,
      education: this.data.education,
      experience: this.data.experience,
      socialLinks: this.data.socialLinks,
      videos: this.data.videos.filter((v) => v.isPublished),
      products: this.data.products,
      gallery: this.data.gallery.filter((g) => g.isPublished),
    };
  }

  // Customer Records Management
  public searchCustomers(query?: string, status?: string, page = 1, limit = 10) {
    let list = [...this.data.customers];

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      // Remove punctuation/spaces for flexible phone search
      const cleanQ = q.replace(/[\s\-\(\)\+]/g, '');
      list = list.filter((c) => {
        const nameMatch = c.fullName.toLowerCase().includes(q);
        const cleanPhone = c.phoneNumber.replace(/[\s\-\(\)\+]/g, '');
        const phoneMatch = cleanPhone.includes(cleanQ) || c.phoneNumber.includes(q);
        const emailMatch = c.email?.toLowerCase().includes(q);
        return nameMatch || phoneMatch || emailMatch;
      });
    }

    if (status && status !== 'ALL') {
      list = list.filter((c) => c.status.toLowerCase() === status.toLowerCase());
    }

    // Sort by latest first
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = list.length;
    const startIndex = (page - 1) * limit;
    const items = list.slice(startIndex, startIndex + limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  public getCustomerById(id: string): CustomerRecord | null {
    return this.data.customers.find((c) => c.id === id) || null;
  }

  public addCustomer(record: Omit<CustomerRecord, 'id' | 'createdAt' | 'updatedAt'>): CustomerRecord {
    const newCustomer: CustomerRecord = {
      ...record,
      id: 'cust-' + crypto.randomBytes(4).toString('hex'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.customers.unshift(newCustomer);
    this.save();
    return newCustomer;
  }

  public updateCustomer(id: string, updates: Partial<CustomerRecord>): CustomerRecord | null {
    const idx = this.data.customers.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.data.customers[idx] = {
      ...this.data.customers[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save();
    return this.data.customers[idx];
  }

  public deleteCustomer(id: string): boolean {
    const initialLen = this.data.customers.length;
    this.data.customers = this.data.customers.filter((c) => c.id !== id);
    if (this.data.customers.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Contact Messages
  public addContactMessage(message: Omit<ContactMessageRecord, 'id' | 'date' | 'isRead'>): ContactMessageRecord {
    const newMsg: ContactMessageRecord = {
      ...message,
      id: 'msg-' + crypto.randomBytes(4).toString('hex'),
      date: new Date().toISOString().split('T')[0],
      isRead: false,
    };
    this.data.contactMessages.unshift(newMsg);
    this.save();
    return newMsg;
  }

  public getContactMessages(): ContactMessageRecord[] {
    return this.data.contactMessages;
  }

  public markMessageRead(id: string): boolean {
    const msg = this.data.contactMessages.find((m) => m.id === id);
    if (msg) {
      msg.isRead = true;
      this.save();
      return true;
    }
    return false;
  }

  public deleteContactMessage(id: string): boolean {
    const initialLen = this.data.contactMessages.length;
    this.data.contactMessages = this.data.contactMessages.filter((m) => m.id !== id);
    if (this.data.contactMessages.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Videos
  public getVideos(includeUnpublished = false): VideoRecord[] {
    return includeUnpublished ? this.data.videos : this.data.videos.filter((v) => v.isPublished);
  }

  public addVideo(v: Omit<VideoRecord, 'id' | 'createdAt'>): VideoRecord {
    const newVid: VideoRecord = {
      ...v,
      id: 'vid-' + crypto.randomBytes(4).toString('hex'),
      createdAt: new Date().toISOString(),
    };
    this.data.videos.unshift(newVid);
    this.save();
    return newVid;
  }

  public updateVideo(id: string, updates: Partial<VideoRecord>): VideoRecord | null {
    const idx = this.data.videos.findIndex((v) => v.id === id);
    if (idx === -1) return null;
    this.data.videos[idx] = { ...this.data.videos[idx], ...updates };
    this.save();
    return this.data.videos[idx];
  }

  public deleteVideo(id: string): boolean {
    const initial = this.data.videos.length;
    this.data.videos = this.data.videos.filter((v) => v.id !== id);
    if (this.data.videos.length !== initial) {
      this.save();
      return true;
    }
    return false;
  }

  // Products
  public getProducts(): ProductRecord[] {
    return this.data.products;
  }

  public addProduct(p: Omit<ProductRecord, 'id' | 'createdAt'>): ProductRecord {
    const newProd: ProductRecord = {
      ...p,
      id: 'prod-' + crypto.randomBytes(4).toString('hex'),
      createdAt: new Date().toISOString(),
    };
    this.data.products.unshift(newProd);
    this.save();
    return newProd;
  }

  public updateProduct(id: string, updates: Partial<ProductRecord>): ProductRecord | null {
    const idx = this.data.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.data.products[idx] = { ...this.data.products[idx], ...updates };
    this.save();
    return this.data.products[idx];
  }

  public deleteProduct(id: string): boolean {
    const initial = this.data.products.length;
    this.data.products = this.data.products.filter((p) => p.id !== id);
    if (this.data.products.length !== initial) {
      this.save();
      return true;
    }
    return false;
  }

  // Gallery
  public getGallery(includeUnpublished = false): GalleryRecord[] {
    return includeUnpublished ? this.data.gallery : this.data.gallery.filter((g) => g.isPublished);
  }

  public addGalleryItem(g: Omit<GalleryRecord, 'id' | 'createdAt'>): GalleryRecord {
    const item: GalleryRecord = {
      ...g,
      id: 'gal-' + crypto.randomBytes(4).toString('hex'),
      createdAt: new Date().toISOString(),
    };
    this.data.gallery.unshift(item);
    this.save();
    return item;
  }

  public updateGalleryItem(id: string, updates: Partial<GalleryRecord>): GalleryRecord | null {
    const idx = this.data.gallery.findIndex((g) => g.id === id);
    if (idx === -1) return null;
    this.data.gallery[idx] = { ...this.data.gallery[idx], ...updates };
    this.save();
    return this.data.gallery[idx];
  }

  public deleteGalleryItem(id: string): boolean {
    const initial = this.data.gallery.length;
    this.data.gallery = this.data.gallery.filter((g) => g.id !== id);
    if (this.data.gallery.length !== initial) {
      this.save();
      return true;
    }
    return false;
  }

  // Education
  public updateEducation(education: EducationRecord[]) {
    this.data.education = education;
    this.save();
  }

  // Experience
  public updateExperience(experience: ExperienceRecord[]) {
    this.data.experience = experience;
    this.save();
  }

  // Social Links
  public updateSocialLinks(links: SocialLinksRecord) {
    this.data.socialLinks = { ...this.data.socialLinks, ...links };
    this.save();
  }

  // Settings
  public updateSettings(settings: Partial<WebsiteSettingsRecord>) {
    this.data.settings = { ...this.data.settings, ...settings };
    this.save();
  }

  // Overview Stats
  public getOverviewStats() {
    const physicalItems = this.data.products.filter((p) => p.itemType === 'physical');
    const inStockItems = this.data.products.filter(
      (p) => p.status === 'In Stock' || (p.itemType === 'physical' && (p.stockQuantity ?? 0) > 0)
    );
    const lowStockItems = physicalItems.filter(
      (p) => (p.stockQuantity ?? 0) > 0 && (p.stockQuantity ?? 0) <= 5
    );

    return {
      totalCustomers: this.data.customers.length,
      totalVideos: this.data.videos.length,
      totalProducts: this.data.products.length,
      totalPhysicalProducts: physicalItems.length,
      totalInStock: inStockItems.length,
      lowStockCount: lowStockItems.length,
      totalGallery: this.data.gallery.length,
      totalMessages: this.data.contactMessages.length,
      unreadMessages: this.data.contactMessages.filter((m) => !m.isRead).length,
      recentCustomers: this.data.customers.slice(0, 5),
    };
  }
}

export const db = new DatabaseService();
