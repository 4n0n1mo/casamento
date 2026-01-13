"use client";

import { useState } from "react";
import { Button } from "@/components/Button";

export function AdminRegenerateTokenButton({ groupId }: { groupId: string }) {
  const [loading, setLoading] = useState(false);

  async function regen() {
    if (!confirm("Gerar novo token? O token antigo deixará de funcionar.")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/regenerate-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId })
      });
      if (!res.ok) throw new Error("failed");
      window.location.reload();
    } catch {
      alert("Falha ao regenerar token.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button type="button" variant="ghost" onClick={regen} disabled={loading}>
      {loading ? "Gerando..." : "Regenerar token"}
    </Button>
  );
}
