import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { DeleteSuiviButton } from "./delete-suivi-button";

async function getSuivis() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("suivis_nutritionnels")
    .select("*, participants(id, nom, prenom, challenge_id)")
    .order("created_at", { ascending: false });
  return data ?? [];
}

const NIVEAUX_LABEL: Record<string, { label: string; color: string }> = {
  ESSENTIELLE: { label: "Essentielle", color: "bg-success/10 text-success" },
  RENFORCEE: { label: "Renforcée", color: "bg-info/10 text-info" },
  INTENSE: { label: "Intense", color: "bg-warning/10 text-warning" },
  CLINIQUE: { label: "Clinique", color: "bg-destructive/10 text-destructive" },
};

export default async function SuiviNutritionnelListPage() {
  const suivis = await getSuivis();

  return (
    <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      {/* ─── En-tête ─── */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Suivi nutritionnel
        </h1>
        <p className="mt-1 text-sm text-muted">
          {suivis.length > 0
            ? `${suivis.length} dossier${suivis.length > 1 ? "s" : ""} de suivi`
            : "Créez votre premier dossier de suivi nutritionnel."}
        </p>
      </div>

      {/* ─── Bouton création ─── */}
      <div className="mb-8">
        <Link
          href="/suivi-nutritionnel/nouveau"
          className="inline-flex items-center justify-center gap-2 min-h-11 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover active:scale-[0.97] transition-all duration-150 ease-out shadow-sm"
        >
          <svg className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nouveau dossier de suivi
        </Link>
      </div>

      {/* ─── Liste des dossiers ─── */}
      {suivis.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {suivis.map((s) => {
            const participant = s.participants as { id: string; nom: string; prenom: string } | null;
            const niveau = NIVEAUX_LABEL[s.niveau_suivi] ?? { label: s.niveau_suivi, color: "bg-muted/30 text-muted-foreground" };

            return (
              <div
                key={s.id}
                className="flex flex-col rounded-xl bg-surface border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
              >
                <Link
                  href={`/suivi-nutritionnel/${s.id}`}
                  className="flex flex-col gap-3 p-5 flex-1"
                >
                  {/* En-tête */}
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold text-foreground">
                      {s.nom}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${niveau.color}`}>
                      {niveau.label}
                    </span>
                  </div>

                  {/* Participant */}
                  {participant && (
                    <div className="flex items-center gap-1.5 text-xs text-muted">
                      <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                      </svg>
                      {participant.prenom} {participant.nom}
                    </div>
                  )}

                  {/* Programme + évaluation status */}
                  <div className="flex items-center gap-3 pt-1 border-t border-border text-xs text-muted">
                    <span className={`flex items-center gap-1 ${s.evaluation_nutritionnelle ? "text-success" : ""}`}>
                      <span className={`size-1.5 rounded-full ${s.evaluation_nutritionnelle ? "bg-success" : "bg-muted-foreground"}`} />
                      Évaluation
                    </span>
                    <span className={`flex items-center gap-1 ${s.programme_nutritionnel ? "text-success" : ""}`}>
                      <span className={`size-1.5 rounded-full ${s.programme_nutritionnel ? "bg-success" : "bg-muted-foreground"}`} />
                      Programme
                    </span>
                  </div>
                </Link>

                {/* Actions */}
                <div className="px-5 pb-3">
                  <DeleteSuiviButton suiviId={s.id} suiviNom={s.nom} />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-16 px-4 rounded-2xl bg-surface border border-dashed border-border text-center">
          <svg className="size-10 text-muted-foreground/30 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
          </svg>
          <p className="text-sm text-muted">
            Aucun dossier de suivi nutritionnel pour le moment.
          </p>
          <Link
            href="/suivi-nutritionnel/nouveau"
            className="inline-flex items-center justify-center gap-2 min-h-11 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover active:scale-[0.97] transition-all duration-150 ease-out shadow-sm mt-4"
          >
            <svg className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Créer un dossier
          </Link>
        </div>
      )}
    </div>
  );
}