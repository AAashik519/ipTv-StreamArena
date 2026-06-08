import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Props {
  title: string;
  icon?: string;
  href?: string;
  subtitle?: string;
}

export default function SectionHeader({ title, icon, href, subtitle }: Props) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          {icon && <span>{icon}</span>}
          {title}
        </h2>
        {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-sm text-[#e50914] hover:text-red-400 transition-colors font-medium"
        >
          See all <ChevronRight size={16} />
        </Link>
      )}
    </div>
  );
}
