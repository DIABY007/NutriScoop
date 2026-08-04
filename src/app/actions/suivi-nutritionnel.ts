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
// Création d'un suivi nutritionnel (dossier)
// ─────────────────────────────────────────────
export async function createSuiviNutritionnel(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  const rawNom = (formData.get("nom") as string)?.trim();
  const rawParticipantId = formData.get("participant_id") as string;
  const rawNiveau = formData.get("niveau_suivi") as string;
  const rawParticipantIds = formData.getAll("participant_ids") as string[];

  const errors: Record<string, string> = {};
  if (!rawNom || rawNom.length < 1) errors.nom = "Le nom du dossier est requis.";
  if (rawNom && rawNom.length > 200) errors.nom = "Le nom ne peut pas dépasser 200 caractères.";
  if (!rawNiveau || !["ESSENTIELLE", "RENFORCEE", "INTENSE", "CLINIQUE"].includes(rawNiveau))
    errors.niveau_suivi = "Sélectionnez un niveau de suivi valide.";

  // Au moins un participant (soit participant_id legacy, soit participant_ids multiple)
  const hasParticipant = !!rawParticipantId || rawParticipantIds.length > 0;
  if (!hasParticipant) {
    errors.participant_id = "Au moins un participant est requis.";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, message: "Veuillez corriger les erreurs ci-dessous.", errors };
  }

  // ─── Création du dossier ───
  const { data: newSuivi, error } = await supabase
    .from("suivis_nutritionnels")
    .insert({
      nom: rawNom,
      niveau_suivi: rawNiveau,
    })
    .select("id")
    .single();

  if (error || !newSuivi) {
    console.error("Erreur Supabase:", error);
    return { success: false, message: "Erreur lors de la création du suivi nutritionnel." };
  }

  // ─── Lier les participants ───
  const allParticipantIds = rawParticipantIds.length > 0
    ? rawParticipantIds
    : rawParticipantId
      ? [rawParticipantId]
      : [];

  if (allParticipantIds.length > 0) {
    const rows = allParticipantIds.map((pid) => ({
      dossier_id: newSuivi.id,
      participant_id: pid,
    }));

    const { error: linkError } = await supabase
      .from("dossier_participants")
      .insert(rows);

    if (linkError) {
      console.error("Erreur liaison participants:", linkError);
      // On nettoie le dossier créé
      await supabase.from("suivis_nutritionnels").delete().eq("id", newSuivi.id);
      return { success: false, message: "Erreur lors de la liaison des participants." };
    }
  }

  revalidatePath("/suivi-nutritionnel");
  redirect(`/suivi-nutritionnel/${newSuivi.id}`);
}

// ─────────────────────────────────────────────
// Ajouter un participant existant à un dossier
// ─────────────────────────────────────────────
export async function addParticipantToDossier(
  dossierId: string,
  participantId: string
): Promise<ActionState> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("dossier_participants")
    .insert({
      dossier_id: dossierId,
      participant_id: participantId,
    });

  if (error) {
    if (error.code === "23505") {
      return { success: false, message: "Ce participant est déjà dans le dossier." };
    }
    console.error("Erreur ajout participant:", error);
    return { success: false, message: "Erreur lors de l'ajout du participant." };
  }

  revalidatePath(`/suivi-nutritionnel/${dossierId}`);
  return { success: true, message: "Participant ajouté au dossier." };
}

// ─────────────────────────────────────────────
// Créer un participant simplifié et l'ajouter à un dossier
// Champs : nom, prénom, âge, téléphone, profession
// ─────────────────────────────────────────────
export async function createParticipantInDossier(
  dossierId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  const rawNom = (formData.get("nom") as string)?.trim();
  const rawPrenom = (formData.get("prenom") as string)?.trim();
  const rawAge = formData.get("age") as string;
  const rawTelephone = (formData.get("telephone") as string)?.trim() || null;
  const rawProfession = (formData.get("profession") as string)?.trim() || null;

  const errors: Record<string, string> = {};

  if (!rawNom || rawNom.length < 1) errors.nom = "Le nom est requis.";
  if (rawNom && rawNom.length > 100) errors.nom = "Le nom ne peut pas dépasser 100 caractères.";
  if (!rawPrenom || rawPrenom.length < 1) errors.prenom = "Le prénom est requis.";
  if (!rawAge || isNaN(parseInt(rawAge)) || parseInt(rawAge) < 1 || parseInt(rawAge) > 150)
    errors.age = "L'âge doit être compris entre 1 et 150.";

  if (Object.keys(errors).length > 0) {
    return { success: false, message: "Veuillez corriger les erreurs ci-dessous.", errors };
  }

  // ─── Création du participant (sans challenge_id, sexe, poids_initial) ───
  const { data: newParticipant, error: err1 } = await supabase
    .from("participants")
    .insert({
      nom: rawNom,
      prenom: rawPrenom,
      age: parseInt(rawAge),
      telephone: rawTelephone,
      profession: rawProfession,
    })
    .select("id")
    .single();

  if (err1 || !newParticipant) {
    console.error("Erreur création participant:", err1);
    return { success: false, message: "Erreur lors de la création du participant." };
  }

  // ─── Liaison au dossier ───
  const { error: linkError } = await supabase
    .from("dossier_participants")
    .insert({
      dossier_id: dossierId,
      participant_id: newParticipant.id,
    });

  if (linkError) {
    console.error("Erreur liaison participant:", linkError);
    return { success: false, message: "Participant créé mais erreur de liaison au dossier." };
  }

  revalidatePath(`/suivi-nutritionnel/${dossierId}`);
  return { success: true, message: "Participant créé et ajouté au dossier !", errors: { _redirect: newParticipant.id } };
}

// ─────────────────────────────────────────────
// Retirer un participant d'un dossier
// ─────────────────────────────────────────────
export async function removeParticipantFromDossier(
  dossierId: string,
  participantId: string
): Promise<ActionState> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("dossier_participants")
    .delete()
    .eq("dossier_id", dossierId)
    .eq("participant_id", participantId);

  if (error) {
    console.error("Erreur retrait participant:", error);
    return { success: false, message: "Erreur lors du retrait du participant." };
  }

  revalidatePath(`/suivi-nutritionnel/${dossierId}`);
  return { success: true, message: "Participant retiré du dossier." };
}

// ─────────────────────────────────────────────
// Récupérer les participants d'un dossier
// ─────────────────────────────────────────────
export async function getDossierParticipants(dossierId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("dossier_participants")
    .select("*, participants(*)")
    .eq("dossier_id", dossierId)
    .order("created_at", { ascending: false });

  return data ?? [];
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