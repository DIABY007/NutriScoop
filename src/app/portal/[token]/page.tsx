import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import ProgressGauge from "@/components/progress-gauge";

type PageProps = {
  params: Promise<{ token: string }>;
};

export default async function PatientPortalPage({ params }: PageProps) {
  const { token } = await params;
  const supabase = await createClient();

  // ─── Recherche du suivi nutritionnel par access_token ───
  const { data: suivi, error } = await supabase
    .from("suivis_nutritionnels")
    .select("*, participants(id, nom, prenom)")
    .eq("access_token", token)
    .single();

  // ─── Token invalide ou expiré → 404 stylisée ───
  if (error || !suivi) {
    notFound();
  }

  const participant = suivi.participants as { id: string; nom: string; prenom: string };
  const prenom = participant.prenom;
  const initiales = `${prenom.charAt(0).toUpperCase()}${participant.nom.charAt(0).toUpperCase()}`;

  // ─── Niveau de suivi ───
  const niveauSuivi: Record<string, string> = {
    ESSENTIELLE: "Essentielle",
    RENFORCEE: "Renforcée",
    INTENSE: "Intense",
    CLINIQUE: "Clinique",
  };

  // ─── Pourcentage simulé (sera calculé depuis daily_tracking plus tard) ───
  const progression = 75;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ─── Header minimal ─── */}
      <header className="sticky top-0 z-30 bg-surface border-b border-border safe-area-top">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center gap-3">
          <span className="flex items-center justify-center size-9 rounded-xl bg-primary text-primary-foreground text-lg font-bold shrink-0">
            A
          </span>
          <span className="text-foreground font-semibold text-lg">
            Aurore AgroVital
          </span>
        </div>
      </header>

      {/* ─── Contenu principal ─── */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 sm:py-12">
        {/* ─── Message de bienvenue ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 p-6 rounded-2xl bg-surface border border-border shadow-sm mb-8">
          <span className="flex items-center justify-center size-16 sm:size-20 rounded-full bg-primary-light text-primary text-xl sm:text-2xl font-bold shrink-0">
            {initiales}
          </span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Bonjour {prenom} 👋
            </h1>
            <p className="text-sm text-muted mt-1">
              Voici votre espace personnel de suivi nutritionnel.
              <br />
              Suivi {niveauSuivi[suivi.niveau_suivi] ?? suivi.niveau_suivi.toLowerCase()}
            </p>
          </div>
        </div>

        {/* ─── Jauge de progression ─── */}
        <section className="flex flex-col items-center p-6 sm:p-8 rounded-2xl bg-surface border border-border shadow-sm mb-8">
          <h2 className="text-base font-semibold text-foreground mb-6">
            Votre progression
          </h2>
          <div className="relative flex items-center justify-center">
            <ProgressGauge percentage={progression} size={160} strokeWidth={14} label="Complété" />
          </div>
          <p className="text-sm text-muted mt-4 text-center max-w-xs">
            Continuez vos efforts, chaque jour compte&nbsp;!
          </p>
        </section>

        {/* ─── Programme Nutritionnel ─── */}
        <section className="rounded-2xl bg-surface border border-border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/10">
            <h2 className="text-base font-semibold text-foreground">
              Votre programme nutritionnel
            </h2>
          </div>

          {suivi.programme_nutritionnel ? (
            <div
              className="px-6 py-6 prose prose-sm sm:prose-base max-w-none text-foreground [&_h1]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_p]:text-foreground [&_li]:text-foreground [&_strong]:text-foreground"
              dangerouslySetInnerHTML={{ __html: suivi.programme_nutritionnel }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <svg
                className="size-10 text-muted-foreground/30 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <p className="text-sm text-muted">
                Aucun programme nutritionnel n&apos;a encore été défini.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Votre nutritionniste mettra bientôt votre programme à jour.
              </p>
            </div>
          )}
        </section>

        {/* ─── Pied de page ─── */}
        <footer className="mt-12 text-center">
          <p className="text-xs text-muted-foreground">
            Aurore AgroVital &mdash; Suivi nutritionnel personnalisé
          </p>
        </footer>
      </main>
    </div>
  );
}