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
// Création d'un participant
// ─────────────────────────────────────────────
export async function createParticipant(
  prevState: ActionState,
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
  if (rawPrenom && rawPrenom.length > 100) errors.prenom = "Le prénom ne peut pas dépasser 100 caractères.";

  const age = parseInt(rawAge);
  if (!rawAge || isNaN(age) || age < 1 || age > 150) errors.age = "L'âge doit être compris entre 1 et 150.";

  if (!rawSexe || !["homme", "femme", "autre"].includes(rawSexe)) errors.sexe = "Veuillez sélectionner un sexe valide.";

  const poids = parseFloat(rawPoids);
  if (!rawPoids || isNaN(poids) || poids <= 0) errors.poids_initial = "Le poids initial doit être un nombre positif.";
  if (poids > 999.99) errors.poids_initial = "Le poids initial est trop élevé.";

  if (Object.keys(errors).length > 0) {
    return { success: false, message: "Veuillez corriger les erreurs ci-dessous.", errors };
  }

  const { error } = await supabase.from("participants").insert({
    nom: rawNom,
    prenom: rawPrenom,
    age,
    sexe: rawSexe,
    poids_initial: poids,
    objectif: rawObjectif || null,
  });

  if (error) {
    console.error("Erreur Supabase:", error);
    return { success: false, message: "Erreur lors de l'enregistrement. Veuillez réessayer." };
  }

  redirect("/");
}

// ─────────────────────────────────────────────
// Modification d'un participant
// ─────────────────────────────────────────────
export async function updateParticipant(
  participantId: string,
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
  if (rawPrenom && rawPrenom.length > 100) errors.prenom = "Le prénom ne peut pas dépasser 100 caractères.";

  const age = parseInt(rawAge);
  if (!rawAge || isNaN(age) || age < 1 || age > 150) errors.age = "L'âge doit être compris entre 1 et 150.";

  if (!rawSexe || !["homme", "femme", "autre"].includes(rawSexe)) errors.sexe = "Veuillez sélectionner un sexe valide.";

  const poids = parseFloat(rawPoids);
  if (!rawPoids || isNaN(poids) || poids <= 0) errors.poids_initial = "Le poids initial doit être un nombre positif.";
  if (poids > 999.99) errors.poids_initial = "Le poids initial est trop élevé.";

  if (Object.keys(errors).length > 0) {
    return { success: false, message: "Veuillez corriger les erreurs ci-dessous.", errors };
  }

  const { error } = await supabase
    .from("participants")
    .update({
      nom: rawNom,
      prenom: rawPrenom,
      age,
      sexe: rawSexe,
      poids_initial: poids,
      objectif: rawObjectif || null,
    })
    .eq("id", participantId);

  if (error) {
    console.error("Erreur Supabase:", error);
    return { success: false, message: "Erreur lors de la modification. Veuillez réessayer." };
  }

  revalidatePath(`/participant/${participantId}`);
  redirect(`/participant/${participantId}`);
}

// ─────────────────────────────────────────────
// Suppression d'un participant
// ─────────────────────────────────────────────
export async function deleteParticipant(participantId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("participants")
    .delete()
    .eq("id", participantId);

  if (error) {
    console.error("Erreur Supabase:", error);
    throw new Error("Impossible de supprimer le participant.");
  }

  revalidatePath("/");
  redirect("/");
}