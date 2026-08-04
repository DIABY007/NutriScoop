"use client";

import { useState, useCallback } from "react";

// ─── Types pour la structure des questions ─────────────────
type FieldType = "checkbox-group" | "text" | "textarea" | "number" | "time" | "checkbox-conditional";

type QuestionGroup = {
  categorie: string;
  champs: Champ[];
};

type Champ = {
  id: string;
  question: string;
  type: FieldType;
  options?: string[];
  unit?: string;
  placeholder?: string;
  helpText?: string;
  conditionId?: string; // id du champ checkbox-conditional qui contrôle l'affichage
  rows?: number;
};

// ══════════════════════════════════════════════════════════════
// Définition des sections — respect strict des intitulés
// ══════════════════════════════════════════════════════════════
const GROUPES: QuestionGroup[] = [
  // ── 2. OBJECTIFS DU CLIENT ──
  {
    categorie: "2. OBJECTIFS DU CLIENT",
    champs: [
      {
        id: "objectif_principal",
        question: "Quel est votre objectif principal ?",
        type: "checkbox-group",
        options: [
          "Perte de masse grasse (perte de poids)",
          "Prise de masse musculaire",
          "Recomposition corporelle",
          "Amélioration des performances sportives",
          "Amélioration de la santé",
          "Autre",
        ],
      },
      {
        id: "zone_corps",
        question: "Zone du corps à améliorer",
        type: "checkbox-group",
        options: ["Ventre", "Cuisses", "Fessiers", "Bras", "Dos", "Corps entier"],
      },
      {
        id: "poids_souhaite",
        question: "Objectif de poids souhaité",
        type: "number",
        unit: "kg",
      },
    ],
  },

  // ── 3. HISTORIQUE DU POIDS ──
  {
    categorie: "3. HISTORIQUE DU POIDS",
    champs: [
      { id: "poids_actuel", question: "Poids actuel", type: "number", unit: "kg" },
      { id: "poids_plus_eleve", question: "Poids le plus élevé", type: "number", unit: "kg" },
      { id: "poids_plus_bas", question: "Poids le plus bas", type: "number", unit: "kg" },
      { id: "poids_stable_depuis", question: "Depuis combien de temps votre poids est-il stable ?", type: "text", placeholder: "Ex: 6 mois, 1 an…" },
      {
        id: "regime_suivi",
        question: "Avez-vous déjà suivi un régime ?",
        type: "checkbox-conditional",
        options: ["Non", "Oui"],
        conditionId: "regime_suivi_texte",
      },
      { id: "regime_suivi_texte", question: "Si oui lequel ?", type: "text", placeholder: "Précisez le régime suivi…" },
    ],
  },

  // ── 4. ÉTAT DE SANTÉ ──
  {
    categorie: "4. ÉTAT DE SANTÉ",
    champs: [
      {
        id: "problemes_sante",
        question: "Souffrez-vous de l'un des problèmes suivants ?",
        type: "checkbox-group",
        options: [
          "Diabète",
          "Hypertension",
          "Cholestérol élevé",
          "Maladie cardiaque",
          "Problèmes digestifs",
          "Problèmes hormonaux",
          "Aucun",
        ],
      },
      {
        id: "autres_maladies",
        question: "Autres maladies ou antécédents médicaux",
        type: "text",
        placeholder: "Ex: asthme, migraines…",
      },
      {
        id: "etat_sante_description",
        question: "Décrivez brièvement votre état de santé actuel…",
        type: "textarea",
        rows: 3,
        helpText:
          "Exemples: arthrose, dépression, anxiété, hernie discale, grossesse ou allaitement, anémie, problèmes de thyroïde, douleurs chroniques, troubles du sommeil, maladies auto-immunes, etc.",
      },
      {
        id: "medicaments",
        question: "Prenez-vous des médicaments ?",
        type: "checkbox-conditional",
        options: ["Non", "Oui"],
        conditionId: "medicaments_texte",
      },
      { id: "medicaments_texte", question: "Si oui lesquels ?", type: "text", placeholder: "Listez vos médicaments…" },
    ],
  },

  // ── 5. ALLERGIES ET INTOLÉRANCES ──
  {
    categorie: "5. ALLERGIES ET INTOLÉRANCES",
    champs: [
      {
        id: "allergies",
        question: "Avez-vous des allergies ou intolérances alimentaires ?",
        type: "checkbox-conditional",
        options: ["Non", "Oui"],
        conditionId: "allergies_texte",
      },
      { id: "allergies_texte", question: "Si oui lesquelles ?", type: "text", placeholder: "Ex: lactose, gluten, arachides…" },
    ],
  },

  // ── 6. ANALYSE DIGESTIVE ──
  {
    categorie: "6. ANALYSE DIGESTIVE",
    champs: [
      {
        id: "symptomes_digestifs",
        question: "Après les repas ressentez-vous :",
        type: "checkbox-group",
        options: [
          "Ballonnements",
          "Gaz fréquents",
          "Digestion lente",
          "Reflux gastrique",
          "Constipation",
          "Diarrhée",
          "Digestion normale",
        ],
      },
      {
        id: "frequence_selles",
        question: "Fréquence des selles",
        type: "checkbox-group",
        options: ["1 fois/jour", "plus de 3 fois / semaine", "Moins de 3 fois / semaine"],
      },
    ],
  },

  // ── 7. HABITUDES ALIMENTAIRES ──
  {
    categorie: "7. HABITUDES ALIMENTAIRES",
    champs: [
      {
        id: "nb_repas_jour",
        question: "Combien de repas prenez-vous par jour ?",
        type: "checkbox-group",
        options: ["2", "3", "4", "5 ou plus"],
      },
      {
        id: "consommation_courante",
        question: "Que consommez-vous souvent :",
        type: "textarea",
        rows: 2,
        placeholder: "Ex: riz, pâtes, légumes, viande, poisson, fruits…",
      },
      {
        id: "description_habitudes",
        question: "Faites une petite description de vos habitudes alimentaires",
        type: "textarea",
        rows: 3,
        placeholder: "Ex: repas équilibrés, grignotage entre les repas, sauts de repas…",
      },
      {
        id: "aliments_aimes",
        question: "Quels aliments n'aimez-vous pas ?",
        type: "textarea",
        rows: 2,
        placeholder: "Ex: poisson, légumes verts, abats…",
      },
      {
        id: "produits_sucres",
        question: "Produits (transformés) sucrés",
        type: "checkbox-group",
        options: ["Rarement", "Parfois", "Souvent"],
      },
      {
        id: "produits_frits",
        question: "Produits frits",
        type: "checkbox-group",
        options: ["Rarement", "Parfois", "Souvent"],
      },
      {
        id: "boissons_sucrees",
        question: "Boissons sucrées",
        type: "checkbox-group",
        options: ["Rarement", "Parfois", "Souvent"],
      },
      {
        id: "alimentation_24h",
        question: "Alimentation des dernières 24h",
        type: "textarea",
        rows: 3,
        placeholder:
          "Notez ici ce que la personne a mangé au cours des dernières 24 heures (repas, collations, boissons…) — Ex: Petit-déj: café + pain beurre, Déj: poulet riz légumes, Dîner: soupe salade, Collation: pomme",
      },
    ],
  },

  // ── 8. HYDRATATION ──
  {
    categorie: "8. HYDRATATION",
    champs: [
      {
        id: "eau_par_jour",
        question: "Combien de litres d'eau buvez-vous par jour ?",
        type: "number",
        unit: "litre",
      },
    ],
  },

  // ── 9. SOMMEIL ──
  {
    categorie: "9. SOMMEIL",
    champs: [
      { id: "heure_coucher", question: "Heure de coucher", type: "time" },
      { id: "heure_reveil", question: "Heure de réveil", type: "time" },
      { id: "heures_sommeil", question: "Combien d'heures dormez-vous par nuit ?", type: "number", unit: "heures" },
      {
        id: "qualite_sommeil",
        question: "Qualité du sommeil",
        type: "checkbox-group",
        options: ["Bonne", "Moyenne", "Mauvais"],
      },
    ],
  },

  // ── 10. NIVEAU DE STRESS ──
  {
    categorie: "10. NIVEAU DE STRESS",
    champs: [
      {
        id: "stress_quotidien",
        question: "Niveau de stress quotidien",
        type: "checkbox-group",
        options: ["Faible", "Moyen", "Élevé"],
      },
    ],
  },

  // ── 11. ACTIVITÉ PHYSIQUE ──
  {
    categorie: "11. ACTIVITÉ PHYSIQUE",
    champs: [
      { id: "sport_type", question: "Type de sport pratiqué", type: "text", placeholder: "Ex: course, natation, musculation…" },
      { id: "sport_frequence", question: "Fréquence par semaine", type: "number", unit: "séances" },
      { id: "sport_duree", question: "Durée moyenne", type: "text", placeholder: "Ex: 45 min, 1h…" },
      {
        id: "sport_intensite",
        question: "Intensité",
        type: "checkbox-group",
        options: ["Faible", "Moyenne", "Élevée"],
      },
    ],
  },

  // ── 12. MESURES CORPORELLES ──
  {
    categorie: "12. MESURES CORPORELLES",
    champs: [
      { id: "taille", question: "Taille", type: "number", unit: "m." },
      { id: "tour_taille", question: "Tour de taille", type: "number", unit: "cm" },
      { id: "tour_hanches", question: "Tour de hanches", type: "number", unit: "cm" },
      { id: "tour_bras", question: "Tour de bras", type: "number", unit: "cm" },
      { id: "tour_poitrine", question: "Tour de poitrine", type: "number", unit: "cm." },
      { id: "tour_epaule", question: "Tour d'épaule", type: "number" },
      { id: "tour_cuisse", question: "Tour de cuisse", type: "number", unit: "cm" },
      { id: "masse_musculaire", question: "Masse musculaire", type: "number", unit: "%" },
      { id: "masse_grasse", question: "Masse grasse", type: "number", unit: "%" },
    ],
  },
];

// ══════════════════════════════════════════════════════════════
// Sous-composants
// ══════════════════════════════════════════════════════════════

// ─── Checkbox group ───────────────────────────────────────
function CheckboxGroup({
  id,
  options,
  selected,
  onChange,
}: {
  id: string;
  options: string[];
  selected: string[];
  onChange: (id: string, values: string[]) => void;
}) {
  const toggle = (opt: string) => {
    const next = selected.includes(opt) ? selected.filter((v) => v !== opt) : [...selected, opt];
    onChange(id, next);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <label
          key={opt}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border text-sm font-medium cursor-pointer transition-colors ${
            selected.includes(opt)
              ? "border-primary bg-primary-light/20 text-primary"
              : "border-border bg-surface text-foreground hover:border-primary/30"
          }`}
        >
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={() => toggle(opt)}
            className="sr-only"
          />
          {selected.includes(opt) && (
            <svg className="size-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          )}
          {opt}
        </label>
      ))}
    </div>
  );
}

// ─── Checkbox conditionnel (Oui/Non) ─────────────────────
function CheckboxConditional({
  id,
  options,
  value,
  onChange,
}: {
  id: string;
  options: string[];
  value: string;
  onChange: (id: string, value: string) => void;
}) {
  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <label
          key={opt}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border text-sm font-medium cursor-pointer transition-colors ${
            value === opt
              ? "border-primary bg-primary-light/20 text-primary"
              : "border-border bg-surface text-foreground hover:border-primary/30"
          }`}
        >
          <input
            type="checkbox"
            checked={value === opt}
            onChange={() => onChange(id, opt)}
            className="sr-only"
          />
          {value === opt && (
            <svg className="size-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          )}
          {opt}
        </label>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// Composant principal
// ══════════════════════════════════════════════════════════════
type GrilleEvaluationProps = {
  initialData?: Record<string, string>;
  onSave?: (data: Record<string, string>) => void;
};

export default function GrilleEvaluation({ initialData, onSave }: GrilleEvaluationProps) {
  const [reponses, setReponses] = useState<Record<string, string>>(initialData ?? {});
  const [isSaving, setIsSaving] = useState(false);
  const [consentement, setConsentement] = useState(false);

  // ─── Gestion des changements ───
  const handleChange = useCallback((id: string, value: string) => {
    setReponses((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleCheckboxGroup = useCallback((id: string, values: string[]) => {
    setReponses((prev) => ({ ...prev, [id]: values.join(", ") }));
  }, []);

  const isChecked = useCallback(
    (id: string) => {
      const val = reponses[id] ?? "";
      return val === "Oui";
    },
    [reponses]
  );

  // ─── Sauvegarde ───
  const handleSave = useCallback(() => {
    setIsSaving(true);
    onSave?.({ ...reponses, consentement: consentement ? "Accepté" : "Refusé" });
    setTimeout(() => setIsSaving(false), 600);
  }, [reponses, consentement, onSave]);

  // ─── Compteur ───
  const totalChamps = GROUPES.reduce((acc, g) => acc + g.champs.length, 0);
  const nbRenseignees = Object.values(reponses).filter((v) => v !== "").length;

  return (
    <div className="space-y-8">
      {/* ─── En-tête ─── */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-primary">Grille d&apos;évaluation nutritionnelle</h3>
          <p className="text-sm text-muted mt-1">
            {nbRenseignees}/{totalChamps} questions renseignées
          </p>
        </div>
        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-primary-light text-primary">
          {Math.round((nbRenseignees / Math.max(totalChamps, 1)) * 100)}% complété
        </span>
      </div>

      {/* ─── Barre de progression ─── */}
      <div className="w-full h-2 rounded-full bg-border overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${(nbRenseignees / Math.max(totalChamps, 1)) * 100}%` }}
        />
      </div>

      {/* ─── Groupes de questions ─── */}
      {GROUPES.map((groupe) => (
        <div
          key={groupe.categorie}
          className="rounded-xl bg-surface border border-border shadow-sm overflow-hidden"
        >
          <div className="px-5 py-3 bg-muted/10 border-b border-border">
            <h4 className="text-sm font-semibold text-foreground">{groupe.categorie}</h4>
          </div>
          <div className="divide-y divide-border">
            {groupe.champs.map((champ) => {
              // Pour les champs conditionnels, les afficher seulement si la condition est remplie
              const isConditionalField = champ.conditionId !== undefined;
              const parentIsChecked = champ.conditionId ? isChecked(champ.conditionId) : true;

              if (isConditionalField && !parentIsChecked) return null;

              return (
                <div key={champ.id} className="px-5 py-4 space-y-2">
                  <label className="block text-sm text-foreground">{champ.question}</label>

                  {/* ─── Checkbox group ─── */}
                  {champ.type === "checkbox-group" && champ.options && (
                    <CheckboxGroup
                      id={champ.id}
                      options={champ.options}
                      selected={(reponses[champ.id] ?? "").split(", ").filter(Boolean)}
                      onChange={handleCheckboxGroup}
                    />
                  )}

                  {/* ─── Checkbox conditionnel (Oui/Non) ─── */}
                  {champ.type === "checkbox-conditional" && champ.options && (
                    <CheckboxConditional
                      id={champ.id}
                      options={champ.options}
                      value={reponses[champ.id] ?? ""}
                      onChange={handleChange}
                    />
                  )}

                  {/* ─── Texte ─── */}
                  {champ.type === "text" && (
                    <input
                      type="text"
                      value={reponses[champ.id] ?? ""}
                      onChange={(e) => handleChange(champ.id, e.target.value)}
                      placeholder={champ.placeholder}
                      className="block w-full min-h-11 px-4 py-2.5 rounded-xl bg-surface border border-border text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 transition-shadow"
                    />
                  )}

                  {/* ─── Textarea ─── */}
                  {champ.type === "textarea" && (
                    <div>
                      <textarea
                        value={reponses[champ.id] ?? ""}
                        onChange={(e) => handleChange(champ.id, e.target.value)}
                        placeholder={champ.placeholder}
                        rows={champ.rows ?? 3}
                        className="block w-full min-h-[80px] px-4 py-2.5 rounded-xl bg-surface border border-border text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 transition-shadow resize-y"
                      />
                      {champ.helpText && (
                        <p className="mt-1 text-xs text-muted-foreground">{champ.helpText}</p>
                      )}
                    </div>
                  )}

                  {/* ─── Nombre ─── */}
                  {champ.type === "number" && (
                    <div className="relative max-w-40">
                      <input
                        type="number"
                        step="0.1"
                        min={0}
                        value={reponses[champ.id] ?? ""}
                        onChange={(e) => handleChange(champ.id, e.target.value)}
                        placeholder={champ.placeholder}
                        className="w-full h-11 px-4 pr-10 rounded-xl border border-border bg-surface text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 transition-shadow"
                      />
                      {champ.unit && (
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                          {champ.unit}
                        </span>
                      )}
                    </div>
                  )}

                  {/* ─── Time ─── */}
                  {champ.type === "time" && (
                    <input
                      type="time"
                      value={reponses[champ.id] ?? ""}
                      onChange={(e) => handleChange(champ.id, e.target.value)}
                      className="block w-40 min-h-11 px-4 py-2.5 rounded-xl bg-surface border border-border text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 transition-shadow"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* ─── 13. CONSENTEMENT ─── */}
      <div className="rounded-xl bg-surface border border-border shadow-sm overflow-hidden">
        <div className="px-5 py-3 bg-muted/10 border-b border-border">
          <h4 className="text-sm font-semibold text-foreground">13. CONSENTEMENT</h4>
        </div>
        <div className="px-5 py-4 space-y-4">
          <p className="text-sm text-foreground leading-relaxed">
            En soumettant ce formulaire Vous acceptez que les informations que vous fournissez soient utilisées de manière confidentielle dans le cadre de cette consultation nutritionnelle. Vous comprenez que cette consultation est éducative et ne remplace pas une consultation médicale. Vous confirmez que les informations fournies sont exactes.
          </p>

          <label className="inline-flex items-center gap-3 px-4 py-3 rounded-lg border border-border cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary-light/20 transition-colors">
            <input
              type="checkbox"
              checked={consentement}
              onChange={(e) => setConsentement(e.target.checked)}
              className="size-4 accent-primary"
            />
            <span className="text-sm font-medium text-foreground">
              lue et approuvée
            </span>
          </label>
        </div>
      </div>

      {/* ─── Bouton de sauvegarde ─── */}
      <div className="flex items-center justify-end pt-2">
        <button
          type="button"
          disabled={isSaving || !consentement}
          onClick={handleSave}
          className="inline-flex items-center justify-center gap-2 min-h-11 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover active:scale-[0.97] transition-all duration-150 ease-out shadow-sm disabled:opacity-50 disabled:pointer-events-none"
        >
          {isSaving ? (
            <>
              <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" />
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