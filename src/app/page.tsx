import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { ParticipantList } from "@/components/participant-list";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: participants } = await supabase
    .from("participants")
    .select("*")
    .order("created_at", { ascending: false });

  const hasParticipants = participants && participants.length > 0;

  return (
    <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      {/* ─── En-tête ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Tableau de bord — Suivi
          </h1>
          <p className="mt-1 text-sm text-muted">
            {hasParticipants
              ? `${participants.length} participant${participants.length > 1 ? "s" : ""} suivis`
              : "Gérez et consultez le suivi de vos participants."}
          </p>
        </div>

        <Link
          href="/nouveau-participant"
          className="hidden sm:inline-flex items-center justify-center gap-2 min-h-11 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover transition-colors shadow-sm"
        >
          <svg
            className="size-5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Nouveau Participant
        </Link>
      </div>

      {/* ─── Contenu principal ─── */}
      {hasParticipants ? (
        <ParticipantList participants={participants} />
      ) : (
        /* ─── Empty State ─── */
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center text-center max-w-sm">
            <div className="mb-6" aria-hidden="true">
              <svg
                width="160"
                height="120"
                viewBox="0 0 160 120"
                fill="none"
                className="text-muted-foreground/30"
              >
                <ellipse cx="80" cy="70" rx="52" ry="36" fill="currentColor" />
                <ellipse
                  cx="80"
                  cy="70"
                  rx="52"
                  ry="36"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                  className="text-muted-foreground/20"
                />
                <path
                  d="M48 28v22c0 6-5 10-10 10s-10-4-10-10V28"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="text-muted-foreground/40"
                />
                <path
                  d="M38 28v12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="text-muted-foreground/40"
                />
                <path
                  d="M112 28v28c0 6-5 10-10 10s-10-4-10-10V28"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="text-muted-foreground/40"
                />
                <path
                  d="M112 36h-8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="text-muted-foreground/40"
                />
                <circle cx="70" cy="62" r="3" fill="currentColor" className="text-muted-foreground/20" />
                <circle cx="82" cy="58" r="2" fill="currentColor" className="text-muted-foreground/20" />
                <circle cx="76" cy="74" r="2.5" fill="currentColor" className="text-muted-foreground/20" />
                <circle cx="90" cy="68" r="2" fill="currentColor" className="text-muted-foreground/20" />
                <circle cx="64" cy="70" r="2" fill="currentColor" className="text-muted-foreground/20" />
              </svg>
            </div>

            <h2 className="text-xl font-semibold text-foreground mb-2">
              Aucun participant enregistré
            </h2>
            <p className="text-sm text-muted leading-relaxed mb-8 max-w-xs">
              Commencez par ajouter votre premier participant pour débuter le
              suivi nutritionnel et sportif.
            </p>

            <Link
              href="/nouveau-participant"
              className="inline-flex items-center justify-center gap-2 min-h-12 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover transition-colors shadow-sm"
            >
              <svg
                className="size-5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Ajouter un participant
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}