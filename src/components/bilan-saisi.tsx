"use client";

import { useState, useCallback } from "react";
import type { NiveauSuivi } from "@/types";

// ─── Mapping titre ← niveau ─────────────────────────────
const TITRES_BILAN: Record<NiveauSuivi, string> = {
  ESSENTIELLE: "Bilan du mois",
  RENFORCEE: "Bilan de la semaine",
  INTENSE: "Bilan quotidien",
  CLINIQUE: "Bilan quotidien",
};

// ─── Sous-titre explicatif par niveau ────────────────────
const SOUS_TITRES: Record<NiveauSuivi, string> = {
  ESSENTIELLE:
    "Rédigez une synthèse mensuelle de l'évolution du participant.",
  RENFORCEE:
    "Rédigez un bilan hebdomadaire pour ajuster le suivi.",
  INTENSE:
    "Rédigez le bilan quotidien de l'état nutritionnel du participant.",
  CLINIQUE:
    "Rédigez le bilan quotidien — rapport clinique détaillé requis.",
};

type BilanSaisiProps = {
  niveauSuivi: NiveauSuivi;
};

export default function BilanSaisi({ niveauSuivi }: BilanSaisiProps) {
  const [contenu, setContenu] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const titre = TITRES_BILAN[niveauSuivi] ?? "Bilan";
  const sousTitre = SOUS_TITRES[niveauSuivi] ?? "";

  const handleSubmit = useCallback(() => {
    if (!contenu.trim()) return;
    setIsSaving(true);
    console.log("=== Bilan sauvegardé ===");
    console.log("Niveau :", niveauSuivi);
    console.log("Contenu :", contenu);
    // Simuler un délai pour le feedback visuel
    setTimeout(() => setIsSaving(false), 600);
  }, [contenu, niveauSuivi]);

  return (
    <div className="space-y-5">
      {/* ─── En-tête du bilan ─── */}
      <div>
        <h3 className="text-lg font-semibold text-primary">{titre}</h3>
        <p className="text-sm text-muted mt-1">{sousTitre}</p>
      </div>

      {/* ─── Badge niveau ─── */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-primary-light text-primary">
        <svg
          className="size-3.5 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
          />
        </svg>
        Suivi {niveauSuivi.toLowerCase()}
      </div>

      {/* ─── Zone de saisie ─── */}
      <div className="rounded-2xl bg-surface border border-border shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-primary/30 transition-shadow">
        <textarea
          value={contenu}
          onChange={(e) => setContenu(e.target.value)}
          placeholder={`Rédigez ici le ${titre.toLowerCase()}…`}
          rows={8}
          className="
            block w-full resize-y
            min-h-[200px] px-4 py-4
            text-sm text-foreground
            bg-transparent
            placeholder:text-muted-foreground
            border-none
            focus-visible:outline-none
            leading-relaxed
          "
        />
      </div>

      {/* ─── Compteur et actions ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          {contenu.length > 0
            ? `${contenu.length} caractère${contenu.length > 1 ? "s" : ""}`
            : "Aucun contenu saisi"}
        </p>

        <button
          type="button"
          disabled={!contenu.trim() || isSaving}
          onClick={handleSubmit}
          className="
            inline-flex items-center justify-center gap-2
            min-h-11 px-5 py-2.5
            rounded-xl text-sm font-medium
            bg-primary text-primary-foreground
            hover:bg-primary-hover
            active:scale-[0.97]
            transition-all duration-150 ease-out
            shadow-sm
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30
            disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100
          "
        >
          {isSaving ? (
            <>
              <svg
                className="size-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Enregistrement…
            </>
          ) : (
            <>
              <svg
                className="size-4 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
              Enregistrer le bilan
            </>
          )}
        </button>
      </div>
    </div>
  );
}