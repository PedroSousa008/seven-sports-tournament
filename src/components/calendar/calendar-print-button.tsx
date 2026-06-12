"use client";

import { Download } from "lucide-react";

export function CalendarPrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-lg"
    >
      <Download className="h-4 w-4" />
      Descarregar PDF
    </button>
  );
}
