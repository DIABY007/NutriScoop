import type { DailyTracking } from "@/types";

type Props = {
  entries: DailyTracking[];
};

function getScoreColor(score: number): string {
  if (score >= 70) return "text-success bg-success/10";
  if (score >= 50) return "text-warning bg-warning/10";
  return "text-destructive bg-destructive/10";
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function DailyTrackingHistory({ entries }: Props) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 rounded-2xl bg-surface border border-dashed border-border text-center">
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
            d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605"
          />
        </svg>
        <p className="text-sm text-muted">
          Aucun suivi enregistré pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="text-left px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">
              Date
            </th>
            <th className="text-center px-3 py-3 font-medium text-muted-foreground whitespace-nowrap" title="Petit-déjeuner /40">
              P. Déj
            </th>
            <th className="text-center px-3 py-3 font-medium text-muted-foreground whitespace-nowrap" title="Déjeuner /40">
              Déj
            </th>
            <th className="text-center px-3 py-3 font-medium text-muted-foreground whitespace-nowrap" title="Dîner /40">
              Dîner
            </th>
            <th className="text-center px-3 py-3 font-medium text-muted-foreground whitespace-nowrap" title="Hydratation /20">
              Hydra.
            </th>
            <th className="text-center px-3 py-3 font-medium text-muted-foreground whitespace-nowrap" title="Sport /40">
              Sport
            </th>
            <th className="text-center px-3 py-3 font-medium text-muted-foreground whitespace-nowrap" title="Note sommeil /10">
              💤
            </th>
            <th className="text-center px-3 py-3 font-medium text-muted-foreground whitespace-nowrap" title="Note stress /10">
              😰
            </th>
            <th className="text-center px-3 py-3 font-medium text-muted-foreground whitespace-nowrap">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr
              key={entry.id}
              className={`border-b border-border/50 transition-colors hover:bg-muted/20 ${
                index === entries.length - 1 ? "border-b-0" : ""
              }`}
            >
              <td className="px-4 py-3 text-foreground font-medium whitespace-nowrap">
                {formatDate(entry.date)}
              </td>
              <td className="px-3 py-3 text-center text-foreground tabular-nums">
                {entry.score_petit_dej ?? "—"}
              </td>
              <td className="px-3 py-3 text-center text-foreground tabular-nums">
                {entry.score_dej ?? "—"}
              </td>
              <td className="px-3 py-3 text-center text-foreground tabular-nums">
                {entry.score_diner ?? "—"}
              </td>
              <td className="px-3 py-3 text-center text-foreground tabular-nums">
                {entry.score_hydratation ?? "—"}
              </td>
              <td className="px-3 py-3 text-center text-foreground tabular-nums">
                {entry.score_sport ?? "—"}
              </td>
              <td className="px-3 py-3 text-center text-muted-foreground tabular-nums">
                {entry.note_sommeil ?? "—"}
              </td>
              <td className="px-3 py-3 text-center text-muted-foreground tabular-nums">
                {entry.note_stress ?? "—"}
              </td>
              <td className="px-3 py-3 text-center">
                <span
                  className={`inline-flex items-center justify-center min-w-10 px-2 py-1 rounded-lg text-xs font-bold ${getScoreColor(entry.score_total)}`}
                >
                  {entry.score_total}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}