import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { ChevronRight, Trophy } from "lucide-react";

export default async function TeamSportsPage() {
  const sports = await prisma.sport.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <PageHeader
        title="Sports"
        description="View rules, groups, matches and rankings for each sport."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {sports.map((sport) => (
          <Link key={sport.id} href={`/team/sports/${sport.slug}`}>
            <Card className="transition hover:border-red-500/40">
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-red-500/10 p-3 text-red-500">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">{sport.name}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-zinc-400">
                      {sport.format}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-zinc-500" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
