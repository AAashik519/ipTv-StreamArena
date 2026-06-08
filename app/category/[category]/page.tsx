import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import {
  getChannelsByCategory,
  getAllCategories,
  getAllChannels as getAll,
} from "@/lib/data";
import { getCategoryIcon, getCategoryColor, buildCategoryInfoList } from "@/lib/utils";
import ChannelGrid from "@/components/ChannelGrid";
import CategoryCard from "@/components/ui/CategoryCard";

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((cat) => ({
    category: encodeURIComponent(cat),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const decoded = decodeURIComponent(category);
  return {
    title: `${decoded} Channels — StreamArena`,
    description: `Watch all ${decoded} live TV channels on StreamArena.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const decoded = decodeURIComponent(category);
  const channels = getChannelsByCategory(decoded);
  const icon = getCategoryIcon(decoded);

  if (channels.length === 0) {
    notFound();
  }

  const allCategories = buildCategoryInfoList(getAll());
  const otherCategories = allCategories.filter((c) => c.name !== decoded).slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
          <Home size={14} />
          Home
        </Link>
        <ChevronRight size={14} />
        <span className="text-white font-medium">{decoded}</span>
      </nav>

      {/* Hero header */}
      <div
        className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${getCategoryColor(decoded)} border border-[#2a2a35] mb-10 p-8`}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10">
          <span className="text-5xl block mb-3">{icon}</span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">{decoded}</h1>
          <p className="text-gray-300 text-sm">
            {channels.length} {channels.length === 1 ? "channel" : "channels"} available
          </p>
        </div>
      </div>

      {/* Channel Grid */}
      <section className="mb-16">
        <ChannelGrid channels={channels} />
      </section>

      {/* Explore other categories */}
      {otherCategories.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            📡 Explore More Categories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {otherCategories.map((cat) => (
              <CategoryCard key={cat.name} category={cat} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
