import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { SuiviNutritionnelTabs } from "./suivi-tabs";
import { DossierParticipantManager } from "@/components/dossier-participant-manager";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function SuiviNutritionnelPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // ─── 1. Récupération du suivi nutritionnel ───
  const { data: suivi, error: suiviError } = await supabase
    .from("suivis_nutritionnels")
    .select("*")
    .eq("id", id)
    .single();

  if (suiviError || !suivi) notFound();

  // ─── 2. Récupération des participants liés via dossier_participants ───
  const { data: dossierParticipants } = await supabase
    .from("dossier_participants")
    .select("*, participants(*)")
    .eq("dossier_id", id)
    .order("created_at", { ascending: false });

  const participantsList = dossierParticipants ?? [];
  const hasParticipants = participantsList.length > 0;

  // ─── 3. Premier participant pour l'affichage du résumé dans la bannière ───
  const firstParticipant = participantsList[0]?.participants as {
    id: string; nom: string; prenom: string; age: number;
  } | null;

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
        {/* Avatars des participants */}
        <div className="flex items-center shrink-0">
          {participantsList.slice(0, 3).map((dp, i) => {
            const p = dp.participants as { prenom: string; nom: string } | null;
            if (!p) return null;
            return (
              <span
                key={dp.id}
                className={`flex items-center justify-center size-14 sm:size-16 rounded-full bg-primary-light text-primary text-lg sm:text-xl font-bold border-2 border-surface ${
                  i > 0 ? "-ml-3" : ""
                }`}
                title={`${p.prenom} ${p.nom}`}
              >
                {p.prenom.charAt(0).toUpperCase()}{p.nom.charAt(0).toUpperCase()}
              </span>
            );
          })}
          {participantsList.length > 3 && (
            <span className="flex items-center justify-center size-14 sm:size-16 rounded-full bg-muted text-muted-foreground text-lg sm:text-xl font-bold border-2 border-surface -ml-3">
              +{participantsList.length - 3}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {suivi.nom}
          </h1>
          {hasParticipants ? (
            <p className="text-sm text-muted mt-1">
              {participantsList.length} participant{participantsList.length > 1 ? "s" : ""}
              {firstParticipant && ` · ${firstParticipant.prenom} ${firstParticipant.nom}`}
              {participantsList.length > 1 && " et +"}
            </p>
          ) : (
            <p className="text-sm text-muted mt-1">
              Aucun participant dans ce dossier
            </p>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0 self-start sm:self-center flex-wrap">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-success/10 text-success">
            Suivi actif
          </span>
        </div>
      </div>

      {/* ─── Section Participants ─── */}
      <div className="mb-10">
        <DossierParticipantManager
          dossierId={id}
          initialParticipants={participantsList}
        />
      </div>

      {/* ─── Onglets Évaluation / Programme ─── */}
      <SuiviNutritionnelTabs suivi={suivi} />
    </div>
  );
}