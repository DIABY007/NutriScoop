"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { addParticipantToDossier, createParticipantInDossier } from "@/app/actions/suivi-nutritionnel";
import type { Participant } from "@/types";

type Props = {
  dossierId: string;
  open: boolean;
  onClose: () => void;
  onParticipantAdded: () => void;
};

type TabMode = "existing" | "new";

export function DossierAddParticipantModal({ dossierId, open, onClose, onParticipantAdded }: Props) {
  const [mode, setMode] = useState<TabMode>("existing");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  // ─── Nouveau participant form (simplifié : nom, prénom, âge, téléphone, profession) ───
  const [newNom, setNewNom] = useState("");
  const [newPrenom, setNewPrenom] = useState("");
  const [newAge, setNewAge] = useState("");
  const [newTelephone, setNewTelephone] = useState("");
  const [newProfession, setNewProfession] = useState("");

  // ─── Charger les participants existants ───
  useEffect(() => {
    if (!open || mode !== "existing") return;
    const fetchParticipants = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("participants")
        .select("id, nom, prenom, age, sexe, poids_initial, objectif, created_at, challenge_id")
        .order("nom", { ascending: true });
      setParticipants(data ?? []);
      setSelectedId("");
    };
    fetchParticipants();
  }, [open, mode]);

  const handleSubmitExisting = useCallback(async () => {
    if (!selectedId) return;
    setPending(true);
    setError("");
    const result = await addParticipantToDossier(dossierId, selectedId);
    if (result.success) {
      onParticipantAdded();
      onClose();
    } else {
      setError(result.message);
    }
    setPending(false);
  }, [selectedId, dossierId, onParticipantAdded, onClose]);

  const handleSubmitNew = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError("");

    const formData = new FormData();
    formData.set("nom", newNom);
    formData.set("prenom", newPrenom);
    formData.set("age", newAge);
    formData.set("telephone", newTelephone);
    formData.set("profession", newProfession);

    const result = await createParticipantInDossier(dossierId, { success: false, message: "" }, formData);
    if (result.success) {
      onParticipantAdded();
      onClose();
    } else {
      setError(result.message);
    }
    setPending(false);
  }, [dossierId, newNom, newPrenom, newAge, newTelephone, newProfession, onParticipantAdded, onClose]);

  const handleClose = () => {
    setMode("existing");
    setSelectedId("");
    setNewNom("");
    setNewPrenom("");
    setNewAge("");
    setNewTelephone("");
    setNewProfession("");
    setError("");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 sm:pt-16 overflow-y-auto">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
      <div className="relative w-full max-w-lg bg-surface rounded-2xl shadow-xl border border-border overflow-hidden">
        {/* ─── Header ─── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Ajouter un participant</h2>
          <button type="button" onClick={handleClose}
            className="flex items-center justify-center size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-sidebar-hover transition-colors" aria-label="Fermer"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ─── Onglets ─── */}
        <div className="flex border-b border-border">
          <button
            type="button"
            onClick={() => setMode("existing")}
            className={`flex-1 px-4 py-3 text-sm font-medium text-center transition-colors ${
              mode === "existing"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Participant existant
          </button>
          <button
            type="button"
            onClick={() => setMode("new")}
            className={`flex-1 px-4 py-3 text-sm font-medium text-center transition-colors ${
              mode === "new"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Nouveau participant
          </button>
        </div>

        {/* ─── Message d'erreur ─── */}
        {error && (
          <div className="mx-6 mt-4 flex items-center gap-2.5 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm" role="alert">
            <svg className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* ══════════ MODE : Participant existant ══════════ */}
        {mode === "existing" && (
          <div className="px-6 py-5 space-y-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="select-participant" className="text-sm font-medium text-foreground">
                Sélectionner un participant
              </label>
              <select
                id="select-participant"
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="block w-full min-h-11 px-4 py-2.5 rounded-xl border border-border bg-surface text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 transition-shadow"
              >
                <option value="">Choisir un participant...</option>
                {participants.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.prenom} {p.nom} — {p.age} ans · {p.poids_initial} kg
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button type="button" onClick={handleClose}
                className="min-h-11 px-5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSubmitExisting}
                disabled={!selectedId || pending}
                className="inline-flex items-center justify-center gap-2 min-h-11 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover active:scale-[0.97] transition-all duration-150 ease-out shadow-sm disabled:opacity-50 disabled:pointer-events-none"
              >
                {pending ? (
                  <><svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" /></svg>Ajout…</>
                ) : "Ajouter au dossier"}
              </button>
            </div>
          </div>
        )}

        {/* ══════════ MODE : Nouveau participant ══════════ */}
        {mode === "new" && (
          <form onSubmit={handleSubmitNew} className="px-6 py-5 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex flex-col gap-1.5">
                <label htmlFor="new_nom" className="text-sm font-medium text-foreground">Nom <span className="text-destructive">*</span></label>
                <input id="new_nom" type="text" required maxLength={100} placeholder="Dupont"
                  value={newNom} onChange={(e) => setNewNom(e.target.value)}
                  className="h-11 px-4 rounded-xl border border-input bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors" />
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <label htmlFor="new_prenom" className="text-sm font-medium text-foreground">Prénom <span className="text-destructive">*</span></label>
                <input id="new_prenom" type="text" required maxLength={100} placeholder="Jean"
                  value={newPrenom} onChange={(e) => setNewPrenom(e.target.value)}
                  className="h-11 px-4 rounded-xl border border-input bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex flex-col gap-1.5">
                <label htmlFor="new_age" className="text-sm font-medium text-foreground">Âge <span className="text-destructive">*</span></label>
                <input id="new_age" type="number" required min={1} max={150} placeholder="30"
                  value={newAge} onChange={(e) => setNewAge(e.target.value)}
                  className="h-11 px-4 rounded-xl border border-input bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors max-w-32" />
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <label htmlFor="new_telephone" className="text-sm font-medium text-foreground">Téléphone <span className="text-muted-foreground text-xs">(optionnel)</span></label>
                <input id="new_telephone" type="tel" maxLength={20} placeholder="06 XX XX XX XX"
                  value={newTelephone} onChange={(e) => setNewTelephone(e.target.value)}
                  className="h-11 px-4 rounded-xl border border-input bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="new_profession" className="text-sm font-medium text-foreground">Profession <span className="text-muted-foreground text-xs">(optionnel)</span></label>
              <input id="new_profession" type="text" maxLength={200} placeholder="Ex: Bureau, actif, sédentaire…"
                value={newProfession} onChange={(e) => setNewProfession(e.target.value)}
                className="h-11 px-4 rounded-xl border border-input bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors" />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button type="button" onClick={handleClose}
                className="min-h-11 px-5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={pending}
                className="inline-flex items-center justify-center gap-2 min-h-11 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover active:scale-[0.97] transition-all duration-150 ease-out shadow-sm disabled:opacity-50 disabled:pointer-events-none"
              >
                {pending ? (
                  <><svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" /></svg>Création…</>
                ) : "Créer et ajouter"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}