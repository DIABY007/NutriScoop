"use client";

import { useActionState, useCallback } from "react";
import Link from "next/link";
import { updateChallenge, type ActionState } from "@/app/actions";
import type { Challenge } from "@/types";

const initialState: ActionState = { success: false, message: "" };

type Props = {
  challenge: Challenge;
};

export function EditChallengeForm({ challenge }: Props) {
  const action = useCallback(
    (prev: ActionState, formData: FormData) =>
      updateChallenge(challenge.id, prev, formData),
    [challenge.id]
  );

  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state.message && !state.success && (
        <div className="flex items-center gap-2.5 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm" role="alert">
          <svg className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          <span>{state.message}</span>
        </div>
      )}

      {/* Nom */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="nom" className="text-sm font-medium text-foreground">
          Nom du challenge <span className="text-destructive">*</span>
        </label>
        <input
          id="nom" name="nom" type="text" required maxLength={200}
          defaultValue={challenge.nom}
          aria-invalid={!!state.errors?.nom}
          className="h-11 px-4 rounded-xl border border-input bg-surface text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors aria-[invalid=true]:border-destructive"
        />
        {state.errors?.nom && <p className="text-xs text-destructive">{state.errors.nom}</p>}
      </div>

      {/* Dates */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex flex-col gap-1.5">
          <label htmlFor="date_debut" className="text-sm font-medium text-foreground">
            Date de début <span className="text-destructive">*</span>
          </label>
          <input
            id="date_debut" name="date_debut" type="date" required
            defaultValue={challenge.date_debut}
            aria-invalid={!!state.errors?.date_debut}
            className="h-11 px-4 rounded-xl border border-input bg-surface text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors aria-[invalid=true]:border-destructive"
          />
          {state.errors?.date_debut && <p className="text-xs text-destructive">{state.errors.date_debut}</p>}
        </div>
        <div className="flex-1 flex flex-col gap-1.5">
          <label htmlFor="date_fin" className="text-sm font-medium text-foreground">
            Date de fin <span className="text-destructive">*</span>
          </label>
          <input
            id="date_fin" name="date_fin" type="date" required
            defaultValue={challenge.date_fin}
            aria-invalid={!!state.errors?.date_fin}
            className="h-11 px-4 rounded-xl border border-input bg-surface text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors aria-[invalid=true]:border-destructive"
          />
          {state.errors?.date_fin && <p className="text-xs text-destructive">{state.errors.date_fin}</p>}
        </div>
      </div>

      {/* Statut */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="statut" className="text-sm font-medium text-foreground">
          Statut <span className="text-destructive">*</span>
        </label>
        <select
          id="statut" name="statut" required
          defaultValue={challenge.statut}
          aria-invalid={!!state.errors?.statut}
          className="h-11 px-4 rounded-xl border border-input bg-surface text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors aria-[invalid=true]:border-destructive"
        >
          <option value="actif">Actif</option>
          <option value="termine">Terminé</option>
        </select>
        {state.errors?.statut && <p className="text-xs text-destructive">{state.errors.statut}</p>}
      </div>

      {/* Boutons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          type="submit" disabled={pending}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-12 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending ? (
            <><svg className="size-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" /></svg>Enregistrement…</>
          ) : (
            <><svg className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>Enregistrer les modifications</>
          )}
        </button>
        <Link
          href={`/challenge/${challenge.id}`}
          className="w-full sm:w-auto inline-flex items-center justify-center min-h-12 px-6 py-3 rounded-xl border border-input text-sm font-medium text-foreground hover:bg-sidebar-hover transition-colors"
        >
          Annuler
        </Link>
      </div>
    </form>
  );
}