import {
  CustomerRecord,
  PublicContentResponse,
  OverviewStats,
  VideoRecord,
  ProductRecord,
  GalleryRecord,
  ContactMessageRecord,
  WebsiteSettingsRecord,
  EducationRecord,
  ExperienceRecord,
  SocialLinksRecord,
} from '../types';

const TOKEN_KEY = 'dr_kifayat_admin_token';

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),
};

async function handleResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const errorMsg = data?.error || data?.message || (typeof data === 'string' ? data : 'An unexpected error occurred');
    throw new Error(errorMsg);
  }

  return data as T;
}

export const api = {
  // Public
  async getPublicContent(): Promise<PublicContentResponse> {
    const res = await fetch('/api/content');
    return handleResponse<PublicContentResponse>(res);
  },

  async sendContactMessage(payload: {
    fullName: string;
    phoneNumber: string;
    email: string;
    subject?: string;
    message: string;
  }) {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<{ success: boolean; message: string; id: string }>(res);
  },

  // Auth
  async login(identifier: string, pass: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password: pass }),
    });
    const data = await handleResponse<{ success: boolean; token: string; user: any }>(res);
    authStorage.setToken(data.token);
    return data;
  },

  async getMe() {
    const token = authStorage.getToken();
    if (!token) throw new Error('Not authenticated');
    const res = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse<{ user: any }>(res);
  },

  async logout() {
    const token = authStorage.getToken();
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (e) {
        // ignore logout failure
      }
    }
    authStorage.clearToken();
  },

  async changePassword(newPassword: string) {
    const token = authStorage.getToken();
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ newPassword }),
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  },

  // Admin Overview
  async getOverviewStats(): Promise<OverviewStats> {
    const token = authStorage.getToken();
    const res = await fetch('/api/admin/overview', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse<OverviewStats>(res);
  },

  // Customer Management
  async getCustomers(params?: { search?: string; status?: string; page?: number; limit?: number }) {
    const token = authStorage.getToken();
    const q = new URLSearchParams();
    if (params?.search) q.set('search', params.search);
    if (params?.status) q.set('status', params.status);
    if (params?.page) q.set('page', params.page.toString());
    if (params?.limit) q.set('limit', params.limit.toString());

    const res = await fetch(`/api/admin/customers?${q.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse<{
      items: CustomerRecord[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(res);
  },

  async getCustomerById(id: string): Promise<CustomerRecord> {
    const token = authStorage.getToken();
    const res = await fetch(`/api/admin/customers/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse<CustomerRecord>(res);
  },

  async addCustomer(record: Omit<CustomerRecord, 'id' | 'createdAt' | 'updatedAt'>) {
    const token = authStorage.getToken();
    const res = await fetch('/api/admin/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(record),
    });
    return handleResponse<{ success: boolean; customer: CustomerRecord }>(res);
  },

  async updateCustomer(id: string, updates: Partial<CustomerRecord>) {
    const token = authStorage.getToken();
    const res = await fetch(`/api/admin/customers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    return handleResponse<{ success: boolean; customer: CustomerRecord }>(res);
  },

  async deleteCustomer(id: string) {
    const token = authStorage.getToken();
    const res = await fetch(`/api/admin/customers/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  },

  // Videos
  async getAdminVideos(): Promise<VideoRecord[]> {
    const token = authStorage.getToken();
    const res = await fetch('/api/admin/videos', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse<VideoRecord[]>(res);
  },

  async addVideo(vid: Omit<VideoRecord, 'id' | 'createdAt'>) {
    const token = authStorage.getToken();
    const res = await fetch('/api/admin/videos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(vid),
    });
    return handleResponse<{ success: boolean; video: VideoRecord }>(res);
  },

  async updateVideo(id: string, updates: Partial<VideoRecord>) {
    const token = authStorage.getToken();
    const res = await fetch(`/api/admin/videos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    return handleResponse<{ success: boolean; video: VideoRecord }>(res);
  },

  async deleteVideo(id: string) {
    const token = authStorage.getToken();
    const res = await fetch(`/api/admin/videos/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse<{ success: boolean }>(res);
  },

  // Products
  async getAdminProducts(): Promise<ProductRecord[]> {
    const token = authStorage.getToken();
    const res = await fetch('/api/admin/products', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse<ProductRecord[]>(res);
  },

  async addProduct(prod: Omit<ProductRecord, 'id' | 'createdAt'>) {
    const token = authStorage.getToken();
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(prod),
    });
    return handleResponse<{ success: boolean; product: ProductRecord }>(res);
  },

  async updateProduct(id: string, updates: Partial<ProductRecord>) {
    const token = authStorage.getToken();
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    return handleResponse<{ success: boolean; product: ProductRecord }>(res);
  },

  async deleteProduct(id: string) {
    const token = authStorage.getToken();
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse<{ success: boolean }>(res);
  },

  // Gallery
  async getAdminGallery(): Promise<GalleryRecord[]> {
    const token = authStorage.getToken();
    const res = await fetch('/api/admin/gallery', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse<GalleryRecord[]>(res);
  },

  async addGalleryItem(item: Omit<GalleryRecord, 'id' | 'createdAt'>) {
    const token = authStorage.getToken();
    const res = await fetch('/api/admin/gallery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(item),
    });
    return handleResponse<{ success: boolean; item: GalleryRecord }>(res);
  },

  async updateGalleryItem(id: string, updates: Partial<GalleryRecord>) {
    const token = authStorage.getToken();
    const res = await fetch(`/api/admin/gallery/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    return handleResponse<{ success: boolean; item: GalleryRecord }>(res);
  },

  async deleteGalleryItem(id: string) {
    const token = authStorage.getToken();
    const res = await fetch(`/api/admin/gallery/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse<{ success: boolean }>(res);
  },

  // Messages
  async getContactMessages(): Promise<ContactMessageRecord[]> {
    const token = authStorage.getToken();
    const res = await fetch('/api/admin/messages', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse<ContactMessageRecord[]>(res);
  },

  async markMessageRead(id: string) {
    const token = authStorage.getToken();
    const res = await fetch(`/api/admin/messages/${id}/read`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse<{ success: boolean }>(res);
  },

  async deleteMessage(id: string) {
    const token = authStorage.getToken();
    const res = await fetch(`/api/admin/messages/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse<{ success: boolean }>(res);
  },

  // Settings & Metadata
  async updateSettings(settings: Partial<WebsiteSettingsRecord>) {
    const token = authStorage.getToken();
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(settings),
    });
    return handleResponse<{ success: boolean; settings: WebsiteSettingsRecord }>(res);
  },

  async updateEducation(education: EducationRecord[]) {
    const token = authStorage.getToken();
    const res = await fetch('/api/admin/education', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(education),
    });
    return handleResponse<{ success: boolean; education: EducationRecord[] }>(res);
  },

  async updateExperience(experience: ExperienceRecord[]) {
    const token = authStorage.getToken();
    const res = await fetch('/api/admin/experience', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(experience),
    });
    return handleResponse<{ success: boolean; experience: ExperienceRecord[] }>(res);
  },

  async updateSocial(social: SocialLinksRecord) {
    const token = authStorage.getToken();
    const res = await fetch('/api/admin/social', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(social),
    });
    return handleResponse<{ success: boolean; socialLinks: SocialLinksRecord }>(res);
  },

  // Upload Base64
  async uploadImage(base64Data: string): Promise<string> {
    const token = authStorage.getToken();
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ base64Data }),
    });
    const data = await handleResponse<{ success: boolean; url: string }>(res);
    return data.url;
  },
};
