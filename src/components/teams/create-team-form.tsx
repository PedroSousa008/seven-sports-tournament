"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTeamAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";

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
        <Label>Team name</Label>
        <Input name="name" required />
      </div>
      <div>
        <Label>Captain name</Label>
        <Input name="captainName" required />
      </div>
      <div>
        <Label>Captain email (login)</Label>
        <Input name="captainEmail" type="email" required />
      </div>
      <div>
        <Label>Login password</Label>
        <Input name="password" type="text" required />
      </div>
      <div>
        <Label>Phone</Label>
        <Input name="phone" />
      </div>
      <div>
        <Label>Team color</Label>
        <Input name="color" type="color" defaultValue="#DC2626" />
      </div>
      <div>
        <Label>Payment status</Label>
        <Select name="paymentStatus" defaultValue="UNPAID">
          <option value="UNPAID">Unpaid</option>
          <option value="PARTIAL">Partially paid</option>
          <option value="PAID">Paid</option>
        </Select>
      </div>
      <div className="md:col-span-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create team account"}
        </Button>
      </div>
    </form>
  );
}
