"use client";

import { useState } from "react";
import { useActionState } from "react";
import Link from "next/link";
import { createSuiviNutritionnel, type ActionState } from "@/app/actions/suivi-nutritionnel";
import type { Participant } from "@/types";

const NIVEAUX = [
  { value: "ESSENTIELLE", label: "Essentielle", desc: "Bilan mensuel" },
  { value: "RENFORCEE", label: "Renforcée", desc: "Bilan hebdomadaire" },
  { value: "INTENSE", label: "Intense", desc: "Bilan quotidien" },
  { value: "CLINIQUE", label: "Clinique", desc: "Bilan quotidien détaillé" },
] as const;

type NouveauSuiviFormProps = {
  participants: Participant[];
};

export function NouveauSuiviForm({ participants }: NouveauSuiviFormProps) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    createSuiviNutritionnel,
    { success: false, message: "" }
  );

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleParticipant = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

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

      {/* ─── Participants (multi-sélection) ─── */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          Participants
          <span className="text-xs text-muted-foreground ml-1">(sélection multiples)</span>
        </label>
        <div className="max-h-48 overflow-y-auto rounded-xl border border-border bg-surface divide-y divide-border">
          {participants.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">
              Aucun participant disponible. Créez d&apos;abord un challenge avec des participants.
            </p>
          ) : (
            participants.map((p) => (
              <label
                key={p.id}
                className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-muted/10 transition-colors has-[:checked]:bg-primary-light/20"
              >
                <input
                  type="checkbox"
                  name="participant_ids"
                  value={p.id}
                  checked={selectedIds.includes(p.id)}
                  onChange={() => toggleParticipant(p.id)}
                  className="size-4 rounded border-border accent-primary"
                />
                <span className="flex items-center justify-center size-8 rounded-full bg-primary-light text-primary font-semibold text-xs shrink-0">
                  {p.prenom.charAt(0).toUpperCase()}{p.nom.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {p.prenom} {p.nom}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {p.age} ans · {p.poids_initial} kg
                  </p>
                </div>
              </label>
            ))
          )}
        </div>
        {selectedIds.length > 0 && (
          <p className="mt-1.5 text-xs text-muted-foreground">
            {selectedIds.length} participant{selectedIds.length > 1 ? "s" : ""} sélectionné{selectedIds.length > 1 ? "s" : ""}
          </p>
        )}
        {state.errors?.participant_id && (
          <p className="mt-1 text-xs text-destructive">{state.errors.participant_id}</p>
        )}
      </div>

      {/* ─── Niveau de suivi ─── */}
      <fieldset>
        <legend className="block text-sm font-medium text-foreground mb-3">
          Niveau de suivi
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {NIVEAUX.map((n) => (
            <label
              key={n.value}
              className="flex items-start gap-3 p-4 rounded-xl bg-surface border border-border cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary-light/30 transition-colors"
            >
              <input
                type="radio"
                name="niveau_suivi"
                value={n.value}
                defaultChecked={n.value === "ESSENTIELLE"}
                className="mt-1 size-4 accent-primary"
              />
              <div>
                <span className="text-sm font-medium text-foreground">{n.label}</span>
                <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
              </div>
            </label>
          ))}
        </div>
        {state.errors?.niveau_suivi && (
          <p className="mt-1 text-xs text-destructive">{state.errors.niveau_suivi}</p>
        )}
      </fieldset>

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