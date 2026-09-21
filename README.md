# Dr. Kifayat Khan | Clinical Physiotherapy Platform

A full-stack, responsive medical practice management and patient portal application built for **Dr. Kifayat Khan**, Clinical Physiotherapist and Sports Physical Therapist based in Mall of Islamabad, Pakistan.

---

## 🏛️ Professional Architecture Overview

The codebase is organized into clean, modular layers adhering to enterprise TypeScript standards:

```text
├── data/
│   └── database.json          # Persistent JSON datastore (Patients, Videos, Products, Gallery, Settings)
├── public/
│   └── uploads/               # Static user and media uploads
├── server/
│   ├── db.ts                  # Centralized DatabaseService singleton with typed CRUD
│   ├── middleware/
│   │   └── auth.ts            # Bearer token authentication & route protection middleware
│   └── routes/
│       └── publicRoutes.ts    # Public content, inquiries, and authentication endpoints
├── src/
│   ├── components/
│   │   ├── admin/             # Secure Staff & Doctor Admin Management Dashboards
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminLoginModal.tsx
│   │   │   ├── CustomerManagement.tsx
│   │   │   ├── EducationExperienceManagement.tsx
│   │   │   ├── GalleryManagement.tsx
│   │   │   ├── MessagesManagement.tsx
│   │   │   ├── ProductManagement.tsx
│   │   │   ├── SocialAndSettingsManagement.tsx
│   │   │   └── VideoManagement.tsx
│   │   ├── common/            # Shared, reusable UI components
│   │   │   └── ThemeToggle.tsx
│   │   ├── home/              # Landing page clinical sections
│   │   │   ├── Hero.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── EducationSection.tsx
│   │   │   ├── ExperienceSection.tsx
│   │   │   ├── ServicesSection.tsx
│   │   │   ├── VideoSection.tsx
│   │   │   ├── GallerySection.tsx
│   │   │   ├── LocationSection.tsx
│   │   │   ├── SocialSection.tsx
│   │   │   └── ContactSection.tsx
│   │   └── layout/            # Layout wrappers
│   │       ├── Navbar.tsx
│   │       └── Footer.tsx
│   ├── context/
│   │   └── ThemeContext.tsx   # Dark/Light theme state provider
│   ├── lib/
│   │   └── api.ts             # Strongly typed Axios/Fetch API client & session manager
│   ├── types/                 # Modular TypeScript interfaces and domain models
│   │   ├── auth.ts
│   │   ├── contact.ts
│   │   ├── customer.ts
│   │   ├── gallery.ts
│   │   ├── index.ts
│   │   ├── product.ts
│   │   ├── settings.ts
│   │   └── video.ts
│   ├── App.tsx                # Primary application root
│   ├── main.tsx               # Client entry point
│   └── index.css              # Global styling with Tailwind CSS
├── index.html                 # Semantic HTML entry with SEO & Schema.org JSON-LD
├── server.ts                  # Production Express server & Vite middleware
└── package.json
```

---

## 🚀 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Development Mode
Run the unified Express and Vite dev server:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

### 3. Build for Production
Bundle both client-side assets and the Node backend:
```bash
npm run build
```

### 4. Production Start
Run the bundled CommonJS production server:
```bash
npm start
```

### 5. Type Checking & Verification
Validate all TypeScript typings:
```bash
npm run lint
```

---

## 🔒 Security & Medical Confidentiality
- **Customer Privacy**: All patient and customer records are protected behind token-authenticated endpoints (`/api/admin/*`) requiring valid admin credentials.
- **Data Integrity**: All changes made through the administration dashboard are safely synced with `data/database.json`.
