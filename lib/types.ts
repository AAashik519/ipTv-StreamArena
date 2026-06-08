export interface Channel {
  id: number;
  title: string;
  category: string;
  stream_url: string;
  featured: string;
  logo_url: string;
}

export interface CategoryInfo {
  name: string;
  count: number;
  icon: string;
  color: string;
}

export interface RecentlyWatchedItem {
  id: number;
  title: string;
  logo_url: string;
  category: string;
  watchedAt: number;
}
