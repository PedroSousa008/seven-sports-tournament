import Image from "next/image";
import { TOURNAMENT } from "@/lib/constants";

export function SiteLogo({
  logoUrl,
  className = "",
}: {
  logoUrl?: string | null;
  className?: string;
}) {
  if (logoUrl) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <Image
          src={logoUrl}
          alt={TOURNAMENT.name}
          width={120}
          height={40}
          className="h-10 w-auto max-w-[140px] object-contain object-left"
          priority
        />
        <div className="hidden min-w-0 sm:block">
          <p className="truncate text-sm font-semibold text-white">
            {TOURNAMENT.shortName}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <p className="font-display text-xs tracking-[0.35em] text-red-500">
        {TOURNAMENT.abbrev}
      </p>
      <p className="text-sm font-semibold text-white">{TOURNAMENT.shortName}</p>
    </div>
  );
}
