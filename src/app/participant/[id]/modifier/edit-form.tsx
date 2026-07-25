"use client";

import { useActionState, useCallback } from "react";
import Link from "next/link";
import { updateParticipant, type ActionState } from "@/app/actions";
import type { Participant } from "@/types";

const initialState: ActionState = { success: false, message: "" };

type Props = {
  participant: Participant;
};

export function EditParticipantForm({ participant }: Props) {
  const action = useCallback(
    (prev: ActionState, formData: FormData) =>
      updateParticipant(participant.id, prev, formData),
    [participant.id]
  );

  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {/* Message d'erreur global */}
      {state.message && !state.success && (
        <div
          className="flex items-center gap-2.5 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm"
          role="alert"
        >
          <svg className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          <span>{state.message}</span>
        </div>
      )}

      {/* Nom & Prénom */}
      <div className="flex flex-col sm:flex-row gap-4">
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
            defaultValue={participant.nom}
            aria-invalid={!!state.errors?.nom}
            className="h-11 px-4 rounded-xl border border-input bg-surface text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors aria-[invalid=true]:border-destructive"
          />
          {state.errors?.nom && <p className="text-xs text-destructive">{state.errors.nom}</p>}
        </div>
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
            defaultValue={participant.prenom}
            aria-invalid={!!state.errors?.prenom}
            className="h-11 px-4 rounded-xl border border-input bg-surface text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors aria-[invalid=true]:border-destructive"
          />
          {state.errors?.prenom && <p className="text-xs text-destructive">{state.errors.prenom}</p>}
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
          defaultValue={participant.age}
          aria-invalid={!!state.errors?.age}
          className="h-11 px-4 rounded-xl border border-input bg-surface text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors aria-[invalid=true]:border-destructive max-w-32"
        />
        {state.errors?.age && <p className="text-xs text-destructive">{state.errors.age}</p>}
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
          defaultValue={participant.sexe}
          aria-invalid={!!state.errors?.sexe}
          className="h-11 px-4 rounded-xl border border-input bg-surface text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors aria-[invalid=true]:border-destructive"
        >
          <option value="homme">Homme</option>
          <option value="femme">Femme</option>
          <option value="autre">Autre</option>
        </select>
        {state.errors?.sexe && <p className="text-xs text-destructive">{state.errors.sexe}</p>}
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
            defaultValue={participant.poids_initial}
            aria-invalid={!!state.errors?.poids_initial}
            className="w-full h-11 px-4 pr-10 rounded-xl border border-input bg-surface text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors aria-[invalid=true]:border-destructive"
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">kg</span>
        </div>
        {state.errors?.poids_initial && <p className="text-xs text-destructive">{state.errors.poids_initial}</p>}
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
          defaultValue={participant.objectif ?? ""}
          className="w-full px-4 py-2.5 rounded-xl border border-input bg-surface text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
        />
      </div>

      {/* Boutons */}
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
              Enregistrer les modifications
            </>
          )}
        </button>
        <Link
          href={`/participant/${participant.id}`}
          className="w-full sm:w-auto inline-flex items-center justify-center min-h-12 px-6 py-3 rounded-xl border border-input text-sm font-medium text-foreground hover:bg-sidebar-hover transition-colors"
        >
          Annuler
        </Link>
      </div>
    </form>
  );
}