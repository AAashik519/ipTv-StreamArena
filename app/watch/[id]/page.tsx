import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getAllChannels, getChannelById, getChannelsByCategory } from "@/lib/data";
import WatchClient from "./WatchClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const channels = getAllChannels();
  return channels.map((ch) => ({ id: String(ch.id) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const channel = getChannelById(Number(id));
  if (!channel) return { title: "Channel Not Found — StreamArena" };

  return {
    title: `${channel.title} Live — StreamArena`,
    description: `Watch ${channel.title} live streaming. ${channel.category} channel on StreamArena.`,
    openGraph: {
      title: `${channel.title} — Live Stream`,
      images: channel.logo_url ? [{ url: channel.logo_url }] : [],
    },
  };
}

export default async function WatchPage({ params }: Props) {
  const { id } = await params;
  const channel = getChannelById(Number(id));

  if (!channel) notFound();

  const related = getChannelsByCategory(channel.category).filter(
    (ch) => ch.id !== channel.id
  );

  const allInCategory = getChannelsByCategory(channel.category);
  const currentIndex = allInCategory.findIndex((ch) => ch.id === channel.id);
  const prevChannel = currentIndex > 0 ? allInCategory[currentIndex - 1] : undefined;
  const nextChannel =
    currentIndex < allInCategory.length - 1
      ? allInCategory[currentIndex + 1]
      : undefined;

  return (
    <WatchClient
      channel={channel}
      related={allInCategory}
      prevChannel={prevChannel}
      nextChannel={nextChannel}
    />
  );
}
