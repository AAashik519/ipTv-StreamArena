"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, Tv, Menu, X, ChevronDown } from "lucide-react";
import { getAllCategories } from "@/lib/data";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const categories = getAllCategories();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setCategoryOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery("");
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0d0d0f]/95 backdrop-blur-md shadow-lg shadow-black/40"
          : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-[#e50914] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Tv size={18} className="text-white" />
            </div>
            <span className="text-xl font-black tracking-tight">
              Stream<span className="text-[#e50914]">Arena</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-[#e50914] ${
                pathname === "/" ? "text-[#e50914]" : "text-gray-300"
              }`}
            >
              Home
            </Link>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCategoryOpen(!categoryOpen)}
                className="flex items-center gap-1 text-sm font-medium text-gray-300 hover:text-[#e50914] transition-colors"
              >
                Categories <ChevronDown size={14} className={`transition-transform ${categoryOpen ? "rotate-180" : ""}`} />
              </button>
              {categoryOpen && (
                <div className="absolute top-8 left-0 bg-[#1a1a1f] border border-[#2a2a35] rounded-xl shadow-2xl p-2 min-w-[200px] grid grid-cols-2 gap-1 z-50">
                  {categories.map((cat) => (
                    <Link
                      key={cat}
                      href={`/category/${encodeURIComponent(cat)}`}
                      className="px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#e50914]/20 rounded-lg transition-colors"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/category/World%20Cup"
              className="flex items-center gap-1 text-sm font-semibold text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              🏆 World Cup 2026
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  ref={searchRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search channels..."
                  className="bg-[#1a1a1f] border border-[#2a2a35] text-white px-4 py-2 rounded-lg text-sm w-48 sm:w-64 focus:outline-none focus:border-[#e50914] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="ml-2 p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              aria-label="Menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#1a1a1f] border-t border-[#2a2a35] rounded-b-xl pb-4">
            <div className="px-4 pt-4 flex flex-col gap-1">
              <Link href="/" className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                🏠 Home
              </Link>
              <Link href="/category/World%20Cup" className="px-3 py-2 text-sm font-semibold text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors">
                🏆 World Cup 2026
              </Link>
              <div className="mt-2 mb-1 px-3 text-xs text-gray-500 uppercase tracking-wider">Categories</div>
              <div className="grid grid-cols-2 gap-1">
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    href={`/category/${encodeURIComponent(cat)}`}
                    className="px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
