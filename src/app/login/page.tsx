"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { TOURNAMENT } from "@/lib/constants";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError("Email ou palavra-passe inválidos.");
      return;
    }
    window.location.href = "/login/redirect";
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-500">
            {TOURNAMENT.name}
          </p>
          <h1 className="mt-3 text-3xl font-bold text-white">Iniciar sessão</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Acesso de organizador ou capitão de equipa
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Iniciar sessão</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="capitao@equipa.com"
                  required
                />
              </div>
              <div>
                <Label>Palavra-passe</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error ? <p className="text-sm text-red-400">{error}</p> : null}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "A iniciar sessão..." : "Iniciar sessão"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-zinc-500">
          <Link href="/" className="hover:text-white">
            Voltar à página inicial
          </Link>
        </p>
      </div>
    </div>
  );
}
