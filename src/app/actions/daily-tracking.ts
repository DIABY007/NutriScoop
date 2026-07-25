"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type DailyTrackingState = {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
};

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

  // ─── Validation ───
  const errors: Record<string, string> = {};

  if (!rawDate) errors.date = "La date est requise.";

  const petitDej = parseInt(rawPetitDej);
  if (isNaN(petitDej) || petitDej < 0 || petitDej > 40)
    errors.score_petit_dej = "Doit être entre 0 et 40.";

  const dej = parseInt(rawDej);
  if (isNaN(dej) || dej < 0 || dej > 40)
    errors.score_dej = "Doit être entre 0 et 40.";

  const diner = parseInt(rawDiner);
  if (isNaN(diner) || diner < 0 || diner > 40)
    errors.score_diner = "Doit être entre 0 et 40.";

  const hydratation = parseInt(rawHydratation);
  if (isNaN(hydratation) || hydratation < 0 || hydratation > 20)
    errors.score_hydratation = "Doit être entre 0 et 20.";

  const sport = parseInt(rawSport);
  if (isNaN(sport) || sport < 0 || sport > 40)
    errors.score_sport = "Doit être entre 0 et 40.";

  const sommeil = rawSommeil ? parseInt(rawSommeil) : null;
  if (sommeil !== null && (isNaN(sommeil) || sommeil < 0 || sommeil > 10))
    errors.note_sommeil = "Doit être entre 0 et 10.";

  const stress = rawStress ? parseInt(rawStress) : null;
  if (stress !== null && (isNaN(stress) || stress < 0 || stress > 10))
    errors.note_stress = "Doit être entre 0 et 10.";

  if (Object.keys(errors).length > 0) {
    return { success: false, message: "Veuillez corriger les erreurs.", errors };
  }

  // ─── Calcul du score total (max 100) ───
  // Score Nutrition = moyenne des 3 repas (max 40)
  const scoreNutrition = Math.round((petitDej + dej + diner) / 3);
  // Score Total = Nutrition + Hydratation + Sport (max 40 + 20 + 40 = 100)
  const scoreTotal = scoreNutrition + hydratation + sport;

  // ─── Insertion ───
  const { error } = await supabase.from("daily_tracking").insert({
    participant_id: participantId,
    date: rawDate,
    score_petit_dej: petitDej,
    score_dej: dej,
    score_diner: diner,
    score_hydratation: hydratation,
    score_sport: sport,
    note_sommeil: sommeil,
    note_stress: stress,
    score_total: scoreTotal,
  });

  if (error) {
    // Gestion de la contrainte UNIQUE (participant_id, date)
    if (error.code === "23505") {
      return {
        success: false,
        message: "Un suivi existe déjà pour cette date.",
      };
    }
    console.error("Erreur Supabase:", error);
    return {
      success: false,
      message: "Erreur lors de l'enregistrement. Veuillez réessayer.",
    };
  }

  revalidatePath(`/participant/${participantId}`);
  return { success: true, message: "Suivi enregistré avec succès !" };
}