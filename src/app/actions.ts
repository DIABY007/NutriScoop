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