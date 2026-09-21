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
