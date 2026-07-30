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
// Création d'un suivi nutritionnel
// ─────────────────────────────────────────────
export async function createSuiviNutritionnel(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  const rawNom = (formData.get("nom") as string)?.trim();
  const rawParticipantId = formData.get("participant_id") as string;
  const rawNiveau = formData.get("niveau_suivi") as string;

  const errors: Record<string, string> = {};
  if (!rawNom || rawNom.length < 1) errors.nom = "Le nom du dossier est requis.";
  if (rawNom && rawNom.length > 200) errors.nom = "Le nom ne peut pas dépasser 200 caractères.";
  if (!rawParticipantId) errors.participant_id = "Le participant est requis.";
  if (!rawNiveau || !["ESSENTIELLE", "RENFORCEE", "INTENSE", "CLINIQUE"].includes(rawNiveau))
    errors.niveau_suivi = "Sélectionnez un niveau de suivi valide.";

  if (Object.keys(errors).length > 0) {
    return { success: false, message: "Veuillez corriger les erreurs ci-dessous.", errors };
  }

  const { data: newSuivi, error } = await supabase
    .from("suivis_nutritionnels")
    .insert({
      nom: rawNom,
      participant_id: rawParticipantId,
      niveau_suivi: rawNiveau,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Erreur Supabase:", error);
    return { success: false, message: "Erreur lors de la création du suivi nutritionnel." };
  }

  revalidatePath("/suivi-nutritionnel");
  redirect(`/suivi-nutritionnel/${newSuivi.id}`);
}

// ─────────────────────────────────────────────
// Suppression d'un suivi nutritionnel
// ─────────────────────────────────────────────
export async function deleteSuiviNutritionnel(
  suiviId: string
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("suivis_nutritionnels")
    .delete()
    .eq("id", suiviId);

  if (error) {
    console.error("Erreur Supabase:", error);
    throw new Error("Impossible de supprimer le suivi nutritionnel.");
  }

  revalidatePath("/suivi-nutritionnel");
  redirect("/suivi-nutritionnel");
}

// ─────────────────────────────────────────────
// Mise à jour du niveau de suivi
// ─────────────────────────────────────────────
export async function updateNiveauSuivi(
  suiviId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const rawNiveau = formData.get("niveau_suivi") as string;

  if (!rawNiveau || !["ESSENTIELLE", "RENFORCEE", "INTENSE", "CLINIQUE"].includes(rawNiveau)) {
    return { success: false, message: "Niveau de suivi invalide.", errors: { niveau_suivi: "Valeur invalide." } };
  }

  const { error } = await supabase
    .from("suivis_nutritionnels")
    .update({ niveau_suivi: rawNiveau })
    .eq("id", suiviId);

  if (error) {
    console.error("Erreur Supabase:", error);
    return { success: false, message: "Erreur lors de la mise à jour." };
  }

  revalidatePath(`/suivi-nutritionnel/${suiviId}`);
  return { success: true, message: "Niveau de suivi mis à jour." };
}

// ─────────────────────────────────────────────
// Sauvegarde de l'évaluation nutritionnelle
// ─────────────────────────────────────────────
export async function saveEvaluation(
  suiviId: string,
  data: Record<string, string>
): Promise<ActionState> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("suivis_nutritionnels")
    .update({ evaluation_nutritionnelle: data })
    .eq("id", suiviId);

  if (error) {
    console.error("Erreur Supabase:", error);
    return { success: false, message: "Erreur lors de la sauvegarde de l'évaluation." };
  }

  revalidatePath(`/suivi-nutritionnel/${suiviId}`);
  return { success: true, message: "Évaluation sauvegardée avec succès !" };
}

// ─────────────────────────────────────────────
// Sauvegarde du programme nutritionnel
// ─────────────────────────────────────────────
export async function saveProgramme(
  suiviId: string,
  html: string
): Promise<ActionState> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("suivis_nutritionnels")
    .update({ programme_nutritionnel: html })
    .eq("id", suiviId);

  if (error) {
    console.error("Erreur Supabase:", error);
    return { success: false, message: "Erreur lors de la sauvegarde du programme." };
  }

  revalidatePath(`/suivi-nutritionnel/${suiviId}`);
  return { success: true, message: "Programme sauvegardé avec succès !" };
}