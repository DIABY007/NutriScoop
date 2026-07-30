"use client";

import { Suspense } from "react";
import { useActionState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createParticipant, type ActionState } from "@/app/actions";

const initialState: ActionState = { success: false, message: "" };

function NouveauParticipantForm() {
  const searchParams = useSearchParams();
  const challengeId = searchParams.get("challenge_id") || "";

  const action = useCallback(
    (prev: ActionState, formData: FormData) =>
      createParticipant(challengeId, prev, formData),
    [challengeId]
  );

  const [state, formAction, pending] = useActionState(action, initialState);

  if (!challengeId) {
    return (
      <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <svg className="size-12 text-destructive/60 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <h2 className="text-lg font-semibold text-foreground mb-1">Challenge requis</h2>
          <p className="text-sm text-muted mb-6">Veuillez sélectionner un challenge avant d&apos;ajouter un participant.</p>
          <Link href="/" className="inline-flex items-center justify-center gap-2 min-h-11 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover transition-colors">
            Retour aux challenges
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      <div className="mb-8">
        <Link href={`/challenge/${challengeId}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-4 min-h-11"
        >
          <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Retour au challenge
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Nouveau Participant</h1>
        <p className="mt-1 text-sm text-muted">Ajoutez un participant au challenge pour débuter son suivi.</p>
      </div>

      <div className="w-full max-w-lg">
        <form action={formAction} className="flex flex-col gap-6">
          {state.message && !state.success && (
            <div className="flex items-center gap-2.5 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm" role="alert">
              <svg className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              <span>{state.message}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex flex-col gap-1.5">
              <label htmlFor="nom" className="text-sm font-medium text-foreground">Nom <span className="text-destructive">*</span></label>
              <input id="nom" name="nom" type="text" required maxLength={100} placeholder="Ex: Dupont"
                aria-invalid={!!state.errors?.nom}
                className="h-11 px-4 rounded-xl border border-input bg-surface text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors aria-[invalid=true]:border-destructive"
              />
              {state.errors?.nom && <p className="text-xs text-destructive">{state.errors.nom}</p>}
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <label htmlFor="prenom" className="text-sm font-medium text-foreground">Prénom <span className="text-destructive">*</span></label>
              <input id="prenom" name="prenom" type="text" required maxLength={100} placeholder="Ex: Jean"
                aria-invalid={!!state.errors?.prenom}
                className="h-11 px-4 rounded-xl border border-input bg-surface text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors aria-[invalid=true]:border-destructive"
              />
              {state.errors?.prenom && <p className="text-xs text-destructive">{state.errors.prenom}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="age" className="text-sm font-medium text-foreground">Âge <span className="text-destructive">*</span></label>
            <input id="age" name="age" type="number" required min={1} max={150} placeholder="Ex: 30"
              aria-invalid={!!state.errors?.age}
              className="h-11 px-4 rounded-xl border border-input bg-surface text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors aria-[invalid=true]:border-destructive max-w-32"
            />
            {state.errors?.age && <p className="text-xs text-destructive">{state.errors.age}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="sexe" className="text-sm font-medium text-foreground">Sexe <span className="text-destructive">*</span></label>
            <select id="sexe" name="sexe" required defaultValue=""
              aria-invalid={!!state.errors?.sexe}
              className="h-11 px-4 rounded-xl border border-input bg-surface text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors aria-[invalid=true]:border-destructive"
            >
              <option value="" disabled>Sélectionner…</option>
              <option value="homme">Homme</option>
              <option value="femme">Femme</option>
              <option value="autre">Autre</option>
            </select>
            {state.errors?.sexe && <p className="text-xs text-destructive">{state.errors.sexe}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="poids_initial" className="text-sm font-medium text-foreground">Poids initial <span className="text-destructive">*</span></label>
            <div className="relative max-w-40">
              <input id="poids_initial" name="poids_initial" type="number" required step="0.01" min={0.1} max={999.99} placeholder="Ex: 75.5"
                aria-invalid={!!state.errors?.poids_initial}
                className="w-full h-11 px-4 pr-10 rounded-xl border border-input bg-surface text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors aria-[invalid=true]:border-destructive"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">kg</span>
            </div>
            {state.errors?.poids_initial && <p className="text-xs text-destructive">{state.errors.poids_initial}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="objectif" className="text-sm font-medium text-foreground">Objectif <span className="text-muted-foreground text-xs">(optionnel)</span></label>
            <textarea id="objectif" name="objectif" rows={3} maxLength={500} placeholder="Ex: Perte de poids, prise de masse…"
              className="w-full px-4 py-2.5 rounded-xl border border-input bg-surface text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button type="submit" disabled={pending}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-12 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pending ? (
                <><svg className="size-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" /></svg>Enregistrement…</>
              ) : (
                <><svg className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>Enregistrer le participant</>
              )}
            </button>
            <Link href={`/challenge/${challengeId}`}
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

export default function NouveauParticipantPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3 text-muted">
            <svg className="size-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" />
            </svg>
            <span className="text-sm">Chargement…</span>
          </div>
        </div>
      }
    >
      <NouveauParticipantForm />
    </Suspense>
  );
}