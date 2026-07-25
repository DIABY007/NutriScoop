"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type ActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
};

// ─────────────────────────────────────────────
// Création d'un challenge
// ─────────────────────────────────────────────
export async function createChallenge(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  const rawNom = (formData.get("nom") as string)?.trim();
  const rawDateDebut = formData.get("date_debut") as string;
  const rawDateFin = formData.get("date_fin") as string;

  const errors: Record<string, string> = {};

  if (!rawNom || rawNom.length < 1) errors.nom = "Le nom du challenge est requis.";
  if (rawNom && rawNom.length > 200) errors.nom = "Le nom ne peut pas dépasser 200 caractères.";
  if (!rawDateDebut) errors.date_debut = "La date de début est requise.";
  if (!rawDateFin) errors.date_fin = "La date de fin est requise.";
  if (rawDateDebut && rawDateFin && rawDateFin < rawDateDebut)
    errors.date_fin = "La date de fin doit être après la date de début.";

  if (Object.keys(errors).length > 0) {
    return { success: false, message: "Veuillez corriger les erreurs ci-dessous.", errors };
  }

  const { error } = await supabase.from("challenges").insert({
    nom: rawNom,
    date_debut: rawDateDebut,
    date_fin: rawDateFin,
  });

  if (error) {
    console.error("Erreur Supabase:", error);
    return { success: false, message: "Erreur lors de la création du challenge." };
  }

  revalidatePath("/");
  return { success: true, message: "Challenge créé avec succès !" };
}

// ─────────────────────────────────────────────
// Mise à jour d'un challenge
// ─────────────────────────────────────────────
export async function updateChallenge(
  challengeId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  const rawNom = (formData.get("nom") as string)?.trim();
  const rawDateDebut = formData.get("date_debut") as string;
  const rawDateFin = formData.get("date_fin") as string;
  const rawStatut = formData.get("statut") as string;

  const errors: Record<string, string> = {};

  if (!rawNom || rawNom.length < 1) errors.nom = "Le nom du challenge est requis.";
  if (rawNom && rawNom.length > 200) errors.nom = "Le nom ne peut pas dépasser 200 caractères.";
  if (!rawDateDebut) errors.date_debut = "La date de début est requise.";
  if (!rawDateFin) errors.date_fin = "La date de fin est requise.";
  if (rawDateDebut && rawDateFin && rawDateFin < rawDateDebut)
    errors.date_fin = "La date de fin doit être après la date de début.";
  if (!rawStatut || !["actif", "termine"].includes(rawStatut))
    errors.statut = "Veuillez sélectionner un statut valide.";

  if (Object.keys(errors).length > 0) {
    return { success: false, message: "Veuillez corriger les erreurs ci-dessous.", errors };
  }

  const { error } = await supabase
    .from("challenges")
    .update({
      nom: rawNom,
      date_debut: rawDateDebut,
      date_fin: rawDateFin,
      statut: rawStatut,
    })
    .eq("id", challengeId);

  if (error) {
    console.error("Erreur Supabase:", error);
    return { success: false, message: "Erreur lors de la modification du challenge." };
  }

  revalidatePath(`/challenge/${challengeId}`);
  redirect(`/challenge/${challengeId}`);
}

// ─────────────────────────────────────────────
// Suppression d'un challenge
// ─────────────────────────────────────────────
export async function deleteChallenge(challengeId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("challenges")
    .delete()
    .eq("id", challengeId);

  if (error) {
    console.error("Erreur Supabase:", error);
    throw new Error("Impossible de supprimer le challenge.");
  }

  revalidatePath("/");
  redirect("/");
}

// ─────────────────────────────────────────────
// Création d'un participant (lié à un challenge)
// ─────────────────────────────────────────────
export async function createParticipant(
  challengeId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  const rawNom = (formData.get("nom") as string)?.trim();
  const rawPrenom = (formData.get("prenom") as string)?.trim();
  const rawAge = formData.get("age") as string;
  const rawSexe = formData.get("sexe") as string;
  const rawPoids = formData.get("poids_initial") as string;
  const rawObjectif = (formData.get("objectif") as string)?.trim() || null;

  const errors: Record<string, string> = {};

  if (!rawNom || rawNom.length < 1) errors.nom = "Le nom est requis.";
  if (rawNom && rawNom.length > 100) errors.nom = "Le nom ne peut pas dépasser 100 caractères.";
  if (!rawPrenom || rawPrenom.length < 1) errors.prenom = "Le prénom est requis.";
  if (!rawAge || isNaN(parseInt(rawAge)) || parseInt(rawAge) < 1 || parseInt(rawAge) > 150)
    errors.age = "L'âge doit être compris entre 1 et 150.";
  if (!rawSexe || !["homme", "femme", "autre"].includes(rawSexe))
    errors.sexe = "Veuillez sélectionner un sexe valide.";
  const poids = parseFloat(rawPoids);
  if (!rawPoids || isNaN(poids) || poids <= 0 || poids > 999.99)
    errors.poids_initial = "Le poids doit être un nombre positif.";

  if (Object.keys(errors).length > 0) {
    return { success: false, message: "Veuillez corriger les erreurs ci-dessous.", errors };
  }

  const { error } = await supabase.from("participants").insert({
    challenge_id: challengeId,
    nom: rawNom,
    prenom: rawPrenom,
    age: parseInt(rawAge),
    sexe: rawSexe,
    poids_initial: poids,
    objectif: rawObjectif || null,
  });

  if (error) {
    console.error("Erreur Supabase:", error);
    return { success: false, message: "Erreur lors de l'enregistrement." };
  }

  revalidatePath(`/challenge/${challengeId}`);
  redirect(`/challenge/${challengeId}`);
}

// ─────────────────────────────────────────────
// Modification d'un participant
// ─────────────────────────────────────────────
export async function updateParticipant(
  participantId: string,
  challengeId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  const rawNom = (formData.get("nom") as string)?.trim();
  const rawPrenom = (formData.get("prenom") as string)?.trim();
  const rawAge = formData.get("age") as string;
  const rawSexe = formData.get("sexe") as string;
  const rawPoids = formData.get("poids_initial") as string;
  const rawObjectif = (formData.get("objectif") as string)?.trim() || null;

  const errors: Record<string, string> = {};

  if (!rawNom || rawNom.length < 1) errors.nom = "Le nom est requis.";
  if (rawNom && rawNom.length > 100) errors.nom = "Le nom ne peut pas dépasser 100 caractères.";
  if (!rawPrenom || rawPrenom.length < 1) errors.prenom = "Le prénom est requis.";
  if (!rawAge || isNaN(parseInt(rawAge)) || parseInt(rawAge) < 1 || parseInt(rawAge) > 150)
    errors.age = "L'âge doit être compris entre 1 et 150.";
  if (!rawSexe || !["homme", "femme", "autre"].includes(rawSexe))
    errors.sexe = "Veuillez sélectionner un sexe valide.";
  const poids = parseFloat(rawPoids);
  if (!rawPoids || isNaN(poids) || poids <= 0 || poids > 999.99)
    errors.poids_initial = "Le poids doit être un nombre positif.";

  if (Object.keys(errors).length > 0) {
    return { success: false, message: "Veuillez corriger les erreurs ci-dessous.", errors };
  }

  const { error } = await supabase
    .from("participants")
    .update({
      nom: rawNom,
      prenom: rawPrenom,
      age: parseInt(rawAge),
      sexe: rawSexe,
      poids_initial: poids,
      objectif: rawObjectif || null,
    })
    .eq("id", participantId);

  if (error) {
    console.error("Erreur Supabase:", error);
    return { success: false, message: "Erreur lors de la modification." };
  }

  revalidatePath(`/participant/${participantId}`);
  redirect(`/participant/${participantId}`);
}

// ─────────────────────────────────────────────
// Suppression d'un participant
// ─────────────────────────────────────────────
export async function deleteParticipant(
  participantId: string,
  challengeId: string
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("participants")
    .delete()
    .eq("id", participantId);

  if (error) {
    console.error("Erreur Supabase:", error);
    throw new Error("Impossible de supprimer le participant.");
  }

  revalidatePath(`/challenge/${challengeId}`);
  redirect(`/challenge/${challengeId}`);
}

// ─────────────────────────────────────────────
// Création d'un participant + évaluation initiale
// ─────────────────────────────────────────────
export async function createParticipantWithEvaluation(
  challengeId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  // ─── Extraction ───
  const rawNom = (formData.get("nom") as string)?.trim();
  const rawPrenom = (formData.get("prenom") as string)?.trim();
  const rawAge = formData.get("age") as string;
  const rawSexe = formData.get("sexe") as string;
  const rawPoids = formData.get("poids_initial") as string;
  const rawProfession = (formData.get("profession") as string)?.trim() || null;
  const rawObjectifs = (formData.get("objectifs") as string)?.trim() || null;
  const rawHistoPoids = (formData.get("historique_poids") as string)?.trim() || null;
  const rawMaladies = (formData.get("maladies") as string)?.trim() || null;
  const rawAllergies = (formData.get("allergies") as string)?.trim() || null;
  const rawTraitements = (formData.get("traitements") as string)?.trim() || null;
  const rawDigestion = (formData.get("digestion") as string)?.trim() || null;
  const rawHabitudes = (formData.get("habitudes_alimentaires") as string)?.trim() || null;
  const rawHydratation = (formData.get("hydratation") as string)?.trim() || null;
  const rawSommeilStress = (formData.get("sommeil_stress") as string)?.trim() || null;
  const rawTaille = formData.get("taille") as string;
  const rawTourTaille = formData.get("tour_taille") as string;
  const rawTourHanches = formData.get("tour_hanches") as string;
  const rawTourBras = formData.get("tour_bras") as string;
  const rawMensurationsNotes = (formData.get("mensurations_notes") as string)?.trim() || null;

  // ─── Validation ───
  const errors: Record<string, string> = {};
  if (!rawNom || rawNom.length < 1) errors.nom = "Le nom est requis.";
  if (rawNom && rawNom.length > 100) errors.nom = "Le nom ne peut pas dépasser 100 caractères.";
  if (!rawPrenom || rawPrenom.length < 1) errors.prenom = "Le prénom est requis.";
  const age = parseInt(rawAge);
  if (!rawAge || isNaN(age) || age < 1 || age > 150) errors.age = "L'âge doit être entre 1 et 150.";
  if (!rawSexe || !["homme", "femme", "autre"].includes(rawSexe)) errors.sexe = "Sélectionnez un sexe.";
  const poids = parseFloat(rawPoids);
  if (!rawPoids || isNaN(poids) || poids <= 0 || poids > 999.99) errors.poids_initial = "Poids invalide.";

  if (Object.keys(errors).length > 0) {
    return { success: false, message: "Veuillez corriger les erreurs.", errors };
  }

  // ─── Insertion participant ───
  const { data: newParticipant, error: err1 } = await supabase
    .from("participants")
    .insert({
      challenge_id: challengeId,
      nom: rawNom,
      prenom: rawPrenom,
      age,
      sexe: rawSexe,
      poids_initial: poids,
      objectif: rawObjectifs || null,
    })
    .select("id")
    .single();

  if (err1 || !newParticipant) {
    console.error("Erreur participant:", err1);
    return { success: false, message: "Erreur lors de la création du participant." };
  }

  // ─── Insertion évaluation ───
  const { error: err2 } = await supabase.from("evaluations_initiales").insert({
    participant_id: newParticipant.id,
    objectifs: rawObjectifs,
    profession: rawProfession,
    historique_poids: rawHistoPoids ? { historique: rawHistoPoids } : null,
    etat_sante: {
      maladies: rawMaladies || null,
      allergies: rawAllergies || null,
      traitements: rawTraitements || null,
    },
    digestion_habitudes: {
      digestion: rawDigestion || null,
      habitudes_alimentaires: rawHabitudes || null,
      hydratation: rawHydratation || null,
    },
    sommeil_stress: rawSommeilStress,
    mensurations: {
      taille_cm: rawTaille ? parseFloat(rawTaille) : null,
      tour_taille_cm: rawTourTaille ? parseFloat(rawTourTaille) : null,
      tour_hanches_cm: rawTourHanches ? parseFloat(rawTourHanches) : null,
      tour_bras_cm: rawTourBras ? parseFloat(rawTourBras) : null,
      notes: rawMensurationsNotes || null,
    },
  });

  if (err2) {
    console.error("Erreur évaluation:", err2);
    return { success: false, message: "Participant créé mais erreur sur l'évaluation." };
  }

  revalidatePath(`/challenge/${challengeId}`);
  redirect(`/participant/${newParticipant.id}`);
}