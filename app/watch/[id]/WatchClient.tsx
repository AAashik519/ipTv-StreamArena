"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Home, Play, ArrowLeft, ArrowRight } from "lucide-react";
import { Channel } from "@/lib/types";
import { parseStreamUrls, getCategoryIcon, addRecentlyWatched } from "@/lib/utils";

const VideoPlayer = dynamic(() => import("@/components/player/VideoPlayer"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-video bg-black rounded-xl flex items-center justify-center">
      <div className="w-14 h-14 border-4 border-[#e50914]/30 border-t-[#e50914] rounded-full animate-spin" />
    </div>
  ),
});

interface Props {
  channel: Channel;
  related: Channel[];
  prevChannel?: Channel;
  nextChannel?: Channel;
}

export default function WatchClient({ channel, related, prevChannel, nextChannel }: Props) {
  const streamUrls = parseStreamUrls(channel.stream_url);

  useEffect(() => {
    addRecentlyWatched(channel);
  }, [channel]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
          <Home size={14} />
          Home
        </Link>
        <ChevronRight size={14} />
        <Link
          href={`/category/${encodeURIComponent(channel.category)}`}
          className="hover:text-white transition-colors"
        >
          {getCategoryIcon(channel.category)} {channel.category}
        </Link>
        <ChevronRight size={14} />
        <span className="text-white font-medium truncate max-w-40">{channel.title}</span>
      </nav>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main player area */}
        <div className="xl:col-span-2">
          <VideoPlayer
            urls={streamUrls}
            title={channel.title}
            logoUrl={channel.logo_url}
          />

          {/* Channel info */}
          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              {channel.logo_url && (
                <div className="relative w-14 h-14 bg-[#1a1a1f] border border-[#2a2a35] rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={channel.logo_url}
                    alt={channel.title}
                    fill
                    sizes="56px"
                    className="object-contain p-1.5"
                    unoptimized
                  />
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold text-white">{channel.title}</h1>
                <Link
                  href={`/category/${encodeURIComponent(channel.category)}`}
                  className="text-sm text-[#e50914] hover:text-red-400 transition-colors flex items-center gap-1 mt-0.5"
                >
                  {getCategoryIcon(channel.category)} {channel.category}
                </Link>
              </div>
            </div>

            {/* Stream count */}
            <div className="flex items-center gap-2 text-xs text-gray-500 bg-[#1a1a1f] border border-[#2a2a35] px-3 py-2 rounded-lg">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              {streamUrls.length} stream{streamUrls.length !== 1 ? "s" : ""} available
            </div>
          </div>

          {/* Prev / Next navigation */}
          <div className="flex items-center gap-3 mt-4">
            {prevChannel ? (
              <Link
                href={`/watch/${prevChannel.id}`}
                className="flex-1 flex items-center gap-2 bg-[#1a1a1f] hover:bg-[#252530] border border-[#2a2a35] hover:border-[#e50914]/30 rounded-xl p-3 transition-all group"
              >
                <ArrowLeft size={16} className="text-gray-400 group-hover:text-white flex-shrink-0" />
                <div className="overflow-hidden">
                  <p className="text-xs text-gray-500">Previous</p>
                  <p className="text-sm font-medium text-gray-300 group-hover:text-white truncate">
                    {prevChannel.title}
                  </p>
                </div>
              </Link>
            ) : <div className="flex-1" />}

            {nextChannel && (
              <Link
                href={`/watch/${nextChannel.id}`}
                className="flex-1 flex items-center justify-end gap-2 bg-[#1a1a1f] hover:bg-[#252530] border border-[#2a2a35] hover:border-[#e50914]/30 rounded-xl p-3 transition-all group text-right"
              >
                <div className="overflow-hidden">
                  <p className="text-xs text-gray-500">Next</p>
                  <p className="text-sm font-medium text-gray-300 group-hover:text-white truncate">
                    {nextChannel.title}
                  </p>
                </div>
                <ArrowRight size={16} className="text-gray-400 group-hover:text-white flex-shrink-0" />
              </Link>
            )}
          </div>
        </div>

        {/* Sidebar: Related channels */}
        <div className="xl:col-span-1">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            {getCategoryIcon(channel.category)}
            More {channel.category} Channels
          </h2>

          {related.length > 0 ? (
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[600px] pr-1">
              {related.map((ch) => (
                <Link
                  key={ch.id}
                  href={`/watch/${ch.id}`}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all group ${
                    ch.id === channel.id
                      ? "bg-[#e50914]/10 border-[#e50914]/30"
                      : "bg-[#1a1a1f] border-[#2a2a35] hover:border-[#e50914]/30 hover:bg-[#252530]"
                  }`}
                >
                  <div className="relative w-10 h-10 bg-black/50 rounded-lg overflow-hidden flex-shrink-0">
                    {ch.logo_url ? (
                      <Image
                        src={ch.logo_url}
                        alt={ch.title}
                        fill
                        sizes="40px"
                        className="object-contain"
                        unoptimized
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-lg">📺</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium truncate transition-colors ${
                        ch.id === channel.id
                          ? "text-[#e50914]"
                          : "text-gray-300 group-hover:text-white"
                      }`}
                    >
                      {ch.title}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      Live
                    </p>
                  </div>
                  {ch.id !== channel.id && (
                    <Play
                      size={14}
                      className="text-gray-500 group-hover:text-[#e50914] flex-shrink-0 transition-colors"
                    />
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No related channels found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
