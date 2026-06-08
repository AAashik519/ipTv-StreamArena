import { Channel, CategoryInfo, RecentlyWatchedItem } from "./types";

export function parseStreamUrls(streamUrl: string): string[] {
  return streamUrl
    .split(",")
    .map((url) => url.trim())
    .filter((url) => url.length > 0 && (url.startsWith("http://") || url.startsWith("https://")));
}

export function isFeatured(channel: Channel): boolean {
  return channel.featured === ".";
}

export const CATEGORY_META: Record<string, { icon: string; color: string }> = {
  "World Cup": { icon: "🏆", color: "from-yellow-500/20 to-amber-600/20" },
  Sports: { icon: "⚽", color: "from-green-500/20 to-emerald-600/20" },
  Bangla: { icon: "🇧🇩", color: "from-red-500/20 to-rose-600/20" },
  News: { icon: "📺", color: "from-blue-500/20 to-cyan-600/20" },
  Latest: { icon: "🔥", color: "from-orange-500/20 to-red-600/20" },
  Channels: { icon: "📡", color: "from-purple-500/20 to-violet-600/20" },
  English: { icon: "🇬🇧", color: "from-sky-500/20 to-blue-600/20" },
  Hindi: { icon: "🎬", color: "from-pink-500/20 to-fuchsia-600/20" },
  "Indian Bangla": { icon: "🎭", color: "from-indigo-500/20 to-purple-600/20" },
  Kids: { icon: "🧸", color: "from-yellow-400/20 to-lime-500/20" },
  Movie: { icon: "🎥", color: "from-slate-500/20 to-gray-600/20" },
  Religious: { icon: "☪️", color: "from-teal-500/20 to-cyan-600/20" },
  Urdhu: { icon: "📻", color: "from-amber-500/20 to-yellow-600/20" },
  Weather: { icon: "🌤️", color: "from-sky-400/20 to-blue-500/20" },
  Music: { icon: "🎵", color: "from-fuchsia-500/20 to-pink-600/20" },
  Documentary: { icon: "🎞️", color: "from-stone-500/20 to-neutral-600/20" },
};

export function getCategoryIcon(category: string): string {
  return CATEGORY_META[category]?.icon ?? "📺";
}

export function getCategoryColor(category: string): string {
  return CATEGORY_META[category]?.color ?? "from-gray-500/20 to-slate-600/20";
}

export function buildCategoryInfoList(channels: Channel[]): CategoryInfo[] {
  const map = new Map<string, number>();
  for (const ch of channels) {
    map.set(ch.category, (map.get(ch.category) ?? 0) + 1);
  }
  return Array.from(map.entries()).map(([name, count]) => ({
    name,
    count,
    icon: getCategoryIcon(name),
    color: getCategoryColor(name),
  }));
}

export function getRecentlyWatched(): RecentlyWatchedItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("streamarena_recent");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addRecentlyWatched(channel: Channel): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getRecentlyWatched().filter((x) => x.id !== channel.id);
    const item: RecentlyWatchedItem = {
      id: channel.id,
      title: channel.title,
      logo_url: channel.logo_url,
      category: channel.category,
      watchedAt: Date.now(),
    };
    const updated = [item, ...existing].slice(0, 10);
    localStorage.setItem("streamarena_recent", JSON.stringify(updated));
  } catch {
    // silently ignore
  }
}

export function slugify(text: string): string {
  return encodeURIComponent(text);
}

export function deslugify(text: string): string {
  return decodeURIComponent(text);
}
