import { createClient } from "@/utils/supabase/server";
import { CreateChallengeForm } from "@/components/create-challenge-form";
import SearchableHomePage from "@/components/searchable-home-page";

async function getChallenges() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("challenges")
    .select("id, nom, date_debut, date_fin, statut, created_at")
    .order("created_at", { ascending: false });
  return data ?? [];
}

async function getDossiers() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("suivis_nutritionnels")
    .select("id, nom, niveau_suivi, created_at")
    .order("created_at", { ascending: false });
  return data ?? [];
}

async function getParticipants() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("participants")
    .select("id, nom, prenom, age, challenge_id, created_at")
    .order("created_at", { ascending: false });
  return data ?? [];
}

async function getDossierParticipantIds(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("dossier_participants")
    .select("participant_id");
  return [...new Set((data ?? []).map((dp) => dp.participant_id))];
}

async function getParticipantCounts(): Promise<Record<string, number>> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("participants")
    .select("challenge_id");
  const counts: Record<string, number> = {};
  for (const p of data ?? []) {
    if (p.challenge_id) {
      counts[p.challenge_id] = (counts[p.challenge_id] || 0) + 1;
    }
  }
  return counts;
}

export default async function HomePage() {
  const [challenges, dossiers, participants, dossierParticipantIds, counts] = await Promise.all([
    getChallenges(),
    getDossiers(),
    getParticipants(),
    getDossierParticipantIds(),
    getParticipantCounts(),
  ]);

  return (
    <div className="flex-1 flex flex-col">
      {/* ─── Formulaire de création de challenge ─── */}
      <div className="px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10">
        <CreateChallengeForm />
      </div>

      {/* ─── Liste rechercheable (challenges + dossiers + participants) ─── */}
      <SearchableHomePage
        challenges={challenges}
        dossiers={dossiers}
        participants={participants}
        dossierParticipantIds={dossierParticipantIds}
        participantCounts={counts}
      />
    </div>
  );
}