"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { updateNiveauSuivi } from "@/app/actions/suivi-nutritionnel";
import type { NiveauSuivi } from "@/types";

type Props = {
  suiviId: string;
  niveauActuel: NiveauSuivi;
};

const NIVEAUX: { value: NiveauSuivi; label: string; desc: string; color: string }[] = [
  { value: "ESSENTIELLE", label: "Essentielle", desc: "Bilan mensuel", color: "bg-success/10 text-success" },
  { value: "RENFORCEE", label: "Renforcée", desc: "Bilan hebdomadaire", color: "bg-info/10 text-info" },
  { value: "INTENSE", label: "Intense", desc: "Bilan quotidien", color: "bg-warning/10 text-warning" },
  { value: "CLINIQUE", label: "Clinique", desc: "Bilan quotidien détaillé", color: "bg-destructive/10 text-destructive" },
];

export default function NiveauSuiviSelector({ suiviId, niveauActuel }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [niveau, setNiveau] = useState(niveauActuel);

  const current = NIVEAUX.find((n) => n.value === niveau) ?? NIVEAUX[0];

  const handleChange = useCallback(async (value: NiveauSuivi) => {
    setPending(true);
    setNiveau(value);
    const formData = new FormData();
    formData.set("niveau_suivi", value);
    await updateNiveauSuivi(suiviId, { success: false, message: "" }, formData);
    setPending(false);
    setOpen(false);
    router.refresh();
  }, [suiviId, router]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors hover:opacity-80 ${current.color}`}
        title="Changer le niveau de suivi"
      >
        <svg className="size-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
        {current.label}
      </button>
    );
  }

  return (
    <div className="relative">
      <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-surface border border-border shadow-lg min-w-48">
        <p className="text-xs font-medium text-muted-foreground px-1">Niveau de suivi</p>
        {NIVEAUX.map((n) => {
          const isActive = n.value === niveau;
          return (
            <button
              key={n.value}
              type="button"
              onClick={() => handleChange(n.value)}
              disabled={pending || isActive}
              className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                isActive
                  ? "bg-primary-light/20 text-primary font-medium"
                  : "hover:bg-muted/10 text-foreground"
              } disabled:opacity-50`}
            >
              <div>
                <span className="font-medium">{n.label}</span>
                <p className="text-xs text-muted-foreground">{n.desc}</p>
              </div>
              {isActive && (
                <svg className="size-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              )}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="mt-1 text-xs text-muted-foreground hover:text-foreground transition-colors text-center py-1"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}