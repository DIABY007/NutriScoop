"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createSuiviNutritionnel, type ActionState } from "@/app/actions/suivi-nutritionnel";

export function NouveauSuiviForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    createSuiviNutritionnel,
    { success: false, message: "" }
  );

  return (
    <form action={formAction} className="space-y-6">
      {/* ─── Nom du dossier ─── */}
      <div>
        <label htmlFor="nom" className="block text-sm font-medium text-foreground mb-1.5">
          Nom du dossier
        </label>
        <input
          id="nom"
          name="nom"
          type="text"
          required
          placeholder="Ex: Suivi Cabinet Aurore AgroVital"
          className="block w-full min-h-11 px-4 py-2.5 rounded-xl bg-surface border border-border text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 transition-shadow"
        />
        {state.errors?.nom && (
          <p className="mt-1 text-xs text-destructive">{state.errors.nom}</p>
        )}
      </div>

      {/* ─── Message d'erreur global ─── */}
      {!state.success && state.message && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      {/* ─── Actions ─── */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Link
          href="/suivi-nutritionnel"
          className="inline-flex items-center justify-center min-h-11 px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-sidebar-hover transition-colors"
        >
          Annuler
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 min-h-11 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover active:scale-[0.97] transition-all duration-150 ease-out shadow-sm disabled:opacity-50 disabled:pointer-events-none"
        >
          {pending ? (
            <>
              <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Création…
            </>
          ) : (
            "Créer le dossier"
          )}
        </button>
      </div>
    </form>
  );
}