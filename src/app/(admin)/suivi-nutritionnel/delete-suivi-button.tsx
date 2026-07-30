"use client";

import { useState } from "react";
import { deleteSuiviNutritionnel } from "@/app/actions/suivi-nutritionnel";

type DeleteSuiviButtonProps = {
  suiviId: string;
  suiviNom: string;
};

export function DeleteSuiviButton({ suiviId, suiviNom }: DeleteSuiviButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Confirmer ?</span>
        <button
          type="button"
          onClick={async () => {
            setPending(true);
            try {
              await deleteSuiviNutritionnel(suiviId);
            } catch {
              setPending(false);
              setConfirming(false);
            }
          }}
          disabled={pending}
          className="inline-flex items-center justify-center min-h-8 px-2.5 py-1 rounded-lg text-xs font-medium bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {pending ? "Suppression..." : "Oui, supprimer"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="inline-flex items-center justify-center min-h-8 px-2.5 py-1 rounded-lg text-xs font-medium border border-border text-muted hover:bg-sidebar-hover transition-colors"
        >
          Annuler
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
    >
      <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
      </svg>
      Supprimer
    </button>
  );
}