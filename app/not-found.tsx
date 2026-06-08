import Link from "next/link";
import { Tv, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 bg-[#1a1a1f] border border-[#2a2a35] rounded-2xl flex items-center justify-center mb-6">
        <Tv size={40} className="text-gray-500" />
      </div>
      <h1 className="text-5xl font-black text-white mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-300 mb-3">Channel Not Found</h2>
      <p className="text-gray-500 mb-8 max-w-md">
        The channel or page you&apos;re looking for doesn&apos;t exist or may have been removed.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/"
          className="flex items-center gap-2 bg-[#e50914] hover:bg-[#b81d24] text-white px-6 py-3 rounded-xl font-semibold transition-colors"
        >
          <Home size={18} />
          Back to Home
        </Link>
        <Link
          href="/search"
          className="flex items-center gap-2 bg-[#1a1a1f] hover:bg-[#252530] border border-[#2a2a35] text-white px-6 py-3 rounded-xl font-semibold transition-colors"
        >
          <Search size={18} />
          Search Channels
        </Link>
      </div>
    </div>
  );
}
