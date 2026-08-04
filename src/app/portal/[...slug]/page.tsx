import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import ProgressGauge, { ProgressBar } from "@/components/progress-gauge";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

const NIVEAU_LABEL: Record<string, string> = {
  ESSENTIELLE: "Essentielle",
  RENFORCEE: "Renforcée",
  INTENSE: "Intense",
  CLINIQUE: "Clinique",
};

const BADGE_COULEUR: Record<string, string> = {
  ESSENTIELLE: "bg-success/10 text-success",
  RENFORCEE: "bg-info/10 text-info",
  INTENSE: "bg-warning/10 text-warning",
  CLINIQUE: "bg-destructive/10 text-destructive",
};

export default async function PatientPortalPage({ params }: PageProps) {
  const { slug } = await params;
  const token = slug[slug.length - 1];
  if (!token) notFound();

  const supabase = await createClient();

  // ─── Chercher le token dans dossier_participants ───
  const { data: link, error: linkError } = await supabase
    .from("dossier_participants")
    .select("*, participants(*), suivis_nutritionnels(*)")
    .eq("access_token", token)
    .single();

  if (linkError || !link) notFound();

  const participant = link.participants as { id: string; nom: string; prenom: string };
  const suivi = link.suivis_nutritionnels as {
    nom: string;
    niveau_suivi: string;
  } | null;

  // Évaluation et programme sont maintenant sur dossier_participants
  const programme_nutritionnel = link.programme_nutritionnel as string | null;
  const evaluation_nutritionnelle = link.evaluation_nutritionnelle as Record<string, unknown> | null;

  const prenom = participant.prenom;
  const initiales = `${prenom.charAt(0).toUpperCase()}${participant.nom.charAt(0).toUpperCase()}`;
  const niveau = suivi?.niveau_suivi ?? "ESSENTIELLE";

  // ─── Tracking ───
  const { data: trackingData } = await supabase
    .from("daily_tracking")
    .select("score_total, score_sport, note_sommeil, note_stress")
    .eq("participant_id", participant.id)
    .order("date", { ascending: false });

  const nbEntries = trackingData?.length ?? 0;
  const progression = nbEntries > 0
    ? Math.round(trackingData!.reduce((s, t) => s + (t.score_total ?? 0), 0) / nbEntries)
    : 0;
  const moyenneSport = nbEntries > 0
    ? Math.round(trackingData!.reduce((s, t) => s + (t.score_sport ?? 0), 0) / nbEntries)
    : 0;
  const derniereEntree = trackingData?.[0] ?? null;

  // ─── Évaluation (pour RENFORCEE+) ───
  const evalData = niveau !== "ESSENTIELLE"
    ? (evaluation_nutritionnelle as Record<string, string> | null)
    : null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-30 bg-surface border-b border-border safe-area-top">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center gap-3">
          <span className="flex items-center justify-center size-9 rounded-xl bg-primary text-primary-foreground text-lg font-bold shrink-0">A</span>
          <span className="text-foreground font-semibold text-lg">Aurore AgroVital</span>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 sm:py-12 space-y-6">
        {/* ─── Bienvenue ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 p-6 rounded-2xl bg-surface border border-border shadow-sm">
          <span className="flex items-center justify-center size-16 sm:size-20 rounded-full bg-primary-light text-primary text-xl sm:text-2xl font-bold shrink-0">
            {initiales}
          </span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Bonjour {prenom} 👋
            </h1>
            <p className="text-sm text-muted mt-1">
              Votre espace personnel de suivi nutritionnel.
              <br />
              Suivi{" "}
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${BADGE_COULEUR[niveau] ?? "bg-muted/30 text-muted-foreground"}`}>
                {NIVEAU_LABEL[niveau] ?? niveau.toLowerCase()}
              </span>
            </p>
          </div>
        </div>

        {/* ─── Jauge ─── */}
        <section className="flex flex-col items-center p-6 sm:p-8 rounded-2xl bg-surface border border-border shadow-sm">
          <h2 className="text-base font-semibold text-foreground mb-6">Votre progression</h2>
          <div className="relative flex items-center justify-center">
            <ProgressGauge percentage={progression} size={160} strokeWidth={14} label="Complété" />
          </div>
          <p className="text-sm text-muted mt-4 text-center max-w-xs">
            {nbEntries > 0
              ? `${nbEntries} jour${nbEntries > 1 ? "s" : ""} de suivi — continuez vos efforts !`
              : "Commencez votre suivi pour voir votre progression."}
          </p>
        </section>

        {/* ─── Programme (tous les niveaux) ─── */}
        <section className="rounded-2xl bg-surface border border-border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/10">
            <h2 className="text-base font-semibold text-foreground">Votre programme nutritionnel</h2>
          </div>
          {programme_nutritionnel ? (
            <div
              className="px-6 py-6 prose prose-sm sm:prose-base max-w-none text-foreground [&_h1]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_p]:text-foreground [&_li]:text-foreground [&_strong]:text-foreground"
              dangerouslySetInnerHTML={{ __html: programme_nutritionnel }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <svg className="size-10 text-muted-foreground/30 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <p className="text-sm text-muted">Aucun programme défini pour le moment.</p>
              <p className="text-xs text-muted-foreground mt-1">Votre nutritionniste mettra bientôt votre programme à jour.</p>
            </div>
          )}
        </section>

        {/* ─── RENFORCEE+ : Résumé évaluation ─── */}
        {(niveau === "RENFORCEE" || niveau === "INTENSE" || niveau === "CLINIQUE") && evalData && (
          <section className="rounded-2xl bg-surface border border-border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/10">
              <h2 className="text-base font-semibold text-foreground">Résumé de votre évaluation</h2>
            </div>
            <div className="px-6 py-5 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              {evalData.objectif_principal && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">Objectif</span>
                  <span className="font-medium text-foreground">{evalData.objectif_principal}</span>
                </div>
              )}
              {evalData.poids && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">Poids</span>
                  <span className="font-medium text-foreground">{evalData.poids} kg</span>
                </div>
              )}
              {evalData.imc && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">IMC</span>
                  <span className="font-medium text-foreground">{evalData.imc}</span>
                </div>
              )}
              {evalData.sommeil && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">Sommeil</span>
                  <span className="font-medium text-foreground">{evalData.sommeil}</span>
                </div>
              )}
              {evalData.stress && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">Stress</span>
                  <span className="font-medium text-foreground">{evalData.stress}</span>
                </div>
              )}
              {evalData.energie && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">Énergie</span>
                  <span className="font-medium text-foreground">{evalData.energie}</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ─── INTENSE / CLINIQUE : Stats tracking ─── */}
        {(niveau === "INTENSE" || niveau === "CLINIQUE") && nbEntries > 0 && (
          <section className="rounded-2xl bg-surface border border-border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/10">
              <h2 className="text-base font-semibold text-foreground">Vos statistiques</h2>
            </div>
            <div className="px-6 py-5 space-y-4">
              <ProgressBar percentage={moyenneSport} label="Score sport moyen" />
              {derniereEntree?.note_sommeil !== null && derniereEntree?.note_sommeil !== undefined && (
                <ProgressBar percentage={derniereEntree.note_sommeil * 10} label="Dernière qualité de sommeil" />
              )}
              {derniereEntree?.note_stress !== null && derniereEntree?.note_stress !== undefined && (
                <ProgressBar percentage={Math.max(0, 100 - derniereEntree.note_stress * 10)} label="Dernier niveau de sérénité" />
              )}
            </div>
          </section>
        )}

        {/* ─── CLINIQUE : Notes complémentaires ─── */}
        {niveau === "CLINIQUE" && evalData?.notes && (
          <section className="rounded-2xl bg-surface border border-border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/10">
              <h2 className="text-base font-semibold text-foreground">Notes cliniques</h2>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{evalData.notes}</p>
            </div>
          </section>
        )}

        <footer className="text-center pt-4">
          <p className="text-xs text-muted-foreground">Aurore AgroVital &mdash; Suivi nutritionnel personnalisé</p>
        </footer>
      </main>
    </div>
  );
}