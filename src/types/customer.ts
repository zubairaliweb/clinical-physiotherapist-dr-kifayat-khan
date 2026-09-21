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

export interface CustomerSearchResponse {
  items: CustomerRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
