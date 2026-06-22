import { cn } from "@/lib/utils";

const variants = {
  default: "bg-white/10 text-zinc-200",
  success: "bg-emerald-500/15 text-emerald-300",
  warning: "bg-amber-500/15 text-amber-300",
  danger: "bg-red-500/15 text-red-300",
  live: "bg-red-600 text-white animate-pulse",
  team: "bg-red-600 text-white",
  individual: "bg-zinc-700 text-zinc-200",
};

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
