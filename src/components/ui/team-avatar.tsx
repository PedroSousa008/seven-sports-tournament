import { cn } from "@/lib/utils";

export function TeamAvatar({
  name,
  color = "#DC2626",
  logoUrl,
  size = "md",
}: {
  name: string;
  color?: string;
  logoUrl?: string | null;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-lg",
  };

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={name}
        className={cn("rounded-xl object-cover", sizes[size])}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-xl font-bold text-white",
        sizes[size]
      )}
      style={{ backgroundColor: color }}
    >
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}
