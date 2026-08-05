"use client";

import { useActionState, useState, useCallback } from "react";
import { addDailyTracking, type DailyTrackingState } from "@/app/actions/daily-tracking";

const initialState: DailyTrackingState = { success: false, message: "" };

type Props = {
  participantId: string;
};

function formatDateForInput(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function DailyTrackingForm({ participantId }: Props) {
  const [state, dispatch, pending] = useActionState(
    useCallback(
      (prev: DailyTrackingState, formData: FormData) =>
        addDailyTracking(participantId, prev, formData),
      [participantId]
    ),
    initialState
  );

  // ─── Prévisualisation du score total ───
  const [fields, setFields] = useState({
    date: formatDateForInput(new Date()),
    score_petit_dej: "",
    score_dej: "",
    score_diner: "",
    score_hydratation: "",
    score_sport: "",
    note_sommeil: "",
    note_stress: "",
    poids_du_jour: "",
    tour_taille_du_jour: "",
  });

  const updateField = (name: string, value: string) => {
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const previewTotal = (() => {
    const pj = parseInt(fields.score_petit_dej) || 0;
    const dj = parseInt(fields.score_dej) || 0;
    const dn = parseInt(fields.score_diner) || 0;
    const hy = parseInt(fields.score_hydratation) || 0;
    const sp = parseInt(fields.score_sport) || 0;
    const nutrition = Math.round((pj + dj + dn) / 3);
    return nutrition + hy + sp;
  })();

  // Ces champs ne sont pas comptabilisés dans le score
  const hasExtras = fields.poids_du_jour || fields.tour_taille_du_jour;

  const previewColor =
    previewTotal >= 70
      ? "text-success"
      : previewTotal >= 50
        ? "text-warning"
        : "text-destructive";

  return (
    <form
      action={dispatch}
      onChange={(e) => {
        const target = e.target as unknown as HTMLInputElement;
        if (target.name) updateField(target.name, target.value);
      }}
      className="p-5 rounded-xl bg-surface border border-border shadow-sm"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-semibold text-foreground">
          Ajouter le suivi du jour
        </h3>
        {/* Aperçu du score total */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Score :</span>
          <span className={`text-lg font-bold ${previewColor}`}>
            {previewTotal}
          </span>
          <span className="text-muted-foreground text-xs">/100</span>
        </div>
      </div>

      {/* Message global */}
      {state.message && (
        <div
          className={`flex items-center gap-2.5 p-3 rounded-lg text-sm mb-4 ${
            state.success
              ? "bg-success/10 text-success border border-success/20"
              : "bg-destructive/10 text-destructive border border-destructive/20"
          }`}
          role="alert"
        >
          <svg
            className="size-5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            {state.success ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            )}
          </svg>
          <span>{state.message}</span>
        </div>
      )}

      {/* ─── Date ─── */}
      <div className="flex flex-col gap-1.5 mb-5">
        <label htmlFor="date" className="text-sm font-medium text-foreground">
          Date
        </label>
        <input
          id="date"
          name="date"
          type="date"
          required
          defaultValue={formatDateForInput(new Date())}
          className="w-full sm:w-48 h-11 px-4 rounded-xl border border-input bg-surface text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
        />
        {state.errors?.date && (
          <p className="text-xs text-destructive">{state.errors.date}</p>
        )}
      </div>

      {/* ─── Grille des scores ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
        {/* Petit-déjeuner */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="score_petit_dej" className="text-sm font-medium text-foreground">
            Petit-déjeuner <span className="text-muted-foreground text-xs">/40</span>
          </label>
          <input
            id="score_petit_dej"
            name="score_petit_dej"
            type="number"
            min={0}
            max={40}
            placeholder="0–40 (optionnel)"
            aria-invalid={!!state.errors?.score_petit_dej}
            className="h-11 px-4 rounded-xl border border-input bg-surface text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors aria-[invalid=true]:border-destructive"
          />
          {state.errors?.score_petit_dej && (
            <p className="text-xs text-destructive">{state.errors.score_petit_dej}</p>
          )}
        </div>

        {/* Déjeuner */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="score_dej" className="text-sm font-medium text-foreground">
            Déjeuner <span className="text-muted-foreground text-xs">/40</span>
          </label>
          <input
            id="score_dej"
            name="score_dej"
            type="number"
            min={0}
            max={40}
            placeholder="0–40 (optionnel)"
            aria-invalid={!!state.errors?.score_dej}
            className="h-11 px-4 rounded-xl border border-input bg-surface text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors aria-[invalid=true]:border-destructive"
          />
          {state.errors?.score_dej && (
            <p className="text-xs text-destructive">{state.errors.score_dej}</p>
          )}
        </div>

        {/* Dîner */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="score_diner" className="text-sm font-medium text-foreground">
            Dîner <span className="text-muted-foreground text-xs">/40</span>
          </label>
          <input
            id="score_diner"
            name="score_diner"
            type="number"
            min={0}
            max={40}
            placeholder="0–40 (optionnel)"
            aria-invalid={!!state.errors?.score_diner}
            className="h-11 px-4 rounded-xl border border-input bg-surface text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors aria-[invalid=true]:border-destructive"
          />
          {state.errors?.score_diner && (
            <p className="text-xs text-destructive">{state.errors.score_diner}</p>
          )}
        </div>

        {/* Hydratation */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="score_hydratation" className="text-sm font-medium text-foreground">
            Hydratation <span className="text-muted-foreground text-xs">/20</span>
          </label>
          <input
            id="score_hydratation"
            name="score_hydratation"
            type="number"
            min={0}
            max={20}
            placeholder="0–20 (optionnel)"
            aria-invalid={!!state.errors?.score_hydratation}
            className="h-11 px-4 rounded-xl border border-input bg-surface text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors aria-[invalid=true]:border-destructive"
          />
          {state.errors?.score_hydratation && (
            <p className="text-xs text-destructive">{state.errors.score_hydratation}</p>
          )}
        </div>

        {/* Sport */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="score_sport" className="text-sm font-medium text-foreground">
            Sport <span className="text-muted-foreground text-xs">/40</span>
          </label>
          <input
            id="score_sport"
            name="score_sport"
            type="number"
            min={0}
            max={40}
            placeholder="0–40 (optionnel)"
            aria-invalid={!!state.errors?.score_sport}
            className="h-11 px-4 rounded-xl border border-input bg-surface text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors aria-[invalid=true]:border-destructive"
          />
          {state.errors?.score_sport && (
            <p className="text-xs text-destructive">{state.errors.score_sport}</p>
          )}
        </div>

        {/* Note Sommeil (optionnel) */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="note_sommeil" className="text-sm font-medium text-foreground">
            Sommeil <span className="text-muted-foreground text-xs">(optionnel) /10</span>
          </label>
          <input
            id="note_sommeil"
            name="note_sommeil"
            type="number"
            min={0}
            max={10}
            placeholder="0–10"
            aria-invalid={!!state.errors?.note_sommeil}
            className="h-11 px-4 rounded-xl border border-input bg-surface text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors aria-[invalid=true]:border-destructive"
          />
          {state.errors?.note_sommeil && (
            <p className="text-xs text-destructive">{state.errors.note_sommeil}</p>
          )}
        </div>

        {/* Note Stress (optionnel) */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="note_stress" className="text-sm font-medium text-foreground">
            Stress <span className="text-muted-foreground text-xs">(optionnel) /10</span>
          </label>
          <input
            id="note_stress"
            name="note_stress"
            type="number"
            min={0}
            max={10}
            placeholder="0–10"
            aria-invalid={!!state.errors?.note_stress}
            className="h-11 px-4 rounded-xl border border-input bg-surface text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors aria-[invalid=true]:border-destructive"
          />
          {state.errors?.note_stress && (
            <p className="text-xs text-destructive">{state.errors.note_stress}</p>
          )}
        </div>
      </div>

      {/* ─── Séparateur ─── */}
      <div className="border-t border-border pt-4 mb-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Données du jour <span className="text-xs font-normal normal-case">(non comptabilisées dans le score)</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Poids du jour */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="poids_du_jour" className="text-sm font-medium text-foreground">
              Poids <span className="text-muted-foreground text-xs">(optionnel)</span>
            </label>
            <div className="relative max-w-40">
              <input
                id="poids_du_jour"
                name="poids_du_jour"
                type="number"
                step="0.1"
                min={0.1}
                max={999.99}
                placeholder="Ex: 74.5"
                aria-invalid={!!state.errors?.poids_du_jour}
                className="w-full h-11 px-4 pr-8 rounded-xl border border-input bg-surface text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors aria-[invalid=true]:border-destructive"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">kg</span>
            </div>
            {state.errors?.poids_du_jour && (
              <p className="text-xs text-destructive">{state.errors.poids_du_jour}</p>
            )}
          </div>

          {/* Tour de taille du jour */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="tour_taille_du_jour" className="text-sm font-medium text-foreground">
              Tour de taille <span className="text-muted-foreground text-xs">(optionnel)</span>
            </label>
            <div className="relative max-w-40">
              <input
                id="tour_taille_du_jour"
                name="tour_taille_du_jour"
                type="number"
                min={1}
                max={300}
                placeholder="Ex: 83"
                aria-invalid={!!state.errors?.tour_taille_du_jour}
                className="w-full h-11 px-4 pr-8 rounded-xl border border-input bg-surface text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors aria-[invalid=true]:border-destructive"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">cm</span>
            </div>
            {state.errors?.tour_taille_du_jour && (
              <p className="text-xs text-destructive">{state.errors.tour_taille_du_jour}</p>
            )}
          </div>
        </div>
      </div>

      {/* ─── Bouton ─── */}
      <button
        type="submit"
        disabled={pending}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-12 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? (
          <>
            <svg className="size-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" />
            </svg>
            Enregistrement…
          </>
        ) : (
          <>
            <svg className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            Enregistrer le suivi
          </>
        )}
      </button>
    </form>
  );
}