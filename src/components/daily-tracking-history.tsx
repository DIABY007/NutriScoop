"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { DailyTracking } from "@/types";
import { deleteDailyTracking } from "@/app/actions/daily-tracking";
import { EditDailyTrackingModal } from "@/components/edit-daily-tracking-modal";

type Props = {
  entries: DailyTracking[];
};

function getScoreColor(score: number): string {
  if (score >= 70) return "text-success bg-success/10";
  if (score >= 50) return "text-warning bg-warning/10";
  return "text-destructive bg-destructive/10";
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function DeleteButton({ entryId, participantId }: { entryId: string; participantId: string }) {
  const [pending, setPending] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setPending(true);
    try {
      await deleteDailyTracking(entryId, participantId);
      router.refresh();
    } catch {
      setPending(false);
      setConfirm(false);
    }
  };

  if (confirm) {
    return (
      <div className="flex items-center gap-1">
        <button
          type="button" onClick={handleDelete} disabled={pending}
          className="text-xs font-medium text-destructive hover:text-destructive/80 transition-colors px-1.5 py-1"
        >
          {pending ? "..." : "Oui"}
        </button>
        <button
          type="button" onClick={() => setConfirm(false)} disabled={pending}
          className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-1.5 py-1"
        >
          Non
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirm(true)}
      className="text-muted-foreground/40 hover:text-destructive transition-colors p-1"
      title="Supprimer"
    >
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
      </svg>
    </button>
  );
}

export function DailyTrackingHistory({ entries }: Props) {
  const [editingEntry, setEditingEntry] = useState<DailyTracking | null>(null);

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 rounded-2xl bg-surface border border-dashed border-border text-center">
        <svg className="size-10 text-muted-foreground/30 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
        </svg>
        <p className="text-sm text-muted">Aucun suivi enregistré pour le moment.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">Date</th>
              <th className="text-center px-3 py-3 font-medium text-muted-foreground whitespace-nowrap" title="Petit-déjeuner /40">P. Déj</th>
              <th className="text-center px-3 py-3 font-medium text-muted-foreground whitespace-nowrap" title="Déjeuner /40">Déj</th>
              <th className="text-center px-3 py-3 font-medium text-muted-foreground whitespace-nowrap" title="Dîner /40">Dîner</th>
              <th className="text-center px-3 py-3 font-medium text-muted-foreground whitespace-nowrap" title="Hydratation /20">Hydra.</th>
              <th className="text-center px-3 py-3 font-medium text-muted-foreground whitespace-nowrap" title="Sport /40">Sport</th>
              <th className="text-center px-3 py-3 font-medium text-muted-foreground whitespace-nowrap" title="Note sommeil /10">💤</th>
              <th className="text-center px-3 py-3 font-medium text-muted-foreground whitespace-nowrap" title="Note stress /10">😰</th>
              <th className="text-center px-3 py-3 font-medium text-muted-foreground whitespace-nowrap">Total</th>
              <th className="text-center px-3 py-3 font-medium text-muted-foreground whitespace-nowrap" title="Poids du jour">⚖️</th>
              <th className="text-center px-3 py-3 font-medium text-muted-foreground whitespace-nowrap" title="Tour de taille du jour">📏</th>
              <th className="text-center px-3 py-3 font-medium text-muted-foreground whitespace-nowrap w-16">Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={entry.id}
                className={`border-b border-border/50 transition-colors hover:bg-muted/20 ${index === entries.length - 1 ? "border-b-0" : ""}`}
              >
                <td className="px-4 py-3 text-foreground font-medium whitespace-nowrap">{formatDate(entry.date)}</td>
                <td className="px-3 py-3 text-center text-foreground tabular-nums">{entry.score_petit_dej ?? "—"}</td>
                <td className="px-3 py-3 text-center text-foreground tabular-nums">{entry.score_dej ?? "—"}</td>
                <td className="px-3 py-3 text-center text-foreground tabular-nums">{entry.score_diner ?? "—"}</td>
                <td className="px-3 py-3 text-center text-foreground tabular-nums">{entry.score_hydratation ?? "—"}</td>
                <td className="px-3 py-3 text-center text-foreground tabular-nums">{entry.score_sport ?? "—"}</td>
                <td className="px-3 py-3 text-center text-muted-foreground tabular-nums">{entry.note_sommeil ?? "—"}</td>
                <td className="px-3 py-3 text-center text-muted-foreground tabular-nums">{entry.note_stress ?? "—"}</td>
                <td className="px-3 py-3 text-center">
                  <span className={`inline-flex items-center justify-center min-w-10 px-2 py-1 rounded-lg text-xs font-bold ${getScoreColor(entry.score_total)}`}>
                    {entry.score_total}
                  </span>
                </td>
                <td className="px-3 py-3 text-center text-muted-foreground tabular-nums text-xs">
                  {entry.poids_du_jour ? `${entry.poids_du_jour} kg` : "—"}
                </td>
                <td className="px-3 py-3 text-center text-muted-foreground tabular-nums text-xs">
                  {entry.tour_taille_du_jour ? `${entry.tour_taille_du_jour} cm` : "—"}
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center justify-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => setEditingEntry(entry)}
                      className="text-muted-foreground/40 hover:text-primary transition-colors p-1"
                      title="Modifier"
                    >
                      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>
                    </button>
                    <DeleteButton entryId={entry.id} participantId={entry.participant_id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal d'édition */}
      {editingEntry && (
        <EditDailyTrackingModal
          entry={editingEntry}
          onClose={() => setEditingEntry(null)}
        />
      )}
    </>
  );
}