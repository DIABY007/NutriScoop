export interface Challenge {
  id: string;
  nom: string;
  date_debut: string;
  date_fin: string;
  statut: "actif" | "termine";
  created_at: string;
}

export interface Participant {
  id: string;
  challenge_id: string;
  nom: string;
  prenom: string;
  age: number;
  sexe: "homme" | "femme" | "autre";
  poids_initial: number;
  objectif: string | null;
  created_at: string;
}

export type InsertParticipant = Omit<Participant, "id" | "created_at">;

export interface EvaluationInitiale {
  id: string;
  participant_id: string;
  objectifs: string | null;
  profession: string | null;
  historique_poids: Record<string, unknown> | null;
  etat_sante: Record<string, unknown> | null;
  digestion_habitudes: Record<string, unknown> | null;
  sommeil_stress: string | null;
  mensurations: Record<string, unknown> | null;
  created_at: string;
}

export interface DailyTracking {
  id: string;
  participant_id: string;
  date: string;
  score_petit_dej: number | null;
  score_dej: number | null;
  score_diner: number | null;
  score_hydratation: number | null;
  score_sport: number | null;
  note_sommeil: number | null;
  note_stress: number | null;
  score_total: number;
  poids_du_jour: number | null;
  tour_taille_du_jour: number | null;
  created_at: string;
}