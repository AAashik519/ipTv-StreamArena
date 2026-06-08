export function SkeletonChannelCard() {
  return (
    <div className="bg-[#1a1a1f] border border-[#2a2a35] rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-video skeleton-shimmer" />
      <div className="p-3 space-y-2">
        <div className="h-3 skeleton-shimmer rounded w-3/4" />
        <div className="h-2 skeleton-shimmer rounded w-1/2" />
      </div>
    </div>
  );
}

export function SkeletonCategoryCard() {
  return (
    <div className="bg-[#1a1a1f] border border-[#2a2a35] rounded-xl p-5 animate-pulse">
      <div className="w-8 h-8 skeleton-shimmer rounded-lg mb-3" />
      <div className="h-3 skeleton-shimmer rounded w-2/3 mb-2" />
      <div className="h-2 skeleton-shimmer rounded w-1/2" />
    </div>
  );
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonChannelCard key={i} />
      ))}
    </div>
  );
}
