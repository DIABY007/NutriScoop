"use client";

import { useActionState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { updateDailyTracking, type DailyTrackingState } from "@/app/actions/daily-tracking";
import type { DailyTracking } from "@/types";

const initialState: DailyTrackingState = { success: false, message: "" };

type Props = {
  entry: DailyTracking;
  onClose: () => void;
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toISOString().split("T")[0];
}

export function EditDailyTrackingModal({ entry, onClose }: Props) {
  const router = useRouter();

  const action = useCallback(
    (prev: DailyTrackingState, formData: FormData) =>
      updateDailyTracking(entry.id, entry.participant_id, prev, formData),
    [entry.id, entry.participant_id]
  );

  const [state, formAction, pending] = useActionState(action, initialState);

  // Fermer et rafraîchir après succès
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await updateDailyTracking(entry.id, entry.participant_id, initialState, formData);
    if (result.success) {
      onClose();
      router.refresh();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-surface rounded-2xl shadow-xl border border-border max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-surface z-10">
          <h2 className="text-base font-semibold text-foreground">
            Modifier le suivi du {new Date(entry.date).toLocaleDateString("fr-FR")}
          </h2>
          <button type="button" onClick={onClose}
            className="flex items-center justify-center size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-sidebar-hover transition-colors"
            aria-label="Fermer"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {state.message && !state.success && (
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm" role="alert">
              <svg className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
              <span>{state.message}</span>
            </div>
          )}

          {/* Date */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="edit_date" className="text-sm font-medium">Date</label>
            <input id="edit_date" name="date" type="date" required
              defaultValue={formatDate(entry.date)}
              className="h-11 px-4 rounded-xl border border-input bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors max-w-48" />
          </div>

          {/* Grille des scores */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="edit_petit_dej" className="text-xs font-medium">P. Déj /40</label>
              <input id="edit_petit_dej" name="score_petit_dej" type="number" required min={0} max={40}
                defaultValue={entry.score_petit_dej ?? 0}
                className="h-10 px-3 rounded-xl border border-input bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="edit_dej" className="text-xs font-medium">Déj /40</label>
              <input id="edit_dej" name="score_dej" type="number" required min={0} max={40}
                defaultValue={entry.score_dej ?? 0}
                className="h-10 px-3 rounded-xl border border-input bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="edit_diner" className="text-xs font-medium">Dîner /40</label>
              <input id="edit_diner" name="score_diner" type="number" required min={0} max={40}
                defaultValue={entry.score_diner ?? 0}
                className="h-10 px-3 rounded-xl border border-input bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="edit_hydratation" className="text-xs font-medium">Hydra. /20</label>
              <input id="edit_hydratation" name="score_hydratation" type="number" required min={0} max={20}
                defaultValue={entry.score_hydratation ?? 0}
                className="h-10 px-3 rounded-xl border border-input bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="edit_sport" className="text-xs font-medium">Sport /40</label>
              <input id="edit_sport" name="score_sport" type="number" required min={0} max={40}
                defaultValue={entry.score_sport ?? 0}
                className="h-10 px-3 rounded-xl border border-input bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="edit_sommeil" className="text-xs font-medium">💤 /10</label>
              <input id="edit_sommeil" name="note_sommeil" type="number" min={0} max={10}
                defaultValue={entry.note_sommeil ?? ""}
                className="h-10 px-3 rounded-xl border border-input bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="edit_stress" className="text-xs font-medium">😰 /10</label>
              <input id="edit_stress" name="note_stress" type="number" min={0} max={10}
                defaultValue={entry.note_stress ?? ""}
                className="h-10 px-3 rounded-xl border border-input bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="edit_poids" className="text-xs font-medium">Poids (kg)</label>
              <input id="edit_poids" name="poids_du_jour" type="number" step="0.1" min={0.1} max={999.99}
                defaultValue={entry.poids_du_jour ?? ""}
                className="h-10 px-3 rounded-xl border border-input bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="edit_tour_taille" className="text-xs font-medium">Tour taille (cm)</label>
              <input id="edit_tour_taille" name="tour_taille_du_jour" type="number" min={1} max={300}
                defaultValue={entry.tour_taille_du_jour ?? ""}
                className="h-10 px-3 rounded-xl border border-input bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>
          </div>

          {/* Boutons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-border mt-2">
            <button type="button" onClick={onClose}
              className="min-h-11 px-5 py-2.5 rounded-xl border border-input text-sm font-medium text-foreground hover:bg-sidebar-hover transition-colors"
            >
              Annuler
            </button>
            <button type="submit" disabled={pending}
              className="inline-flex items-center justify-center gap-2 min-h-11 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-50"
            >
              {pending ? (
                <><svg className="size-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" /></svg>Modification…</>
              ) : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}