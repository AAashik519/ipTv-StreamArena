import { Channel } from "./types";
import channelsData from "@/data/channels.json";

const channels: Channel[] = channelsData as Channel[];

export function getAllChannels(): Channel[] {
  return channels;
}

export function getChannelById(id: number): Channel | undefined {
  return channels.find((ch) => ch.id === id);
}

export function getChannelsByCategory(category: string): Channel[] {
  return channels.filter(
    (ch) => ch.category.toLowerCase() === category.toLowerCase()
  );
}

export function getFeaturedChannels(): Channel[] {
  return channels.filter((ch) => ch.featured === ".");
}

export function getWorldCupChannels(): Channel[] {
  return channels.filter((ch) => ch.category === "World Cup");
}

export function getAllCategories(): string[] {
  return [...new Set(channels.map((ch) => ch.category))];
}

export function searchChannels(query: string): Channel[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return channels.filter(
    (ch) =>
      ch.title.toLowerCase().includes(q) ||
      ch.category.toLowerCase().includes(q)
  );
}
