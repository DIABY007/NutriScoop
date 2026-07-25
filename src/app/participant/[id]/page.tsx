import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { DailyTrackingForm } from "@/components/daily-tracking-form";
import { DailyTrackingHistory } from "@/components/daily-tracking-history";
import { DeleteParticipantButton } from "@/components/delete-participant-button";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ParticipantProfilePage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // ─── Récupération du participant ───
  const { data: participant, error } = await supabase
    .from("participants")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !participant) {
    notFound();
  }

  // ─── Récupération de l'historique ───
  const { data: trackingEntries } = await supabase
    .from("daily_tracking")
    .select("*")
    .eq("participant_id", id)
    .order("date", { ascending: false });

  const entries = trackingEntries ?? [];

  const sexeLabel =
    participant.sexe === "homme"
      ? "Homme"
      : participant.sexe === "femme"
        ? "Femme"
        : "Autre";

  const dateDebut = new Date(participant.date_debut).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const initiales = `${participant.prenom.charAt(0).toUpperCase()}${participant.nom.charAt(0).toUpperCase()}`;

  return (
    <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      {/* ─── Retour ─── */}
      <Link
        href="/"
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
        Retour au tableau de bord
      </Link>

      {/* ─── Bannière / En-tête du profil ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-6 rounded-2xl bg-surface border border-border shadow-sm mb-8">
        <span className="flex items-center justify-center size-16 sm:size-20 rounded-full bg-primary-light text-primary text-xl sm:text-2xl font-bold shrink-0">
          {initiales}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {participant.prenom} {participant.nom}
          </h1>
          <p className="text-sm text-muted mt-1">
            {participant.age} ans · {sexeLabel} · Suivi depuis le {dateDebut}
          </p>
          {participant.objectif && (
            <p className="text-sm text-muted mt-2 max-w-lg leading-relaxed">
              <span className="text-foreground font-medium">Objectif : </span>
              {participant.objectif}
            </p>
          )}
        </div>

        {/* Boutons d'action */}
        <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
          <Link
            href={`/participant/${participant.id}/modifier`}
            className="inline-flex items-center justify-center gap-2 min-h-11 px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-sidebar-hover transition-colors"
          >
            <svg className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
            Modifier
          </Link>
          <DeleteParticipantButton
            participantId={participant.id}
            participantNom={participant.nom}
            participantPrenom={participant.prenom}
          />
        </div>
      </div>

      {/* ─── Section : Informations du Profil ─── */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Informations du Profil
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1 p-4 rounded-xl bg-surface border border-border shadow-sm">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Âge
            </span>
            <span className="text-lg font-semibold text-foreground">
              {participant.age} ans
            </span>
          </div>
          <div className="flex flex-col gap-1 p-4 rounded-xl bg-surface border border-border shadow-sm">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Sexe
            </span>
            <span className="text-lg font-semibold text-foreground">
              {sexeLabel}
            </span>
          </div>
          <div className="flex flex-col gap-1 p-4 rounded-xl bg-surface border border-border shadow-sm">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Poids initial
            </span>
            <span className="text-lg font-semibold text-foreground">
              {participant.poids_initial} kg
            </span>
          </div>
          <div className="flex flex-col gap-1 p-4 rounded-xl bg-surface border border-border shadow-sm">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Date de début
            </span>
            <span className="text-lg font-semibold text-foreground">
              {dateDebut}
            </span>
          </div>
        </div>
        {participant.objectif && (
          <div className="flex flex-col gap-1 p-4 rounded-xl bg-surface border border-border shadow-sm mt-4">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Objectif
            </span>
            <p className="text-sm text-foreground leading-relaxed">
              {participant.objectif}
            </p>
          </div>
        )}
      </section>

      {/* ─── Section : Formulaire de suivi quotidien ─── */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Tableau de Suivi Quotidien
        </h2>
        <DailyTrackingForm participantId={id} />
      </section>

      {/* ─── Section : Historique ─── */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Historique des suivis
          {entries.length > 0 && (
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({entries.length} entrée{entries.length > 1 ? "s" : ""})
            </span>
          )}
        </h2>
        <DailyTrackingHistory entries={entries} />
      </section>
    </div>
  );
}