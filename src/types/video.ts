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
