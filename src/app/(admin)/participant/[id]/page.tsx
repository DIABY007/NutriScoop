import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { DailyTrackingForm } from "@/components/daily-tracking-form";
import { DailyTrackingHistory } from "@/components/daily-tracking-history";
import { DeleteParticipantButton } from "@/components/delete-participant-button";

type PageProps = {
  params: Promise<{ id: string }>;
};

function formatJsonValue(val: unknown): string {
  if (val === null || val === undefined) return "—";
  if (typeof val === "string") return val;
  if (typeof val === "number") return String(val);
  return JSON.stringify(val);
}

export default async function ParticipantProfilePage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: participant, error } = await supabase
    .from("participants")
    .select("*, challenges(nom)")
    .eq("id", id)
    .single();

  if (error || !participant) notFound();

  const { data: evalData } = await supabase
    .from("evaluations_initiales")
    .select("*")
    .eq("participant_id", id)
    .single();

  const { data: trackingEntries } = await supabase
    .from("daily_tracking")
    .select("*")
    .eq("participant_id", id)
    .order("date", { ascending: false });

  const entries = trackingEntries ?? [];
  const challengeNom = (participant.challenges as { nom: string } | null)?.nom ?? "Challenge";

  const sexeLabel =
    participant.sexe === "homme" ? "Homme" : participant.sexe === "femme" ? "Femme" : "Autre";

  const dateDebut = new Date(participant.created_at).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const initiales = `${participant.prenom.charAt(0).toUpperCase()}${participant.nom.charAt(0).toUpperCase()}`;

  const ev = evalData as {
    profession?: string | null;
    objectifs?: string | null;
    historique_poids?: { historique?: string } | null;
    etat_sante?: { maladies?: string | null; allergies?: string | null; traitements?: string | null } | null;
    digestion_habitudes?: { digestion?: string | null; habitudes_alimentaires?: string | null; hydratation?: string | null } | null;
    sommeil_stress?: string | null;
    mensurations?: {
      taille_cm?: number | null;
      tour_taille_cm?: number | null;
      tour_hanches_cm?: number | null;
      tour_bras_cm?: number | null;
      notes?: string | null;
    } | null;
  } | null;

  return (
    <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      {/* ─── Retour ─── */}
      <Link href={`/challenge/${participant.challenge_id}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-6 min-h-11 w-fit"
      >
        <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
        Retour au challenge — {challengeNom}
      </Link>

      {/* ─── Bannière ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-6 rounded-2xl bg-surface border border-border shadow-sm mb-8">
        <span className="flex items-center justify-center size-16 sm:size-20 rounded-full bg-primary-light text-primary text-xl sm:text-2xl font-bold shrink-0">
          {initiales}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {participant.prenom} {participant.nom}
          </h1>
          <p className="text-sm text-muted mt-1">
            {participant.age} ans · {sexeLabel}
            {ev?.profession ? ` · ${ev.profession}` : ""}
            · Inscrit depuis le {dateDebut}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 self-start sm:self-center flex-wrap">
          <Link href={`/suivi-nutritionnel/${participant.id}`}
            className="inline-flex items-center justify-center gap-2 min-h-11 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover active:scale-[0.97] transition-all duration-150 ease-out shadow-sm"
          >
            <svg className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
            </svg>
            Suivi nutritionnel
          </Link>
          <Link href={`/participant/${participant.id}/modifier`}
            className="inline-flex items-center justify-center gap-2 min-h-11 px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-sidebar-hover transition-colors"
          >
            <svg className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
            Modifier
          </Link>
          <DeleteParticipantButton participantId={participant.id} challengeId={participant.challenge_id}
            participantNom={participant.nom} participantPrenom={participant.prenom} />
        </div>
      </div>

      {/* ─── Section : Infos de base ─── */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Informations générales</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1 p-4 rounded-xl bg-surface border border-border shadow-sm">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Âge</span>
            <span className="text-lg font-semibold text-foreground">{participant.age} ans</span>
          </div>
          <div className="flex flex-col gap-1 p-4 rounded-xl bg-surface border border-border shadow-sm">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sexe</span>
            <span className="text-lg font-semibold text-foreground">{sexeLabel}</span>
          </div>
          <div className="flex flex-col gap-1 p-4 rounded-xl bg-surface border border-border shadow-sm">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Poids</span>
            <span className="text-lg font-semibold text-foreground">{participant.poids_initial} kg</span>
          </div>
          <div className="flex flex-col gap-1 p-4 rounded-xl bg-surface border border-border shadow-sm">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Inscrit le</span>
            <span className="text-lg font-semibold text-foreground">{dateDebut}</span>
          </div>
        </div>
      </section>

      {/* ─── Section : Objectifs & Santé ─── */}
      {ev && (ev.objectifs || ev.etat_sante?.maladies || ev.etat_sante?.allergies || ev.etat_sante?.traitements || ev.historique_poids) && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Objectifs & Santé</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ev.objectifs && (
              <div className="col-span-1 sm:col-span-2 flex flex-col gap-1 p-4 rounded-xl bg-surface border border-border shadow-sm">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Objectifs</span>
                <p className="text-sm text-foreground leading-relaxed">{ev.objectifs}</p>
              </div>
            )}
            {ev.historique_poids?.historique && (
              <div className="flex flex-col gap-1 p-4 rounded-xl bg-surface border border-border shadow-sm">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Historique du poids</span>
                <p className="text-sm text-foreground leading-relaxed">{ev.historique_poids.historique}</p>
              </div>
            )}
            {ev.etat_sante?.maladies && (
              <div className="flex flex-col gap-1 p-4 rounded-xl bg-surface border border-border shadow-sm">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Maladies / Conditions</span>
                <p className="text-sm text-foreground leading-relaxed">{ev.etat_sante.maladies}</p>
              </div>
            )}
            {ev.etat_sante?.allergies && (
              <div className="flex flex-col gap-1 p-4 rounded-xl bg-surface border border-border shadow-sm">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Allergies / Intolérances</span>
                <p className="text-sm text-foreground leading-relaxed">{ev.etat_sante.allergies}</p>
              </div>
            )}
            {ev.etat_sante?.traitements && (
              <div className="flex flex-col gap-1 p-4 rounded-xl bg-surface border border-border shadow-sm">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Traitements en cours</span>
                <p className="text-sm text-foreground leading-relaxed">{ev.etat_sante.traitements}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── Section : Mode de vie ─── */}
      {ev && (ev.digestion_habitudes?.digestion || ev.digestion_habitudes?.habitudes_alimentaires || ev.digestion_habitudes?.hydratation || ev.sommeil_stress) && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Mode de vie</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ev.digestion_habitudes?.digestion && (
              <div className="flex flex-col gap-1 p-4 rounded-xl bg-surface border border-border shadow-sm">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Digestion</span>
                <p className="text-sm text-foreground leading-relaxed">{ev.digestion_habitudes.digestion}</p>
              </div>
            )}
            {ev.digestion_habitudes?.habitudes_alimentaires && (
              <div className="flex flex-col gap-1 p-4 rounded-xl bg-surface border border-border shadow-sm">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Habitudes alimentaires</span>
                <p className="text-sm text-foreground leading-relaxed">{ev.digestion_habitudes.habitudes_alimentaires}</p>
              </div>
            )}
            {ev.digestion_habitudes?.hydratation && (
              <div className="flex flex-col gap-1 p-4 rounded-xl bg-surface border border-border shadow-sm">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Hydratation</span>
                <p className="text-sm text-foreground leading-relaxed">{ev.digestion_habitudes.hydratation}</p>
              </div>
            )}
            {ev.sommeil_stress && (
              <div className="flex flex-col gap-1 p-4 rounded-xl bg-surface border border-border shadow-sm">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sommeil & Stress</span>
                <p className="text-sm text-foreground leading-relaxed">{ev.sommeil_stress}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── Section : Mensurations ─── */}
      {ev?.mensurations && (ev.mensurations.taille_cm || ev.mensurations.tour_taille_cm || ev.mensurations.tour_hanches_cm || ev.mensurations.tour_bras_cm) && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Mensurations corporelles</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {ev.mensurations.taille_cm && (
              <div className="flex flex-col gap-1 p-4 rounded-xl bg-surface border border-border shadow-sm">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Taille</span>
                <span className="text-lg font-semibold text-foreground">{ev.mensurations.taille_cm} cm</span>
              </div>
            )}
            {ev.mensurations.tour_taille_cm && (
              <div className="flex flex-col gap-1 p-4 rounded-xl bg-surface border border-border shadow-sm">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tour de taille</span>
                <span className="text-lg font-semibold text-foreground">{ev.mensurations.tour_taille_cm} cm</span>
              </div>
            )}
            {ev.mensurations.tour_hanches_cm && (
              <div className="flex flex-col gap-1 p-4 rounded-xl bg-surface border border-border shadow-sm">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tour de hanches</span>
                <span className="text-lg font-semibold text-foreground">{ev.mensurations.tour_hanches_cm} cm</span>
              </div>
            )}
            {ev.mensurations.tour_bras_cm && (
              <div className="flex flex-col gap-1 p-4 rounded-xl bg-surface border border-border shadow-sm">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tour de bras</span>
                <span className="text-lg font-semibold text-foreground">{ev.mensurations.tour_bras_cm} cm</span>
              </div>
            )}
          </div>
          {ev.mensurations.notes && (
            <div className="flex flex-col gap-1 p-4 rounded-xl bg-surface border border-border shadow-sm mt-4">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Notes</span>
              <p className="text-sm text-foreground leading-relaxed">{ev.mensurations.notes}</p>
            </div>
          )}
        </section>
      )}

      {/* ─── Section : Suivi Quotidien (Phase 4) ─── */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Suivi Quotidien</h2>
        <DailyTrackingForm participantId={id} />
      </section>

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