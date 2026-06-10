"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTeamAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { paymentStatusLabels } from "@/lib/labels";

export function CreateTeamForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(formData: FormData) {
    setLoading(true);
    try {
      await createTeamAction(formData);
      router.refresh();
      (document.getElementById("create-team-form") as HTMLFormElement)?.reset();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form id="create-team-form" action={onSubmit} className="grid gap-4 md:grid-cols-2">
      <div>
        <Label>Nome da equipa</Label>
        <Input name="name" required />
      </div>
      <div>
        <Label>Nome do capitão</Label>
        <Input name="captainName" required />
      </div>
      <div>
        <Label>Email do capitão (acesso)</Label>
        <Input name="captainEmail" type="email" required />
      </div>
      <div>
        <Label>Palavra-passe de acesso</Label>
        <Input name="password" type="text" required />
      </div>
      <div>
        <Label>Telefone</Label>
        <Input name="phone" />
      </div>
      <div>
        <Label>Cor da equipa</Label>
        <Input name="color" type="color" defaultValue="#DC2626" />
      </div>
      <div>
        <Label>Estado de pagamento</Label>
        <Select name="paymentStatus" defaultValue="UNPAID">
          <option value="UNPAID">{paymentStatusLabels.UNPAID}</option>
          <option value="PARTIAL">{paymentStatusLabels.PARTIAL}</option>
          <option value="PAID">{paymentStatusLabels.PAID}</option>
        </Select>
      </div>
      <div className="md:col-span-2">
        <Button type="submit" disabled={loading}>
          {loading ? "A criar..." : "Criar conta de equipa"}
        </Button>
      </div>
    </form>
  );
}
