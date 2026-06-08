import Link from "next/link";
import Image from "next/image";
import { Play, Trophy, Tv } from "lucide-react";
import { Channel } from "@/lib/types";

interface Props {
  channels: Channel[];
}

export default function FeaturedBanner({ channels }: Props) {
  const main = channels[0];
  const others = channels.slice(1, 5);

  if (!main) return null;

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-950/40 via-[#1a1a1f] to-[#0d0d0f] border border-yellow-500/20 mb-12">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#e50914]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 p-6 sm:p-8 lg:p-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 font-bold text-sm px-4 py-1.5 rounded-full">
            <Trophy size={14} />
            FIFA World Cup 2026
          </div>
          <div className="flex items-center gap-1 bg-[#e50914]/20 border border-[#e50914]/30 text-red-400 text-xs font-bold px-3 py-1 rounded-full animate-pulse">
            🔴 LIVE NOW
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Main featured channel */}
          <Link
            href={`/watch/${main.id}`}
            className="group flex-1 flex flex-col sm:flex-row items-start gap-4 hover:opacity-95 transition-opacity"
          >
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-black/50 rounded-xl overflow-hidden border border-yellow-500/20 group-hover:border-yellow-500/50 transition-all">
              {main.logo_url ? (
                <Image
                  src={main.logo_url}
                  alt={main.title}
                  fill
                  sizes="112px"
                  className="object-contain p-2"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">🏆</div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 group-hover:text-yellow-400 transition-colors">
                {main.title}
              </h2>
              <p className="text-gray-400 text-sm mb-4">
                Watch World Cup 2026 live in HD quality with multiple stream sources.
              </p>
              <button className="flex items-center gap-2 bg-[#e50914] hover:bg-[#b81d24] text-white font-bold px-6 py-3 rounded-xl transition-all hover:scale-105 shadow-lg shadow-red-900/40">
                <Play size={18} fill="white" />
                Watch Now
              </button>
            </div>
          </Link>

          {/* Other World Cup channels */}
          {others.length > 0 && (
            <div className="w-full lg:w-72 flex-shrink-0">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Tv size={12} />
                More World Cup Channels
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {others.map((ch) => (
                  <Link
                    key={ch.id}
                    href={`/watch/${ch.id}`}
                    className="group flex items-center gap-2 bg-black/30 hover:bg-black/50 border border-white/5 hover:border-yellow-500/30 rounded-xl p-3 transition-all"
                  >
                    <div className="relative w-8 h-8 flex-shrink-0 bg-black/50 rounded-lg overflow-hidden">
                      {ch.logo_url ? (
                        <Image
                          src={ch.logo_url}
                          alt={ch.title}
                          fill
                          sizes="32px"
                          className="object-contain"
                          unoptimized
                        />
                      ) : (
                        <span className="text-lg flex items-center justify-center h-full">📺</span>
                      )}
                    </div>
                    <span className="text-xs font-medium text-gray-300 group-hover:text-white truncate transition-colors">
                      {ch.title}
                    </span>
                  </Link>
                ))}
              </div>
              <Link
                href="/category/World%20Cup"
                className="mt-3 flex items-center justify-center gap-2 text-xs text-yellow-400 hover:text-yellow-300 transition-colors font-medium"
              >
                View all World Cup channels →
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
