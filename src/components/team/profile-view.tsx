import Image from "next/image";
import { TeamAvatar } from "@/components/ui/team-avatar";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { updateTeamPasswordAction, updateTeamProfileAction } from "@/lib/actions";
import { DEFAULT_TEAM_BANNER } from "@/lib/team-content";

type Team = {
  id: string;
  name: string;
  color: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  captainName: string;
  captainEmail: string;
  phone: string | null;
  userEmail: string;
};

export function ProfileView({ team }: { team: Team }) {
  const banner = team.bannerUrl || DEFAULT_TEAM_BANNER;

  return (
    <div className="space-y-8">
      <section className="relative min-h-[220px] overflow-hidden rounded-3xl border border-white/10">
        <Image src={banner} alt="" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="relative flex min-h-[220px] flex-col items-center justify-end pb-6 pt-16">
          <TeamAvatar
            name={team.name}
            color={team.color}
            logoUrl={team.logoUrl}
            size="lg"
          />
          <h1 className="font-display mt-4 text-3xl tracking-wide text-white">
            {team.name}
          </h1>
          <p className="text-sm text-zinc-400">{team.captainName} · Capitão</p>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="font-display text-xl text-white">Dados da equipa</h2>
        <form action={updateTeamProfileAction} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Nome da equipa</Label>
            <Input name="name" defaultValue={team.name} required />
          </div>
          <div>
            <Label>Capitão</Label>
            <Input name="captainName" defaultValue={team.captainName} required />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              name="email"
              type="email"
              defaultValue={team.userEmail}
              required
            />
          </div>
          <div>
            <Label>Telefone</Label>
            <Input name="phone" defaultValue={team.phone ?? ""} />
          </div>
          <div className="sm:col-span-2">
            <Label>URL do logótipo</Label>
            <Input name="logoUrl" defaultValue={team.logoUrl ?? ""} />
          </div>
          <div className="sm:col-span-2">
            <Label>URL do banner</Label>
            <Input name="bannerUrl" defaultValue={team.bannerUrl ?? ""} placeholder="/teams/banner.jpg" />
          </div>
          <Button type="submit" className="sm:col-span-2 sm:w-fit">
            Guardar alterações
          </Button>
        </form>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="font-display text-xl text-white">Palavra-passe</h2>
        <form
          action={async (formData) => {
            "use server";
            const password = String(formData.get("password") ?? "");
            if (password.length >= 6) {
              await updateTeamPasswordAction(password);
            }
          }}
          className="mt-4 flex max-w-md flex-col gap-3"
        >
          <Input
            name="password"
            type="password"
            placeholder="Nova palavra-passe"
            minLength={6}
            required
          />
          <Button type="submit" variant="secondary" className="w-fit">
            Atualizar palavra-passe
          </Button>
        </form>
      </section>
    </div>
  );
}
