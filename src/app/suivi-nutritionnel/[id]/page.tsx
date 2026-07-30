import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { SuiviNutritionnelTabs } from "./suivi-tabs";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function SuiviNutritionnelPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // ─── Récupération du participant ───
  const { data: participant, error } = await supabase
    .from("participants")
    .select("*, challenges(nom)")
    .eq("id", id)
    .single();

  if (error || !participant) notFound();

  // ─── Récupération du suivi nutritionnel existant ───
  const { data: suivi } = await supabase
    .from("suivis_nutritionnels")
    .select("*")
    .eq("participant_id", id)
    .single();

  const challengeNom = (participant.challenges as { nom: string } | null)?.nom ?? "Challenge";
  const initiales = `${participant.prenom.charAt(0).toUpperCase()}${participant.nom.charAt(0).toUpperCase()}`;

  return (
    <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      {/* ─── Retour ─── */}
      <Link
        href={`/participant/${participant.id}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-6 min-h-11 w-fit"
      >
        <svg
          className="size-4 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
        Retour au profil — {participant.prenom} {participant.nom}
      </Link>

      {/* ─── Bannière ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-6 rounded-2xl bg-surface border border-border shadow-sm mb-8">
        <span className="flex items-center justify-center size-16 sm:size-20 rounded-full bg-primary-light text-primary text-xl sm:text-2xl font-bold shrink-0">
          {initiales}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Suivi nutritionnel
          </h1>
          <p className="text-sm text-muted mt-1">
            {participant.prenom} {participant.nom} · {participant.age} ans · {challengeNom}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
          <span
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
              suivi
                ? "bg-success/10 text-success"
                : "bg-muted/30 text-muted-foreground"
            }`}
          >
            {suivi ? "Suivi actif" : "À initier"}
          </span>
        </div>
      </div>

      {/* ─── Onglets Évaluation / Programme ─── */}
      <SuiviNutritionnelTabs participantId={id} suivi={suivi} />
    </div>
  );
}