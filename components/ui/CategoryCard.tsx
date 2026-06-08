import Link from "next/link";
import { CategoryInfo } from "@/lib/types";
import { Tv } from "lucide-react";

interface Props {
  category: CategoryInfo;
}

export default function CategoryCard({ category }: Props) {
  return (
    <Link
      href={`/category/${encodeURIComponent(category.name)}`}
      className={`group relative rounded-xl border border-[#2a2a35] overflow-hidden bg-gradient-to-br ${category.color} hover:border-[#e50914]/40 transition-all duration-300 hover:scale-[1.04] hover:-translate-y-1 block`}
    >
      <div className="p-5 flex flex-col gap-3">
        <span className="text-3xl">{category.icon}</span>
        <div>
          <h3 className="font-bold text-white text-sm group-hover:text-[#e50914] transition-colors">
            {category.name}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
            <Tv size={10} />
            {category.count} channels
          </p>
        </div>
      </div>
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ring-1 ring-[#e50914]/30" />
    </Link>
  );
}
