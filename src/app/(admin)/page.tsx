import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { CreateChallengeForm } from "@/components/create-challenge-form";

async function getChallenges() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("challenges")
    .select("id, nom, date_debut, date_fin, statut, created_at")
    .order("created_at", { ascending: false });
  return data ?? [];
}

async function getParticipantCounts(): Promise<Record<string, number>> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("participants")
    .select("challenge_id");
  const counts: Record<string, number> = {};
  for (const p of data ?? []) {
    counts[p.challenge_id] = (counts[p.challenge_id] || 0) + 1;
  }
  return counts;
}

export default async function HomePage() {
  const [challenges, counts] = await Promise.all([
    getChallenges(),
    getParticipantCounts(),
  ]);

  const now = new Date();

  return (
    <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      {/* ─── En-tête ─── */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Mes Challenges
        </h1>
        <p className="mt-1 text-sm text-muted">
          {challenges.length > 0
            ? `${challenges.length} challenge${challenges.length > 1 ? "s" : ""}`
            : "Créez votre premier challenge pour débuter le suivi."}
        </p>
      </div>

      {/* ─── Formulaire de création ─── */}
      <div className="mb-10">
        <CreateChallengeForm />
      </div>

      {/* ─── Liste des challenges ─── */}
      {challenges.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {challenges.map((c) => {
            const estActif = c.statut === "actif" && new Date(c.date_fin) >= now;
            const nbParticipants = counts[c.id] ?? 0;

            return (
              <Link
                key={c.id}
                href={`/challenge/${c.id}`}
                className="flex flex-col gap-3 p-5 rounded-xl bg-surface border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              >
                {/* En-tête */}
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold text-foreground">
                    {c.nom}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${
                      estActif
                        ? "bg-success/10 text-success"
                        : "bg-muted/30 text-muted-foreground"
                    }`}
                  >
                    {estActif ? "Actif" : "Terminé"}
                  </span>
                </div>

                {/* Infos */}
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                  <span>
                    Du {new Date(c.date_debut).toLocaleDateString("fr-FR")}
                  </span>
                  <span>
                    au {new Date(c.date_fin).toLocaleDateString("fr-FR")}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted pt-1 border-t border-border">
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                  </svg>
                  <span>{nbParticipants} participant{nbParticipants > 1 ? "s" : ""}</span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}