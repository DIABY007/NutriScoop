"use client";

import { useState, useCallback } from "react";

// ─── Structure de la grille de questions ─────────────────
type Question = {
  id: string;
  categorie: string;
  question: string;
  type: "text" | "textarea" | "select" | "number";
  options?: string[];
  placeholder?: string;
};

const QUESTIONS: Question[] = [
  // ── Anthropométrie ──
  { id: "poids", categorie: "Anthropométrie", question: "Poids actuel (kg)", type: "number", placeholder: "Ex: 72" },
  { id: "taille", categorie: "Anthropométrie", question: "Taille (cm)", type: "number", placeholder: "Ex: 165" },
  { id: "imc", categorie: "Anthropométrie", question: "IMC", type: "number", placeholder: "Calcul automatique" },
  { id: "tour_taille", categorie: "Anthropométrie", question: "Tour de taille (cm)", type: "number", placeholder: "Ex: 85" },

  // ── Habitudes alimentaires ──
  { id: "nb_repas", categorie: "Habitudes alimentaires", question: "Nombre de repas par jour", type: "number", placeholder: "Ex: 3" },
  { id: "petit_dej", categorie: "Habitudes alimentaires", question: "Petit-déjeuner", type: "select", options: ["Tous les jours", "Souvent", "Parfois", "Jamais"] },
  { id: "grignotage", categorie: "Habitudes alimentaires", question: "Grignotage entre les repas", type: "select", options: ["Jamais", "Parfois", "Souvent", "Très souvent"] },
  { id: "hydratation", categorie: "Habitudes alimentaires", question: "Hydratation (L/jour)", type: "select", options: ["< 0.5 L", "0.5-1 L", "1-1.5 L", "1.5-2 L", "> 2 L"] },

  // ── État de santé ──
  { id: "digestion", categorie: "État de santé", question: "Qualité de la digestion", type: "select", options: ["Bonne", "Moyenne", "Difficile", "Avec douleurs"] },
  { id: "sommeil", categorie: "État de santé", question: "Qualité du sommeil", type: "select", options: ["Excellente", "Bonne", "Moyenne", "Mauvaise"] },
  { id: "stress", categorie: "État de santé", question: "Niveau de stress", type: "select", options: ["Faible", "Modéré", "Élevé", "Très élevé"] },
  { id: "energie", categorie: "État de santé", question: "Niveau d'énergie général", type: "select", options: ["Excellent", "Bon", "Moyen", "Faible"] },

  // ── Activité physique ──
  { id: "activite_type", categorie: "Activité physique", question: "Type d'activité pratiquée", type: "text", placeholder: "Ex: Marche, natation..." },
  { id: "activite_freq", categorie: "Activité physique", question: "Fréquence (sessions/semaine)", type: "number", placeholder: "Ex: 3" },
  { id: "activite_duree", categorie: "Activité physique", question: "Durée par session (min)", type: "number", placeholder: "Ex: 45" },

  // ── Objectifs ──
  { id: "objectif_principal", categorie: "Objectifs", question: "Objectif principal", type: "select", options: ["Perte de poids", "Prise de masse", "Maintien", "Amélioration santé", "Performance sportive"] },
  { id: "notes", categorie: "Objectifs", question: "Notes complémentaires", type: "textarea", placeholder: "Observations, remarques..." },
];

// ─── Groupe de questions ─────────────────────────────────
function GroupeQuestions({
  categorie,
  questions,
  reponses,
  onChange,
}: {
  categorie: string;
  questions: Question[];
  reponses: Record<string, string>;
  onChange: (id: string, value: string) => void;
}) {
  return (
    <div className="rounded-xl bg-surface border border-border shadow-sm overflow-hidden">
      <div className="px-5 py-3 bg-muted/10 border-b border-border">
        <h4 className="text-sm font-semibold text-foreground">{categorie}</h4>
      </div>
      <div className="divide-y divide-border">
        {questions.map((q) => (
          <div key={q.id} className="px-5 py-4">
            <label htmlFor={q.id} className="block text-sm text-foreground mb-2">
              {q.question}
            </label>
            {q.type === "textarea" ? (
              <textarea
                id={q.id}
                value={reponses[q.id] ?? ""}
                onChange={(e) => onChange(q.id, e.target.value)}
                placeholder={q.placeholder}
                rows={3}
                className="block w-full min-h-[80px] px-4 py-2.5 rounded-xl bg-surface border border-border text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 transition-shadow resize-y"
              />
            ) : q.type === "select" ? (
              <select
                id={q.id}
                value={reponses[q.id] ?? ""}
                onChange={(e) => onChange(q.id, e.target.value)}
                className="block w-full min-h-11 px-4 py-2.5 rounded-xl bg-surface border border-border text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 transition-shadow"
              >
                <option value="">Sélectionner...</option>
                {q.options?.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : q.type === "number" ? (
              <input
                id={q.id}
                type="number"
                value={reponses[q.id] ?? ""}
                onChange={(e) => onChange(q.id, e.target.value)}
                placeholder={q.placeholder}
                className="block w-full min-h-11 px-4 py-2.5 rounded-xl bg-surface border border-border text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 transition-shadow"
              />
            ) : (
              <input
                id={q.id}
                type="text"
                value={reponses[q.id] ?? ""}
                onChange={(e) => onChange(q.id, e.target.value)}
                placeholder={q.placeholder}
                className="block w-full min-h-11 px-4 py-2.5 rounded-xl bg-surface border border-border text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 transition-shadow"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Composant principal ─────────────────────────────────
type GrilleEvaluationProps = {
  initialData?: Record<string, string>;
  onSave?: (data: Record<string, string>) => void;
};

export default function GrilleEvaluation({ initialData, onSave }: GrilleEvaluationProps) {
  const [reponses, setReponses] = useState<Record<string, string>>(initialData ?? {});
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = useCallback((id: string, value: string) => {
    setReponses((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleSave = useCallback(() => {
    setIsSaving(true);
    console.log("=== Grille d'évaluation sauvegardée ===", reponses);
    onSave?.(reponses);
    setTimeout(() => setIsSaving(false), 600);
  }, [reponses, onSave]);

  // Regrouper les questions par catégorie
  const groupes = QUESTIONS.reduce<Record<string, Question[]>>((acc, q) => {
    if (!acc[q.categorie]) acc[q.categorie] = [];
    acc[q.categorie].push(q);
    return acc;
  }, {});

  const nbRenseignees = Object.values(reponses).filter((v) => v !== "").length;
  const total = QUESTIONS.length;

  return (
    <div className="space-y-6">
      {/* ─── En-tête ─── */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-primary">Grille d&apos;évaluation nutritionnelle</h3>
          <p className="text-sm text-muted mt-1">
            {nbRenseignees}/{total} questions renseignées
          </p>
        </div>
        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-primary-light text-primary">
          {Math.round((nbRenseignees / total) * 100)}% complété
        </span>
      </div>

      {/* ─── Barre de progression ─── */}
      <div className="w-full h-2 rounded-full bg-border overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${(nbRenseignees / total) * 100}%` }}
        />
      </div>

      {/* ─── Groupes de questions ─── */}
      {Object.entries(groupes).map(([categorie, questions]) => (
        <GroupeQuestions
          key={categorie}
          categorie={categorie}
          questions={questions}
          reponses={reponses}
          onChange={handleChange}
        />
      ))}

      {/* ─── Bouton de sauvegarde ─── */}
      <div className="flex items-center justify-end pt-2">
        <button
          type="button"
          disabled={isSaving}
          onClick={handleSave}
          className="inline-flex items-center justify-center gap-2 min-h-11 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover active:scale-[0.97] transition-all duration-150 ease-out shadow-sm disabled:opacity-50 disabled:pointer-events-none"
        >
          {isSaving ? (
            <>
              <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Sauvegarde…
            </>
          ) : (
            <>
              <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
              Enregistrer l&apos;évaluation
            </>
          )}
        </button>
      </div>
    </div>
  );
}