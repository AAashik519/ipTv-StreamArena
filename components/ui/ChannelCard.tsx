"use client";

import Link from "next/link";
import Image from "next/image";
import { Play, Wifi } from "lucide-react";
import { Channel } from "@/lib/types";

interface Props {
  channel: Channel;
  showCategory?: boolean;
}

export default function ChannelCard({ channel, showCategory = false }: Props) {
  return (
    <Link
      href={`/watch/${channel.id}`}
      className="channel-card group relative bg-[#1a1a1f] border border-[#2a2a35] rounded-xl overflow-hidden hover:border-[#e50914]/50 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 block"
    >
      {/* Thumbnail / Logo area */}
      <div className="relative aspect-video bg-gradient-to-br from-[#1a1a1f] to-[#252530] overflow-hidden">
        {channel.logo_url ? (
          <Image
            src={channel.logo_url}
            alt={channel.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
            unoptimized
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl opacity-30">📺</span>
          </div>
        )}

        {/* Live badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-[#e50914] text-white text-[10px] font-bold px-2 py-0.5 rounded-full live-badge">
          <Wifi size={8} />
          LIVE
        </div>

        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/50">
          <div className="w-12 h-12 bg-[#e50914] rounded-full flex items-center justify-center shadow-lg shadow-red-900/50">
            <Play size={20} className="text-white ml-1" fill="white" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-white truncate group-hover:text-[#e50914] transition-colors">
          {channel.title}
        </h3>
        {showCategory && (
          <p className="text-xs text-gray-500 mt-0.5 truncate">{channel.category}</p>
        )}
      </div>
    </Link>
  );
}
