"use client";

import type { FormEvent } from "react";

import { useState } from "react";
import { Button } from "@/components/Button";

export function AdminImportForm() {
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const form = e.currentTarget;
      const fd = new FormData(form);
      const res = await fetch("/api/admin/import", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "import_failed");
      setMsg(`Importado: ${data.groups} grupos, ${data.guests} convidados.`);
      form.reset();
    } catch {
      setMsg("Falha ao importar. Verifique o CSV e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <input
        name="file"
        type="file"
        accept=".csv,text/csv"
        className="block w-full text-sm"
        required
      />
      <Button disabled={loading} type="submit">
        {loading ? "Importando..." : "Importar CSV"}
      </Button>
      {msg ? <p className="text-sm text-charcoal/80">{msg}</p> : null}
      <p className="text-xs text-charcoal/60">
        Formato: label, deadline (YYYY-MM-DD), plus_one_allowed (true/false), guests (separados por ;)
      </p>
    </form>
  );
}
