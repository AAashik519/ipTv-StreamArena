"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, X, Play } from "lucide-react";
import { RecentlyWatchedItem } from "@/lib/types";
import { getRecentlyWatched } from "@/lib/utils";

export default function RecentlyWatched() {
  const [items, setItems] = useState<RecentlyWatchedItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setItems(getRecentlyWatched());
  }, []);

  function remove(id: number) {
    const updated = items.filter((x) => x.id !== id);
    setItems(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("streamarena_recent", JSON.stringify(updated));
    }
  }

  if (!mounted || items.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-4">
        <Clock size={18} className="text-[#e50914]" />
        <h2 className="text-xl font-bold text-white">Recently Watched</h2>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {items.map((item) => (
          <div
            key={item.id}
            className="relative flex-shrink-0 group w-36"
          >
            <Link href={`/watch/${item.id}`} className="block">
              <div className="relative w-full aspect-video bg-[#1a1a1f] border border-[#2a2a35] rounded-xl overflow-hidden group-hover:border-[#e50914]/50 transition-all">
                {item.logo_url ? (
                  <Image
                    src={item.logo_url}
                    alt={item.title}
                    fill
                    sizes="144px"
                    className="object-contain p-3"
                    unoptimized
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-2xl">📺</div>
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
                  <Play size={16} className="text-white" fill="white" />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1.5 truncate px-0.5 group-hover:text-white transition-colors">
                {item.title}
              </p>
            </Link>

            {/* Remove button */}
            <button
              onClick={() => remove(item.id)}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#e50914] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
              aria-label="Remove from history"
            >
              <X size={10} className="text-white" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
