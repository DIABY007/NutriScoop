"use client";

import { useActionState, useCallback, useState } from "react";
import { createParticipantWithEvaluation, type ActionState } from "@/app/actions";

const initialState: ActionState = { success: false, message: "" };

type Props = {
  challengeId: string;
  open: boolean;
  onClose: () => void;
};

const STEPS = [
  { label: "Infos de base", short: "1" },
  { label: "Santé & Objectifs", short: "2" },
  { label: "Mode de vie", short: "3" },
  { label: "Mensurations", short: "4" },
];

export function ParticipantEvaluationForm({ challengeId, open, onClose }: Props) {
  const [step, setStep] = useState(0);

  const action = useCallback(
    (prev: ActionState, formData: FormData) =>
      createParticipantWithEvaluation(challengeId, prev, formData),
    [challengeId]
  );

  const [state, formAction, pending] = useActionState(action, initialState);

  const nextStep = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const handleClose = () => {
    setStep(0);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 sm:pt-16 overflow-y-auto">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
      <div className="relative w-full max-w-2xl bg-surface rounded-2xl shadow-xl border border-border overflow-hidden">
        {/* ─── Header ─── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            Ajouter un participant
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="flex items-center justify-center size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-sidebar-hover transition-colors"
            aria-label="Fermer"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ─── Stepper ─── */}
        <div className="flex items-center gap-0 px-6 pt-5 pb-2">
          {STEPS.map((s, i) => (
            <div key={s.short} className="flex items-center flex-1 last:flex-none">
              <button
                type="button"
                onClick={() => setStep(i)}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  i === step
                    ? "text-primary"
                    : i < step
                      ? "text-success"
                      : "text-muted-foreground"
                }`}
              >
                <span
                  className={`flex items-center justify-center size-7 rounded-full text-xs font-bold border-2 transition-colors ${
                    i === step
                      ? "border-primary bg-primary-light text-primary"
                      : i < step
                        ? "border-success bg-success/10 text-success"
                        : "border-border text-muted-foreground"
                  }`}
                >
                  {i < step ? (
                    <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    s.short
                  )}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-px mx-3 ${
                    i < step ? "bg-success" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* ─── Formulaire ─── */}
        <form
          action={formAction}
          onSubmit={(e) => {
            if (step < STEPS.length - 1) {
              e.preventDefault();
              nextStep();
            }
          }}
          className="px-6 py-5"
        >
          {/* Message d'erreur */}
          {state.message && !state.success && (
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm mb-5" role="alert">
              <svg className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
              <span>{state.message}</span>
            </div>
          )}

          {/* ════════════ ÉTAPE 1 : Infos de base ════════════ */}
          {step === 0 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-base font-semibold text-foreground mb-1">Informations de base</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 flex flex-col gap-1.5">
                  <label htmlFor="eval_nom" className="text-sm font-medium">Nom <span className="text-destructive">*</span></label>
                  <input id="eval_nom" name="nom" type="text" required maxLength={100} placeholder="Dupont"
                    className="h-11 px-4 rounded-xl border border-input bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <label htmlFor="eval_prenom" className="text-sm font-medium">Prénom <span className="text-destructive">*</span></label>
                  <input id="eval_prenom" name="prenom" type="text" required maxLength={100} placeholder="Jean"
                    className="h-11 px-4 rounded-xl border border-input bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 flex flex-col gap-1.5">
                  <label htmlFor="eval_age" className="text-sm font-medium">Âge <span className="text-destructive">*</span></label>
                  <input id="eval_age" name="age" type="number" required min={1} max={150} placeholder="30"
                    className="h-11 px-4 rounded-xl border border-input bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors max-w-32" />
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <label htmlFor="eval_sexe" className="text-sm font-medium">Sexe <span className="text-destructive">*</span></label>
                  <select id="eval_sexe" name="sexe" required defaultValue=""
                    className="h-11 px-4 rounded-xl border border-input bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors">
                    <option value="" disabled>Sélectionner</option>
                    <option value="homme">Homme</option>
                    <option value="femme">Femme</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <label htmlFor="eval_poids" className="text-sm font-medium">Poids actuel <span className="text-destructive">*</span></label>
                  <div className="relative max-w-32">
                    <input id="eval_poids" name="poids_initial" type="number" required step="0.1" min={0.1} max={999.99} placeholder="75.5"
                      className="w-full h-11 px-4 pr-8 rounded-xl border border-input bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">kg</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="eval_profession" className="text-sm font-medium">Profession <span className="text-muted-foreground text-xs">(optionnel)</span></label>
                <input id="eval_profession" name="profession" type="text" maxLength={200} placeholder="Ex: Bureau, actif, sédentaire…"
                  className="h-11 px-4 rounded-xl border border-input bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
              </div>
            </div>
          )}

          {/* ════════════ ÉTAPE 2 : Santé & Objectifs ════════════ */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-base font-semibold text-foreground mb-1">Santé & Objectifs</h3>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="eval_objectifs" className="text-sm font-medium">Objectifs</label>
                <textarea id="eval_objectifs" name="objectifs" rows={2} maxLength={1000} placeholder="Perte de poids, prise de masse, amélioration générale…"
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="eval_histo_poids" className="text-sm font-medium">Historique du poids</label>
                <textarea id="eval_histo_poids" name="historique_poids" rows={2} maxLength={1000} placeholder="Poids précédents, variations récentes, poids le plus haut/le plus bas…"
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="eval_maladies" className="text-sm font-medium">Maladies / Conditions médicales</label>
                <textarea id="eval_maladies" name="maladies" rows={2} maxLength={1000} placeholder="Diabète, hypertension, cholestérol, problèmes thyroïdiens…"
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none" />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 flex flex-col gap-1.5">
                  <label htmlFor="eval_allergies" className="text-sm font-medium">Allergies / Intolérances</label>
                  <textarea id="eval_allergies" name="allergies" rows={2} maxLength={500} placeholder="Lactose, gluten, arachides…"
                    className="w-full px-4 py-2.5 rounded-xl border border-input bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none" />
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <label htmlFor="eval_traitements" className="text-sm font-medium">Traitements en cours</label>
                  <textarea id="eval_traitements" name="traitements" rows={2} maxLength={500} placeholder="Médicaments, compléments…"
                    className="w-full px-4 py-2.5 rounded-xl border border-input bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none" />
                </div>
              </div>
            </div>
          )}

          {/* ════════════ ÉTAPE 3 : Mode de vie ════════════ */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-base font-semibold text-foreground mb-1">Mode de vie</h3>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="eval_digestion" className="text-sm font-medium">Digestion</label>
                <textarea id="eval_digestion" name="digestion" rows={2} maxLength={1000} placeholder="Digestion difficile, ballonnements, brûlures d'estomac…"
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="eval_habitudes" className="text-sm font-medium">Habitudes alimentaires</label>
                <textarea id="eval_habitudes" name="habitudes_alimentaires" rows={2} maxLength={1000} placeholder="Nombre de repas par jour, grignotage, régime particulier (végétarien, vegan…)"
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none" />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 flex flex-col gap-1.5">
                  <label htmlFor="eval_hydratation" className="text-sm font-medium">Hydratation</label>
                  <textarea id="eval_hydratation" name="hydratation" rows={2} maxLength={500} placeholder="Consommation d'eau quotidienne, boissons sucrées…"
                    className="w-full px-4 py-2.5 rounded-xl border border-input bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none" />
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <label htmlFor="eval_sommeil_stress" className="text-sm font-medium">Sommeil & Stress</label>
                  <textarea id="eval_sommeil_stress" name="sommeil_stress" rows={2} maxLength={500} placeholder="Qualité du sommeil, heures de sommeil, niveau de stress quotidien…"
                    className="w-full px-4 py-2.5 rounded-xl border border-input bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none" />
                </div>
              </div>
            </div>
          )}

          {/* ════════════ ÉTAPE 4 : Mensurations ════════════ */}
          {step === 3 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-base font-semibold text-foreground mb-1">Mensurations corporelles</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="eval_taille" className="text-sm font-medium">Taille</label>
                  <div className="relative">
                    <input id="eval_taille" name="taille" type="number" step="0.5" min={100} max={250} placeholder="175"
                      className="w-full h-11 px-4 pr-8 rounded-xl border border-input bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">cm</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="eval_tour_taille" className="text-sm font-medium">Tour de taille</label>
                  <div className="relative">
                    <input id="eval_tour_taille" name="tour_taille" type="number" step="0.5" min={40} max={200} placeholder="85"
                      className="w-full h-11 px-4 pr-8 rounded-xl border border-input bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">cm</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="eval_tour_hanches" className="text-sm font-medium">Tour de hanches</label>
                  <div className="relative">
                    <input id="eval_tour_hanches" name="tour_hanches" type="number" step="0.5" min={40} max={200} placeholder="100"
                      className="w-full h-11 px-4 pr-8 rounded-xl border border-input bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">cm</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="eval_tour_bras" className="text-sm font-medium">Tour de bras</label>
                  <div className="relative">
                    <input id="eval_tour_bras" name="tour_bras" type="number" step="0.5" min={15} max={80} placeholder="35"
                      className="w-full h-11 px-4 pr-8 rounded-xl border border-input bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">cm</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="eval_mensurations_notes" className="text-sm font-medium">Notes complémentaires</label>
                <textarea id="eval_mensurations_notes" name="mensurations_notes" rows={2} maxLength={500} placeholder="Autres mensurations, observations…"
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none" />
              </div>
            </div>
          )}

          {/* ─── Boutons de navigation ─── */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <div>
              {step > 0 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center gap-2 min-h-11 px-5 py-2.5 rounded-xl border border-input text-sm font-medium text-foreground hover:bg-sidebar-hover transition-colors"
                >
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                  </svg>
                  Étape {step}
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="min-h-11 px-5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Annuler
              </button>
              {step < STEPS.length - 1 ? (
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 min-h-11 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover transition-colors shadow-sm"
                >
                  Suivante
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={pending}
                  className="inline-flex items-center justify-center gap-2 min-h-12 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {pending ? (
                    <><svg className="size-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" /></svg>Inscription…</>
                  ) : (
                    <><svg className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>Valider l'inscription</>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}