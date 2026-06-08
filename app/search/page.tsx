import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Search, Home, ChevronRight } from "lucide-react";
import { searchChannels, getFeaturedChannels } from "@/lib/data";
import { Channel } from "@/lib/types";
import ChannelGrid from "@/components/ChannelGrid";
import { SkeletonGrid } from "@/components/ui/SkeletonCard";
import SearchInput from "./SearchInput";

interface Props {
  searchParams: Promise<{ q?: string; featured?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `"${q}" — Search — StreamArena` : "Search Channels — StreamArena",
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q, featured } = await searchParams;
  const query = q?.trim() ?? "";

  let channels: Channel[] = [];
  let heading = "";

  if (featured === "true") {
    channels = getFeaturedChannels();
    heading = "Featured Channels";
  } else if (query) {
    channels = searchChannels(query);
    heading = `Results for "${query}"`;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
          <Home size={14} />
          Home
        </Link>
        <ChevronRight size={14} />
        <span className="text-white">Search</span>
      </nav>

      {/* Search Input */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Search size={22} className="text-[#e50914]" />
          Search Channels
        </h1>
        <SearchInput defaultValue={query} />
      </div>

      {/* Results */}
      {query || featured ? (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">{heading}</h2>
            <span className="text-sm text-gray-500">
              {channels.length} result{channels.length !== 1 ? "s" : ""}
            </span>
          </div>
          <Suspense fallback={<SkeletonGrid count={12} />}>
            <ChannelGrid channels={channels} showCategory />
          </Suspense>
        </section>
      ) : (
        <div className="text-center py-20 text-gray-500">
          <Search size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg">Start typing to search channels…</p>
          <p className="text-sm mt-2">Search by channel name or category</p>
        </div>
      )}
    </div>
  );
}
