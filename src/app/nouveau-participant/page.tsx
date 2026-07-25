"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createParticipant, type ActionState } from "@/app/actions";

const initialState: ActionState = { success: false, message: "" };

export default function NouveauParticipantPage() {
  const [state, formAction, pending] = useActionState(createParticipant, initialState);

  return (
    <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      {/* ─── En-tête ─── */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-4 min-h-11"
        >
          <svg
            className="size-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Retour au tableau de bord
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Nouveau Participant
        </h1>
        <p className="mt-1 text-sm text-muted">
          Ajoutez un participant pour débuter son suivi nutritionnel et sportif.
        </p>
      </div>

      {/* ─── Formulaire ─── */}
      <div className="w-full max-w-lg">
        <form action={formAction} className="flex flex-col gap-6">
          {/* Message d'erreur global */}
          {state.message && !state.success && (
            <div className="flex items-center gap-2.5 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm" role="alert">
              <svg className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              <span>{state.message}</span>
            </div>
          )}

          {/* Nom & Prénom (ligne desktop) */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Nom */}
            <div className="flex-1 flex flex-col gap-1.5">
              <label htmlFor="nom" className="text-sm font-medium text-foreground">
                Nom <span className="text-destructive" aria-hidden="true">*</span>
              </label>
              <input
                id="nom"
                name="nom"
                type="text"
                required
                maxLength={100}
                placeholder="Ex: Dupont"
                aria-invalid={!!state.errors?.nom}
                className="h-11 px-4 rounded-xl border border-input bg-surface text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors aria-[invalid=true]:border-destructive aria-[invalid=true]:focus:ring-destructive/30"
              />
              {state.errors?.nom && (
                <p className="text-xs text-destructive">{state.errors.nom}</p>
              )}
            </div>

            {/* Prénom */}
            <div className="flex-1 flex flex-col gap-1.5">
              <label htmlFor="prenom" className="text-sm font-medium text-foreground">
                Prénom <span className="text-destructive" aria-hidden="true">*</span>
              </label>
              <input
                id="prenom"
                name="prenom"
                type="text"
                required
                maxLength={100}
                placeholder="Ex: Jean"
                aria-invalid={!!state.errors?.prenom}
                className="h-11 px-4 rounded-xl border border-input bg-surface text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors aria-[invalid=true]:border-destructive aria-[invalid=true]:focus:ring-destructive/30"
              />
              {state.errors?.prenom && (
                <p className="text-xs text-destructive">{state.errors.prenom}</p>
              )}
            </div>
          </div>

          {/* Âge */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="age" className="text-sm font-medium text-foreground">
              Âge <span className="text-destructive" aria-hidden="true">*</span>
            </label>
            <input
              id="age"
              name="age"
              type="number"
              required
              min={1}
              max={150}
              placeholder="Ex: 30"
              aria-invalid={!!state.errors?.age}
              className="h-11 px-4 rounded-xl border border-input bg-surface text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors aria-[invalid=true]:border-destructive aria-[invalid=true]:focus:ring-destructive/30 max-w-32"
            />
            {state.errors?.age && (
              <p className="text-xs text-destructive">{state.errors.age}</p>
            )}
          </div>

          {/* Sexe */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="sexe" className="text-sm font-medium text-foreground">
              Sexe <span className="text-destructive" aria-hidden="true">*</span>
            </label>
            <select
              id="sexe"
              name="sexe"
              required
              defaultValue=""
              aria-invalid={!!state.errors?.sexe}
              className="h-11 px-4 rounded-xl border border-input bg-surface text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors aria-[invalid=true]:border-destructive aria-[invalid=true]:focus:ring-destructive/30"
            >
              <option value="" disabled>Sélectionner…</option>
              <option value="homme">Homme</option>
              <option value="femme">Femme</option>
              <option value="autre">Autre</option>
            </select>
            {state.errors?.sexe && (
              <p className="text-xs text-destructive">{state.errors.sexe}</p>
            )}
          </div>

          {/* Poids initial */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="poids_initial" className="text-sm font-medium text-foreground">
              Poids initial <span className="text-destructive" aria-hidden="true">*</span>
            </label>
            <div className="relative max-w-40">
              <input
                id="poids_initial"
                name="poids_initial"
                type="number"
                required
                step="0.01"
                min={0.1}
                max={999.99}
                placeholder="Ex: 75.5"
                aria-invalid={!!state.errors?.poids_initial}
                className="w-full h-11 px-4 pr-10 rounded-xl border border-input bg-surface text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors aria-[invalid=true]:border-destructive aria-[invalid=true]:focus:ring-destructive/30"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                kg
              </span>
            </div>
            {state.errors?.poids_initial && (
              <p className="text-xs text-destructive">{state.errors.poids_initial}</p>
            )}
          </div>

          {/* Objectif */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="objectif" className="text-sm font-medium text-foreground">
              Objectif <span className="text-muted-foreground text-xs">(optionnel)</span>
            </label>
            <textarea
              id="objectif"
              name="objectif"
              rows={3}
              maxLength={500}
              placeholder="Ex: Perte de poids, prise de masse, amélioration générale…"
              className="w-full px-4 py-2.5 rounded-xl border border-input bg-surface text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
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
                  Enregistrer le participant
                </>
              )}
            </button>
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center min-h-12 px-6 py-3 rounded-xl border border-input text-sm font-medium text-foreground hover:bg-sidebar-hover transition-colors"
            >
              Annuler
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}