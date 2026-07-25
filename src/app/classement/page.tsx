import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Classement",
};

type ParticipantRow = {
  id: string;
  nom: string;
  prenom: string;
  daily_tracking: { score_total: number }[];
};

type Ranking = {
  rang: number;
  id: string;
  nom: string;
  prenom: string;
  score_cumule: number;
  nb_entries: number;
};

export default async function ClassementPage() {
  const supabase = await createClient();

  // ─── Récupération des participants avec leurs scores ───
  const { data: raw, error } = await supabase
    .from("participants")
    .select("id, nom, prenom, daily_tracking(score_total)")
    .order("nom", { ascending: true })
    .order("prenom", { ascending: true });

  if (error || !raw) {
    return (
      <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <svg className="size-12 text-destructive/60 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <h2 className="text-lg font-semibold text-foreground mb-1">Erreur de chargement</h2>
          <p className="text-sm text-muted">Impossible de récupérer les données du classement.</p>
        </div>
      </div>
    );
  }

  // ─── Agrégation : score cumulé par participant ───
  const rankings: Ranking[] = (raw as unknown as ParticipantRow[])
    .map((p) => {
      const scores = p.daily_tracking.map((d) => d.score_total ?? 0);
      return {
        id: p.id,
        nom: p.nom,
        prenom: p.prenom,
        score_cumule: scores.reduce((a, b) => a + b, 0),
        nb_entries: scores.length,
      };
    })
    // Tri : score cumulé DESC, puis nom ASC
    .sort((a, b) => {
      if (b.score_cumule !== a.score_cumule) return b.score_cumule - a.score_cumule;
      const cmp = a.nom.localeCompare(b.nom);
      if (cmp !== 0) return cmp;
      return a.prenom.localeCompare(b.prenom);
    })
    .map((item, index) => ({ ...item, rang: index + 1 }));

  const hasParticipants = rankings.length > 0;

  // ─── Top 3 ───
  const top3 = rankings.slice(0, 3);

  return (
    <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      {/* ─── En-tête ─── */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Classement
        </h1>
        <p className="mt-1 text-sm text-muted">
          {hasParticipants
            ? `${rankings.length} participant${rankings.length > 1 ? "s" : ""} classé${rankings.length > 1 ? "s" : ""} par score cumulé`
            : "Le classement des participants apparaîtra ici."}
        </p>
      </div>

      {!hasParticipants ? (
        /* ─── Empty State ─── */
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center text-center max-w-sm">
            <svg
              className="size-16 text-muted-foreground/30 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0 1 16.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 0 1-2.77.896m0 0a6.022 6.022 0 0 1-2.77-.896m0 0a6.023 6.023 0 0 1-2.77-.896"
              />
            </svg>
            <h2 className="text-lg font-semibold text-foreground mb-1">
              Aucun participant
            </h2>
            <p className="text-sm text-muted leading-relaxed">
              Ajoutez des participants et enregistrez leurs suivis quotidiens pour
              voir le classement apparaître.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* ─── Podium Top 3 (uniquement si ≥ 3 participants avec scores) ─── */}
          {top3.length >= 3 && top3[2].score_cumule > 0 && (
            <div className="flex items-end justify-center gap-4 mb-10">
              {/* 2e place (argent) */}
              {top3[1] && (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl" aria-hidden="true">🥈</span>
                  <span className="flex items-center justify-center size-10 rounded-full bg-gray-100 text-gray-600 font-bold text-sm">
                    {top3[1].prenom.charAt(0)}{top3[1].nom.charAt(0)}
                  </span>
                  <p className="text-xs font-medium text-foreground text-center leading-tight">
                    {top3[1].prenom}<br />{top3[1].nom}
                  </p>
                  <span className="text-sm font-bold text-foreground">
                    {top3[1].score_cumule}
                  </span>
                </div>
              )}

              {/* 1re place (or) */}
              <div className="flex flex-col items-center gap-2 -mt-4">
                <span className="text-3xl" aria-hidden="true">🥇</span>
                <span className="flex items-center justify-center size-12 rounded-full bg-yellow-100 text-yellow-700 font-bold text-base">
                  {top3[0].prenom.charAt(0)}{top3[0].nom.charAt(0)}
                </span>
                <p className="text-sm font-semibold text-foreground text-center leading-tight">
                  {top3[0].prenom}<br />{top3[0].nom}
                </p>
                <span className="text-lg font-bold text-foreground">
                  {top3[0].score_cumule}
                </span>
              </div>

              {/* 3e place (bronze) */}
              {top3[2] && (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl" aria-hidden="true">🥉</span>
                  <span className="flex items-center justify-center size-10 rounded-full bg-orange-100 text-orange-600 font-bold text-sm">
                    {top3[2].prenom.charAt(0)}{top3[2].nom.charAt(0)}
                  </span>
                  <p className="text-xs font-medium text-foreground text-center leading-tight">
                    {top3[2].prenom}<br />{top3[2].nom}
                  </p>
                  <span className="text-sm font-bold text-foreground">
                    {top3[2].score_cumule}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* ─── Tableau du classement ─── */}
          <div className="overflow-x-auto rounded-xl border border-border bg-surface">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground w-16">
                    Rang
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                    Participant
                  </th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">
                    Entrées
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">
                    Score Cumulé
                  </th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((entry, index) => {
                  const isTop3 = entry.rang <= 3;

                  const rowBg =
                    entry.rang === 1
                      ? "bg-yellow-50/50"
                      : entry.rang === 2
                        ? "bg-gray-50/50"
                        : entry.rang === 3
                          ? "bg-orange-50/50"
                          : "";

                  const medal =
                    entry.rang === 1
                      ? "🥇"
                      : entry.rang === 2
                        ? "🥈"
                        : entry.rang === 3
                          ? "🥉"
                          : null;

                  return (
                    <tr
                      key={entry.id}
                      className={`border-b border-border/50 transition-colors hover:bg-muted/20 ${
                        index === rankings.length - 1 ? "border-b-0" : ""
                      } ${rowBg}`}
                    >
                      {/* Rang */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {medal ? (
                            <span className="text-lg" aria-label={`${entry.rang}ère place`}>
                              {medal}
                            </span>
                          ) : (
                            <span className="text-foreground font-medium tabular-nums min-w-6">
                              {entry.rang}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Nom / Prénom */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <span className={`flex items-center justify-center size-9 rounded-full text-xs font-bold shrink-0 ${
                            entry.rang === 1
                              ? "bg-yellow-100 text-yellow-700"
                              : entry.rang === 2
                                ? "bg-gray-100 text-gray-600"
                                : entry.rang === 3
                                  ? "bg-orange-100 text-orange-600"
                                  : "bg-primary-light text-primary"
                          }`}>
                            {entry.prenom.charAt(0).toUpperCase()}
                            {entry.nom.charAt(0).toUpperCase()}
                          </span>
                          <span className="font-medium text-foreground">
                            {entry.prenom} {entry.nom}
                          </span>
                        </div>
                      </td>

                      {/* Nombre d'entrées */}
                      <td className="px-4 py-3 text-center text-muted-foreground tabular-nums">
                        {entry.nb_entries}
                      </td>

                      {/* Score cumulé */}
                      <td className="px-4 py-3 text-right">
                        <span className={`inline-flex items-center justify-center min-w-12 px-2.5 py-1 rounded-lg text-xs font-bold ${
                          entry.rang === 1
                            ? "bg-yellow-100 text-yellow-700"
                            : entry.rang === 2
                              ? "bg-gray-100 text-gray-600"
                              : entry.rang === 3
                                ? "bg-orange-100 text-orange-600"
                                : "bg-muted/30 text-foreground"
                        }`}>
                          {entry.score_cumule}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}