export interface Manga {
  id: string;
  title: string;
  description?: string;
  coverUrl: string;
  status: 'ongoing' | 'completed' | 'hiatus' | 'cancelled';
  genres: string[];
  author?: string;
  artist?: string;
  year?: number;
  rating?: number;
  chapters?: Chapter[];
  lastUpdated?: string;
  views?: number;
}

export interface Chapter {
  id: string;
  title: string;
  number: number;
  pages: string[];
  publishedAt: string;
  views?: number;
}

export interface ApiResponse<T> {
  result: 'ok' | 'error';
  response: string;
  data: T[];
  limit: number;
  offset: number;
  total: number;
}