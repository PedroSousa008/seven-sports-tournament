import { PageHeader } from "@/components/layout/page-header";
import { OwnerRankingsManager } from "@/components/owner/owner-rankings-manager";
import { getOwnerRankingsData } from "@/lib/owner-rankings";

export default async function OwnerRankingsPage() {
  const data = await getOwnerRankingsData();

  return (
    <div>
      <PageHeader
        title="Classificações"
        description="Atribui posições finais, pontos e equipas por desporto. O ranking global atualiza automaticamente."
      />
      <OwnerRankingsManager data={data} />
    </div>
  );
}
