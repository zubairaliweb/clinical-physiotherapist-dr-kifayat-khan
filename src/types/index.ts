import { CustomerRecord } from './customer';
import { VideoRecord } from './video';
import { ProductRecord } from './product';
import { GalleryRecord } from './gallery';
import { ContactMessageRecord } from './contact';
import {
  EducationRecord,
  ExperienceRecord,
  SocialLinksRecord,
  WebsiteSettingsRecord,
} from './settings';
import { AdminUser, SessionRecord } from './auth';

export * from './auth';
export * from './customer';
export * from './video';
export * from './product';
export * from './gallery';
export * from './contact';
export * from './settings';

export interface PublicContentResponse {
  settings: WebsiteSettingsRecord;
  education: EducationRecord[];
  experience: ExperienceRecord[];
  socialLinks: SocialLinksRecord;
  videos: VideoRecord[];
  products: ProductRecord[];
  gallery: GalleryRecord[];
}

export interface OverviewStats {
  totalCustomers: number;
  totalVideos: number;
  totalProducts: number;
  totalPhysicalProducts?: number;
  totalInStock?: number;
  lowStockCount?: number;
  totalGallery: number;
  totalMessages: number;
  unreadMessages: number;
  recentCustomers: CustomerRecord[];
}
