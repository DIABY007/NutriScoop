import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { ChallengeParticipantList } from "@/components/challenge-participant-list";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ChallengeHubPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // ─── Récupération du challenge ───
  const { data: challenge, error } = await supabase
    .from("challenges")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !challenge) notFound();

  // ─── Participants du challenge ───
  const { data: participants } = await supabase
    .from("participants")
    .select("id, nom, prenom, age, sexe, poids_initial, objectif, created_at")
    .eq("challenge_id", id)
    .order("created_at", { ascending: false });

  const liste = participants ?? [];

  const estActif =
    challenge.statut === "actif" && new Date(challenge.date_fin) >= new Date();

  return (
    <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      {/* ─── Retour ─── */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-6 min-h-11 w-fit"
      >
        <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
        Tous les challenges
      </Link>

      {/* ─── Bannière du challenge ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-surface border border-border shadow-sm mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {challenge.nom}
            </h1>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                estActif
                  ? "bg-success/10 text-success"
                  : "bg-muted/30 text-muted-foreground"
              }`}
            >
              {estActif ? "Actif" : "Terminé"}
            </span>
          </div>
          <p className="text-sm text-muted">
            Du {new Date(challenge.date_debut).toLocaleDateString("fr-FR")}
            {" au "}
            {new Date(challenge.date_fin).toLocaleDateString("fr-FR")}
            {" · "}
            {liste.length} participant{liste.length > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* ─── Section A : Participants ─── */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Participants
          </h2>
          <Link
            href={`/nouveau-participant?challenge_id=${id}`}
            className="inline-flex items-center justify-center gap-2 min-h-11 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover transition-colors shadow-sm"
          >
            <svg className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Ajouter
          </Link>
        </div>

        {liste.length > 0 ? (
          <ChallengeParticipantList
            participants={liste}
            challengeId={id}
          />
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-12 px-4 rounded-2xl bg-surface border border-dashed border-border text-center">
            <svg className="size-10 text-muted-foreground/30 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
            <p className="text-sm text-muted">
              Aucun participant dans ce challenge.
            </p>
            <Link
              href={`/nouveau-participant?challenge_id=${id}`}
              className="mt-4 inline-flex items-center justify-center gap-2 min-h-11 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover transition-colors shadow-sm"
            >
              <svg className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Ajouter un participant
            </Link>
          </div>
        )}
      </section>

      {/* ─── Section B : Classement du Challenge (placeholder) ─── */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Classement du Challenge
        </h2>
        <div className="flex flex-col items-center justify-center py-12 px-4 rounded-2xl bg-surface border border-dashed border-border text-center">
          <svg className="size-10 text-muted-foreground/30 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0 1 16.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 0 1-2.77.896m0 0a6.022 6.022 0 0 1-2.77-.896m0 0a6.023 6.023 0 0 1-2.77-.896" />
          </svg>
          <p className="text-sm text-muted">
            Le classement des participants de ce challenge sera disponible
            prochainement.
          </p>
        </div>
      </section>
    </div>
  );
}