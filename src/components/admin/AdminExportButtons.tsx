"use client";

import { Button } from "@/components/Button";

export function AdminExportButtons() {
  return (
    <div className="flex flex-wrap gap-3">
      <a href="/api/admin/export/tokens" download>
        <Button type="button" variant="secondary">Exportar tokens (CSV)</Button>
      </a>
      <a href="/api/admin/export/rsvp" download>
        <Button type="button" variant="primary">Exportar RSVP (CSV)</Button>
      </a>
    </div>
  );
}
