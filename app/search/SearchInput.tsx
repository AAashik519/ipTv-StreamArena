"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";

interface Props {
  defaultValue?: string;
}

export default function SearchInput({ defaultValue = "" }: Props) {
  const [query, setQuery] = useState(defaultValue);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      startTransition(() => {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      });
    }
  }

  function clear() {
    setQuery("");
    router.push("/search");
  }

  return (
    <form onSubmit={handleSubmit} className="relative max-w-xl">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        {isPending ? (
          <Loader2 size={18} className="animate-spin text-[#e50914]" />
        ) : (
          <Search size={18} />
        )}
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search channels, categories…"
        className="w-full bg-[#1a1a1f] border border-[#2a2a35] text-white pl-11 pr-12 py-3.5 rounded-xl text-base focus:outline-none focus:border-[#e50914] transition-colors placeholder-gray-500"
        autoFocus
      />
      {query && (
        <button
          type="button"
          onClick={clear}
          className="absolute right-14 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
      )}
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#e50914] hover:bg-[#b81d24] text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
      >
        Go
      </button>
    </form>
  );
}
