"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type DailyTrackingState = {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
};

function parseScore(value: string, min: number, max: number): number | null {
  if (!value?.trim()) return null;
  const n = parseInt(value);
  if (isNaN(n) || n < min || n > max) return null;
  return n;
}

export async function addDailyTracking(
  participantId: string,
  _prevState: DailyTrackingState,
  formData: FormData
): Promise<DailyTrackingState> {
  const supabase = await createClient();

  // ─── Extraction ───
  const rawDate = formData.get("date") as string;
  const rawPetitDej = formData.get("score_petit_dej") as string;
  const rawDej = formData.get("score_dej") as string;
  const rawDiner = formData.get("score_diner") as string;
  const rawHydratation = formData.get("score_hydratation") as string;
  const rawSport = formData.get("score_sport") as string;
  const rawSommeil = (formData.get("note_sommeil") as string)?.trim() || "";
  const rawStress = (formData.get("note_stress") as string)?.trim() || "";
  const rawPoidsJour = (formData.get("poids_du_jour") as string)?.trim() || "";
  const rawTourTailleJour = (formData.get("tour_taille_du_jour") as string)?.trim() || "";

  // ─── Validation ───
  const errors: Record<string, string> = {};

  if (!rawDate) errors.date = "La date est requise.";

  const petitDej = parseScore(rawPetitDej, 0, 40);
  const dej = parseScore(rawDej, 0, 40);
  const diner = parseScore(rawDiner, 0, 40);
  const hydratation = parseScore(rawHydratation, 0, 20);
  const sport = parseScore(rawSport, 0, 40);

  if (petitDej === null && rawPetitDej.trim())
    errors.score_petit_dej = "Doit être entre 0 et 40.";
  if (dej === null && rawDej.trim())
    errors.score_dej = "Doit être entre 0 et 40.";
  if (diner === null && rawDiner.trim())
    errors.score_diner = "Doit être entre 0 et 40.";
  if (hydratation === null && rawHydratation.trim())
    errors.score_hydratation = "Doit être entre 0 et 20.";
  if (sport === null && rawSport.trim())
    errors.score_sport = "Doit être entre 0 et 40.";

  const sommeil = rawSommeil ? parseInt(rawSommeil) : null;
  if (sommeil !== null && (isNaN(sommeil) || sommeil < 0 || sommeil > 10))
    errors.note_sommeil = "Doit être entre 0 et 10.";

  const stress = rawStress ? parseInt(rawStress) : null;
  if (stress !== null && (isNaN(stress) || stress < 0 || stress > 10))
    errors.note_stress = "Doit être entre 0 et 10.";

  const poidsJour = rawPoidsJour ? parseFloat(rawPoidsJour) : null;
  if (poidsJour !== null && (isNaN(poidsJour) || poidsJour <= 0 || poidsJour > 999.99))
    errors.poids_du_jour = "Poids invalide.";

  const tourTailleJour = rawTourTailleJour ? parseInt(rawTourTailleJour) : null;
  if (tourTailleJour !== null && (isNaN(tourTailleJour) || tourTailleJour <= 0 || tourTailleJour > 300))
    errors.tour_taille_du_jour = "Tour de taille invalide.";

  if (Object.keys(errors).length > 0) {
    return { success: false, message: "Veuillez corriger les erreurs.", errors };
  }

  // ─── Calcul du score total (max 100) ───
  // Score Nutrition = moyenne des repas renseignés (max 40)
  const scoresRepas = [petitDej, dej, diner].filter((s): s is number => s !== null);
  const scoreNutrition = scoresRepas.length > 0
    ? Math.round(scoresRepas.reduce((a, b) => a + b, 0) / scoresRepas.length)
    : 0;
  const scoreTotal = scoreNutrition + (hydratation ?? 0) + (sport ?? 0);

  // ─── Récupérer les valeurs existantes pour les compléter ───
  const { data: existing } = await supabase
    .from("daily_tracking")
    .select("score_petit_dej, score_dej, score_diner, score_hydratation, score_sport, note_sommeil, note_stress, poids_du_jour, tour_taille_du_jour")
    .eq("participant_id", participantId)
    .eq("date", rawDate)
    .single();

  const finalPetitDej = petitDej ?? existing?.score_petit_dej;
  const finalDej = dej ?? existing?.score_dej;
  const finalDiner = diner ?? existing?.score_diner;
  const finalHydratation = hydratation ?? existing?.score_hydratation;
  const finalSport = sport ?? existing?.score_sport;
  const finalSommeil = sommeil ?? existing?.note_sommeil;
  const finalStress = stress ?? existing?.note_stress;
  const finalPoidsJour = poidsJour ?? existing?.poids_du_jour;
  const finalTourTailleJour = tourTailleJour ?? existing?.tour_taille_du_jour;

  const scoresRepasFinal = [finalPetitDej, finalDej, finalDiner].filter((s): s is number => s !== null);
  const scoreNutritionFinal = scoresRepasFinal.length > 0
    ? Math.round(scoresRepasFinal.reduce((a, b) => a + b, 0) / scoresRepasFinal.length)
    : 0;
  const scoreTotalFinal = scoreNutritionFinal + (finalHydratation ?? 0) + (finalSport ?? 0);

  // ─── Upsert : crée ou met à jour l'entrée existante ───
  const { error } = await supabase.from("daily_tracking").upsert({
    participant_id: participantId,
    date: rawDate,
    score_petit_dej: finalPetitDej,
    score_dej: finalDej,
    score_diner: finalDiner,
    score_hydratation: finalHydratation,
    score_sport: finalSport,
    note_sommeil: finalSommeil,
    note_stress: finalStress,
    score_total: scoreTotalFinal,
    poids_du_jour: finalPoidsJour,
    tour_taille_du_jour: finalTourTailleJour,
  }, { onConflict: "participant_id, date" });

  if (error) {
    console.error("Erreur Supabase:", error);
    return {
      success: false,
      message: "Erreur lors de l'enregistrement. Veuillez réessayer.",
    };
  }

  revalidatePath(`/participant/${participantId}`);
  return { success: true, message: "Suivi enregistré avec succès !" };
}

// ─────────────────────────────────────────────
// Suppression d'une entrée de suivi
// ─────────────────────────────────────────────
export async function deleteDailyTracking(
  entryId: string,
  participantId: string
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("daily_tracking")
    .delete()
    .eq("id", entryId);

  if (error) {
    console.error("Erreur Supabase:", error);
    throw new Error("Impossible de supprimer l'entrée.");
  }

  revalidatePath(`/participant/${participantId}`);
}

// ─────────────────────────────────────────────
// Modification d'une entrée de suivi
// ─────────────────────────────────────────────
export async function updateDailyTracking(
  entryId: string,
  participantId: string,
  _prevState: DailyTrackingState,
  formData: FormData
): Promise<DailyTrackingState> {
  const supabase = await createClient();

  const rawDate = formData.get("date") as string;
  const rawPetitDej = formData.get("score_petit_dej") as string;
  const rawDej = formData.get("score_dej") as string;
  const rawDiner = formData.get("score_diner") as string;
  const rawHydratation = formData.get("score_hydratation") as string;
  const rawSport = formData.get("score_sport") as string;
  const rawSommeil = (formData.get("note_sommeil") as string)?.trim() || "";
  const rawStress = (formData.get("note_stress") as string)?.trim() || "";
  const rawPoidsJour = (formData.get("poids_du_jour") as string)?.trim() || "";
  const rawTourTailleJour = (formData.get("tour_taille_du_jour") as string)?.trim() || "";

  const errors: Record<string, string> = {};
  if (!rawDate) errors.date = "La date est requise.";

  const petitDej = parseScore(rawPetitDej, 0, 40);
  const dej = parseScore(rawDej, 0, 40);
  const diner = parseScore(rawDiner, 0, 40);
  const hydratation = parseScore(rawHydratation, 0, 20);
  const sport = parseScore(rawSport, 0, 40);

  if (petitDej === null && rawPetitDej.trim()) errors.score_petit_dej = "Doit être entre 0 et 40.";
  if (dej === null && rawDej.trim()) errors.score_dej = "Doit être entre 0 et 40.";
  if (diner === null && rawDiner.trim()) errors.score_diner = "Doit être entre 0 et 40.";
  if (hydratation === null && rawHydratation.trim()) errors.score_hydratation = "Doit être entre 0 et 20.";
  if (sport === null && rawSport.trim()) errors.score_sport = "Doit être entre 0 et 40.";

  const sommeil = rawSommeil ? parseInt(rawSommeil) : null;
  if (sommeil !== null && (isNaN(sommeil) || sommeil < 0 || sommeil > 10)) errors.note_sommeil = "Doit être entre 0 et 10.";
  const stress = rawStress ? parseInt(rawStress) : null;
  if (stress !== null && (isNaN(stress) || stress < 0 || stress > 10)) errors.note_stress = "Doit être entre 0 et 10.";
  const poidsJour = rawPoidsJour ? parseFloat(rawPoidsJour) : null;
  if (poidsJour !== null && (isNaN(poidsJour) || poidsJour <= 0 || poidsJour > 999.99)) errors.poids_du_jour = "Poids invalide.";
  const tourTailleJour = rawTourTailleJour ? parseInt(rawTourTailleJour) : null;
  if (tourTailleJour !== null && (isNaN(tourTailleJour) || tourTailleJour <= 0 || tourTailleJour > 300)) errors.tour_taille_du_jour = "Tour de taille invalide.";

  if (Object.keys(errors).length > 0) {
    return { success: false, message: "Veuillez corriger les erreurs.", errors };
  }

  // ─── Récupérer les valeurs existantes pour les compléter ───
  const { data: existing } = await supabase
    .from("daily_tracking")
    .select("score_petit_dej, score_dej, score_diner, score_hydratation, score_sport, note_sommeil, note_stress, poids_du_jour, tour_taille_du_jour")
    .eq("id", entryId)
    .single();

  const finalPetitDej = petitDej ?? existing?.score_petit_dej;
  const finalDej = dej ?? existing?.score_dej;
  const finalDiner = diner ?? existing?.score_diner;
  const finalHydratation = hydratation ?? existing?.score_hydratation;
  const finalSport = sport ?? existing?.score_sport;

  const scoresRepasFinal = [finalPetitDej, finalDej, finalDiner].filter((s): s is number => s !== null);
  const scoreNutritionFinal = scoresRepasFinal.length > 0
    ? Math.round(scoresRepasFinal.reduce((a, b) => a + b, 0) / scoresRepasFinal.length)
    : 0;
  const scoreTotalFinal = scoreNutritionFinal + (finalHydratation ?? 0) + (finalSport ?? 0);

  // On ne met à jour que les champs qui ont été effectivement remplis
  const updatePayload: Record<string, unknown> = { date: rawDate, score_total: scoreTotalFinal };
  if (petitDej !== null) updatePayload.score_petit_dej = petitDej;
  if (dej !== null) updatePayload.score_dej = dej;
  if (diner !== null) updatePayload.score_diner = diner;
  if (hydratation !== null) updatePayload.score_hydratation = hydratation;
  if (sport !== null) updatePayload.score_sport = sport;
  if (sommeil !== null) updatePayload.note_sommeil = sommeil;
  if (stress !== null) updatePayload.note_stress = stress;
  if (poidsJour !== null) updatePayload.poids_du_jour = poidsJour;
  if (tourTailleJour !== null) updatePayload.tour_taille_du_jour = tourTailleJour;

  const { error } = await supabase
    .from("daily_tracking")
    .update(updatePayload)
    .eq("id", entryId);

  if (error) {
    console.error("Erreur Supabase:", error);
    return { success: false, message: "Erreur lors de la modification." };
  }

  revalidatePath(`/participant/${participantId}`);
  return { success: true, message: "Suivi modifié avec succès !" };
}