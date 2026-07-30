import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { SuiviNutritionnelTabs } from "./suivi-tabs";
import CopyLinkButton from "@/components/copy-link-button";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function SuiviNutritionnelPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // ─── 1. Récupération du suivi nutritionnel par son ID ───
  const { data: suivi, error: suiviError } = await supabase
    .from("suivis_nutritionnels")
    .select("*")
    .eq("id", id)
    .single();

  if (suiviError || !suivi) notFound();

  // ─── 2. Récupération du participant lié ───
  const { data: participant } = await supabase
    .from("participants")
    .select("*, challenges(nom)")
    .eq("id", suivi.participant_id)
    .single();

  if (!participant) notFound();

  const challengeNom = (participant.challenges as { nom: string } | null)?.nom ?? "Challenge";
  const initiales = `${participant.prenom.charAt(0).toUpperCase()}${participant.nom.charAt(0).toUpperCase()}`;

  return (
    <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      {/* ─── Retour ─── */}
      <Link
        href="/suivi-nutritionnel"
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
        Tous les dossiers de suivi
      </Link>

      {/* ─── Bannière ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-6 rounded-2xl bg-surface border border-border shadow-sm mb-8">
        <span className="flex items-center justify-center size-16 sm:size-20 rounded-full bg-primary-light text-primary text-xl sm:text-2xl font-bold shrink-0">
          {initiales}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {suivi.nom}
          </h1>
          <p className="text-sm text-muted mt-1">
            {participant.prenom} {participant.nom} · {participant.age} ans · {challengeNom}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 self-start sm:self-center flex-wrap">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-success/10 text-success">
            Suivi actif
          </span>
          <CopyLinkButton accessToken={suivi.access_token} participantPrenom={participant.prenom} />
        </div>
      </div>

      {/* ─── Onglets Évaluation / Programme ─── */}
      <SuiviNutritionnelTabs participantId={suivi.participant_id} suivi={suivi} />
    </div>
  );
}