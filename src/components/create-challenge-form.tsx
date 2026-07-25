"use client";

import { useActionState, useState } from "react";
import { createChallenge, type ActionState } from "@/app/actions";

const initialState: ActionState = { success: false, message: "" };

function today(): string {
  return new Date().toISOString().split("T")[0];
}

function in3Months(): string {
  const d = new Date();
  d.setMonth(d.getMonth() + 3);
  return d.toISOString().split("T")[0];
}

export function CreateChallengeForm() {
  const [state, formAction, pending] = useActionState(createChallenge, initialState);
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center gap-2 min-h-12 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover transition-colors shadow-sm"
      >
        <svg className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Nouveau Challenge
      </button>
    );
  }

  return (
    <div className="p-5 rounded-xl bg-surface border border-border shadow-sm max-w-lg">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-semibold text-foreground">
          Créer un nouveau challenge
        </h3>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex items-center justify-center size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-sidebar-hover transition-colors"
          aria-label="Fermer"
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        {/* Message */}
        {state.message && (
          <div
            className={`flex items-center gap-2.5 p-3 rounded-lg text-sm ${
              state.success
                ? "bg-success/10 text-success border border-success/20"
                : "bg-destructive/10 text-destructive border border-destructive/20"
            }`}
            role="alert"
          >
            <svg className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              {state.success ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              )}
            </svg>
            <span>{state.message}</span>
          </div>
        )}

        {/* Nom */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="challenge_nom" className="text-sm font-medium text-foreground">
            Nom du challenge <span className="text-destructive">*</span>
          </label>
          <input
            id="challenge_nom"
            name="nom"
            type="text"
            required
            maxLength={200}
            placeholder="Ex: Défi été 2026"
            aria-invalid={!!state.errors?.nom}
            className="h-11 px-4 rounded-xl border border-input bg-surface text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors aria-[invalid=true]:border-destructive"
          />
          {state.errors?.nom && <p className="text-xs text-destructive">{state.errors.nom}</p>}
        </div>

        {/* Dates */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex flex-col gap-1.5">
            <label htmlFor="challenge_date_debut" className="text-sm font-medium text-foreground">
              Date de début <span className="text-destructive">*</span>
            </label>
            <input
              id="challenge_date_debut"
              name="date_debut"
              type="date"
              required
              defaultValue={today()}
              aria-invalid={!!state.errors?.date_debut}
              className="h-11 px-4 rounded-xl border border-input bg-surface text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors aria-[invalid=true]:border-destructive"
            />
            {state.errors?.date_debut && <p className="text-xs text-destructive">{state.errors.date_debut}</p>}
          </div>
          <div className="flex-1 flex flex-col gap-1.5">
            <label htmlFor="challenge_date_fin" className="text-sm font-medium text-foreground">
              Date de fin <span className="text-destructive">*</span>
            </label>
            <input
              id="challenge_date_fin"
              name="date_fin"
              type="date"
              required
              defaultValue={in3Months()}
              aria-invalid={!!state.errors?.date_fin}
              className="h-11 px-4 rounded-xl border border-input bg-surface text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors aria-[invalid=true]:border-destructive"
            />
            {state.errors?.date_fin && <p className="text-xs text-destructive">{state.errors.date_fin}</p>}
          </div>
        </div>

        {/* Boutons */}
        <div className="flex flex-col sm:flex-row-reverse gap-3 pt-2">
          <button
            type="submit"
            disabled={pending}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-11 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pending ? (
              <>
                <svg className="size-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" />
                </svg>
                Création…
              </>
            ) : (
              "Créer le challenge"
            )}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            disabled={pending}
            className="w-full sm:w-auto inline-flex items-center justify-center min-h-11 px-5 py-2.5 rounded-xl border border-input text-sm font-medium text-foreground hover:bg-sidebar-hover transition-colors"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}