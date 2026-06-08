import { Suspense } from "react";
import {
  getAllChannels,
  getAllCategories,
  getWorldCupChannels,
  getFeaturedChannels,
  getChannelsByCategory,
} from "@/lib/data";
import { buildCategoryInfoList, getCategoryIcon } from "@/lib/utils";
import FeaturedBanner from "@/components/FeaturedBanner";
import ChannelGrid from "@/components/ChannelGrid";
import CategoryCard from "@/components/ui/CategoryCard";
import SectionHeader from "@/components/ui/SectionHeader";
import RecentlyWatched from "@/components/RecentlyWatched";
import { SkeletonGrid } from "@/components/ui/SkeletonCard";

export const revalidate = 3600;

export default function HomePage() {
  const allChannels = getAllChannels();
  const worldCupChannels = getWorldCupChannels();
  const featuredChannels = getFeaturedChannels().slice(0, 12);
  const categories = buildCategoryInfoList(allChannels);
  const sportsChannels = getChannelsByCategory("Sports").slice(0, 12);
  const banglaChannels = getChannelsByCategory("Bangla").slice(0, 12);
  const newsChannels = getChannelsByCategory("News").slice(0, 12);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Recently Watched (client component) */}
      <RecentlyWatched />

      {/* World Cup Featured Banner */}
      <FeaturedBanner channels={worldCupChannels} />

      {/* Categories Section */}
      <section className="mb-12">
        <SectionHeader
          title="Browse Categories"
          icon="📡"
          subtitle={`${categories.length} categories · ${allChannels.length} channels total`}
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.name} category={cat} />
          ))}
        </div>
      </section>

      {/* Featured Channels */}
      <section className="mb-12">
        <SectionHeader
          title="Featured Channels"
          icon="⭐"
          href="/search?featured=true"
          subtitle="Hand-picked channels for you"
        />
        <Suspense fallback={<SkeletonGrid count={12} />}>
          <ChannelGrid channels={featuredChannels} showCategory />
        </Suspense>
      </section>

      {/* Sports */}
      {sportsChannels.length > 0 && (
        <section className="mb-12">
          <SectionHeader
            title="Sports"
            icon={getCategoryIcon("Sports")}
            href="/category/Sports"
          />
          <Suspense fallback={<SkeletonGrid count={6} />}>
            <ChannelGrid channels={sportsChannels} />
          </Suspense>
        </section>
      )}

      {/* Bangla Channels */}
      {banglaChannels.length > 0 && (
        <section className="mb-12">
          <SectionHeader
            title="Bangla Channels"
            icon={getCategoryIcon("Bangla")}
            href="/category/Bangla"
          />
          <Suspense fallback={<SkeletonGrid count={6} />}>
            <ChannelGrid channels={banglaChannels} />
          </Suspense>
        </section>
      )}

      {/* News */}
      {newsChannels.length > 0 && (
        <section className="mb-12">
          <SectionHeader
            title="News"
            icon={getCategoryIcon("News")}
            href="/category/News"
          />
          <Suspense fallback={<SkeletonGrid count={6} />}>
            <ChannelGrid channels={newsChannels} />
          </Suspense>
        </section>
      )}

      {/* All Channels CTA */}
      <section className="text-center py-12 border border-[#2a2a35] rounded-2xl bg-[#1a1a1f]/50">
        <p className="text-gray-400 text-sm mb-2">Can&apos;t find what you&apos;re looking for?</p>
        <h3 className="text-2xl font-bold text-white mb-4">
          {allChannels.length}+ channels available
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          {getAllCategories().map((cat) => (
            <a
              key={cat}
              href={`/category/${encodeURIComponent(cat)}`}
              className="text-xs bg-[#2a2a35] hover:bg-[#e50914]/20 hover:border-[#e50914]/30 border border-transparent text-gray-300 hover:text-white px-3 py-1.5 rounded-full transition-all"
            >
              {getCategoryIcon(cat)} {cat}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
